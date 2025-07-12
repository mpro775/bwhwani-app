import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from "react-native";
import CategoryHeader from "../../components/category/CategoryHeader";
import CategorySearchBar from "../../components/category/CategorySearchBar";
import SubCategoriesSlider from "../../components/category/SubCategoriesSlider";
import CategoryFiltersBar from "../../components/category/CategoryFiltersBar";
import CategoryItemCard from "../../components/category/CategoryItemCard";
import { useRoute, useNavigation } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { haversineDistance, estimateDuration } from "../../utils/distanceUtils";
import { fetchUserProfile } from "api/userApi";
import { DeliveryStore } from "types/types";
import DeliveryBannerSlider from "components/delivery/DeliveryBannerSlider";
import { API_URL } from "utils/api/config";
import DeliveryHeader from "components/delivery/DeliveryHeader";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "BusinessDetails"
>;
type CategoryDetailsRouteProp = RouteProp<
  RootStackParamList,
  "CategoryDetails"
>;

const CategoryDetailsScreen = () => {
  const route = useRoute<CategoryDetailsRouteProp>();
  const { categoryId, categoryName } = route.params;
  const navigation = useNavigation<NavigationProp>();

  const [stores, setStores] = useState<DeliveryStore[]>([]);
  const [loading, setLoading] = useState(true);
const [filterModal, setFilterModal] = useState(false);
const [activeFilters, setActiveFilters] = useState({
  meal: "",      // نوع الوجبة
  trending: false,
  featured: false,
  topRated: false,
  nearest: false,
  // ... إلخ
});
const filteredStores = stores.filter(store => {
  // وجبة
  if (activeFilters.meal && !(store.tags?.includes(activeFilters.meal))) return false;
  // رائج
  if (activeFilters.trending && !store.isTrending) return false;
  // مميز
  if (activeFilters.featured && !store.isFeatured) return false;
  return true;
});

// ترتيب حسب التقييم أو الأقرب
if (activeFilters.topRated) {
  filteredStores.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
} else if (activeFilters.nearest) {
  filteredStores.sort((a, b) => (parseFloat(a.distance || "0") || 0) - (parseFloat(b.distance || "0") || 0));
}
const handleFilterBarChange = (id: string) => {
  // نفذ أي منطق أو حدث تغيير
  // مثال: فلترة مباشرة حسب الأعلى تقييم أو المميز...
  // مثلا:
  if (id === "topRated") setActiveFilters(f => ({ ...f, topRated: true, nearest: false }));
  else if (id === "nearest") setActiveFilters(f => ({ ...f, nearest: true, topRated: false }));
  else if (id === "favorite") setActiveFilters(f => ({ ...f, favorite: true }));
  else setActiveFilters(f => ({ ...f, topRated: false, nearest: false, favorite: false }));
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API_URL}/delivery/stores?categoryId=${categoryId}`);
        const data = await res.json();

  

        let userLocation: { lat: number; lng: number } | null = null;

        try {
          const userData = await fetchUserProfile();
          userLocation = userData?.defaultAddress?.location || null;
        } catch (err) {
          console.log("⚠️ لم يتم تسجيل الدخول أو لا يوجد عنوان", err);
        }

        const finalStores = data.map((store: DeliveryStore) => {
          const storeLat = store?.location?.lat;
          const storeLng = store?.location?.lng;

          const validUserCoords =
            userLocation &&
            typeof userLocation.lat === "number" &&
            typeof userLocation.lng === "number";

          const validStoreCoords =
            typeof storeLat === "number" && typeof storeLng === "number";

     if (
  userLocation &&
  typeof userLocation.lat === "number" &&
  typeof userLocation.lng === "number" &&
  typeof storeLat === "number" &&
  typeof storeLng === "number"
) {
  const distanceKm = haversineDistance(
    userLocation.lat,
    userLocation.lng,
    storeLat,
    storeLng
  );

            return {
              ...store,
              distance: !isNaN(distanceKm) ? `${distanceKm.toFixed(2)} ` : "غير محدد",
              time: !isNaN(distanceKm) ? estimateDuration(distanceKm) : "غير محدد",
            };
          }

          return {
            ...store,
            distance: "غير محدد",
            time: "غير محدد",
          };
        });

        setStores(finalStores);
      } catch (error) {
        console.error("❌ فشل في جلب المتاجر", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#D84315" />
      </View>
    );
  }

return (
  <View style={styles.container}>
    {/* ✅ الهيدر الثابت */}
    <View style={styles.stickyHeader}>
      <DeliveryHeader />
    </View>

    {/* ✅ المحتوى القابل للتمرير */}
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <DeliveryBannerSlider />

    <View style={styles.filtersRow}>
  <CategoryFiltersBar onChange={handleFilterBarChange} />
  <TouchableOpacity
    style={styles.filterIconBtn}
    onPress={() => setFilterModal(true)}
  >
    <Text style={styles.filterIcon}>⚙️</Text>
  </TouchableOpacity>
</View>


      <View style={styles.itemsContainer}>
        {stores.length === 0 ? (
          <Text style={styles.emptyText}>لا توجد متاجر في هذه الفئة حالياً.</Text>
        ) : (
          stores.map((store) => (
            <CategoryItemCard
              key={store._id}
              item={{
                id: store._id,
                title: store.name,
                subtitle: store.address || "",
                distance: store.distance || "غير محدد",
                time: store.time || "غير محدد",
                rating: store.rating || 4.5,
                isOpen: true,
                isFavorite: false,
                tags: store.tags || [],
                image: { uri: store.image },
                logo: { uri: store.logo },
              }}
              onPress={() =>
                navigation.navigate("BusinessDetails", { business: store })
              }
            />
          ))
        )}
      </View>
      <Modal visible={filterModal} transparent animationType="fade">
  <View style={styles.modalOverlay}>
    <View style={styles.filterModalContent}>
      <Text style={styles.modalTitle}>تصفية المطاعم</Text>
      
      {/* نوع الوجبة */}
      <Text style={styles.filterLabel}>نوع الوجبة:</Text>
      <View style={styles.filterOptionsRow}>
        {["فطور", "غداء", "عشاء", "وجبات سريعة", "الكل"].map((meal) => (
          <TouchableOpacity
            key={meal}
            style={[
              styles.optionBtn,
              activeFilters.meal === meal && styles.activeOptionBtn,
            ]}
            onPress={() =>
              setActiveFilters((f) => ({ ...f, meal: f.meal === meal ? "" : meal }))
            }
          >
            <Text style={styles.optionText}>{meal}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* رائج - مميز */}
      <View style={{ flexDirection: "row", gap: 16, marginVertical: 12 }}>
        <TouchableOpacity
          style={[styles.checkBox, activeFilters.trending && styles.activeCheckBox]}
          onPress={() => setActiveFilters(f => ({ ...f, trending: !f.trending }))}
        >
          <Text>رائج</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.checkBox, activeFilters.featured && styles.activeCheckBox]}
          onPress={() => setActiveFilters(f => ({ ...f, featured: !f.featured }))}
        >
          <Text>مميز</Text>
        </TouchableOpacity>
      </View>

      {/* الأعلى تقييماً - الأقرب */}
      <View style={{ flexDirection: "row", gap: 16 }}>
        <TouchableOpacity
          style={[styles.checkBox, activeFilters.topRated && styles.activeCheckBox]}
          onPress={() => setActiveFilters(f => ({
            ...f, topRated: !f.topRated, nearest: false
          }))}
        >
          <Text>الأعلى تقييمًا</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.checkBox, activeFilters.nearest && styles.activeCheckBox]}
          onPress={() => setActiveFilters(f => ({
            ...f, nearest: !f.nearest, topRated: false
          }))}
        >
          <Text>الأقرب</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.applyBtn}
        onPress={() => setFilterModal(false)}
      >
        <Text style={styles.applyBtnText}>تطبيق التصفية</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    </ScrollView>
  </View>
);

};

export default CategoryDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  filtersRow: {
  flexDirection: "row-reverse", // للعربي. اجعلها "row" للإنجليزي
  alignItems: "center",
  marginBottom: 8,
  gap: 8, // لو مدعومة في RN لديك
},

  stickyHeader: {
    zIndex: 10,
    backgroundColor: "#fff",
    paddingBottom: 6,
   
  },
  filterIconBtn: {
  paddingHorizontal: 12,
  paddingVertical: 6,
  backgroundColor: "#FAFAFA",
  borderRadius: 16,
  marginRight: 8,
  elevation: 1,
},
modalTitle: {
  fontSize: 18,
  color: "#D84315",
  fontFamily: "Cairo-Bold",
  marginBottom: 10,
  alignSelf: "center",
},

filterIcon: {
  fontSize: 16,
  color: "#D84315",
  fontFamily: "Cairo-Bold",
},
filterModalContent: {
  backgroundColor: "#fff",
  borderRadius: 18,
  padding: 18,
  margin: 24,
  alignItems: "center",
},
optionBtn: {
  backgroundColor: "#F8F8F8",
  borderRadius: 12,
  paddingHorizontal: 16,
  paddingVertical: 6,
  marginHorizontal: 6,
  marginBottom: 6,
},
activeOptionBtn: {
  backgroundColor: "#D84315",
},
checkBox: {
  borderWidth: 1,
  borderColor: "#AAA",
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 8,
},
activeCheckBox: {
  backgroundColor: "#FFE7E2",
  borderColor: "#D84315",
},
applyBtn: {
  backgroundColor: "#D84315",
  borderRadius: 16,
  paddingHorizontal: 32,
  paddingVertical: 10,
  marginTop: 24,
},
applyBtnText: {
  color: "#fff",
  fontFamily: "Cairo-Bold",
  fontSize: 15,
},
optionText: {
  fontSize: 14,
  fontFamily: "Cairo-Bold",
  color: "#222",
  paddingHorizontal: 3,
},
filterLabel: {
  fontSize: 15,
  color: "#D84315",
  fontFamily: "Cairo-Bold",
  marginBottom: 4,
  alignSelf: "flex-start",
  marginTop: 8,
},
modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.18)",
  justifyContent: "center",
  alignItems: "center",
},
filterOptionsRow: {
  flexDirection: "row",
  flexWrap: "wrap",
  marginBottom: 10,
},


  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  section: {
    marginBottom: 10,
  },
  contentContainer: {
    paddingBottom: 20,
    paddingTop: 6,
  },
  itemsContainer: {
    marginTop: 20,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
    fontFamily: "Cairo-Regular",
  },
});

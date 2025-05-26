import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";
import CategoryHeader from "../../components/category/CategoryHeader";
import CategorySearchBar from "../../components/category/CategorySearchBar";
import CategoryBannerSlider from "../../components/category/CategoryBannerSlider";
import SubCategoriesSlider from "../../components/category/SubCategoriesSlider";
import CategoryFiltersBar from "../../components/category/CategoryFiltersBar";
import CategoryItemCard from "../../components/category/CategoryItemCard";
import { useRoute, useNavigation } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { API_BASE_URL } from "../../config/config";
import { haversineDistance, estimateDuration } from "../../utils/distanceUtils";
import { fetchUserProfile } from "api/userApi";
import { DeliveryStore } from "types/types";

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
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API_BASE_URL}/delivery/stores?categoryId=${categoryId}`);
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
              distance: !isNaN(distanceKm) ? `${distanceKm.toFixed(2)} كم` : "غير محدد",
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <CategoryHeader
        location="شارع الدوحة"
        onSharePress={() => console.log("تم الضغط على مشاركة")}
        onLocationPress={() => console.log("تغيير الموقع")}
      />

      <CategorySearchBar value={search} onChangeText={setSearch} />
      <CategoryBannerSlider />
      <SubCategoriesSlider
        subCategories={["مقبلات", "مشاوي", "وجبات سريعة", "العروض"]}
        onSelect={(val: string) => console.log("الفئة المختارة:", val)}
      />
      <CategoryFiltersBar
        onChange={(filterId: string) =>
          console.log("الفلتر المختار:", filterId)
        }
      />

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
    </ScrollView>
  );
};

export default CategoryDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingTop: 20,
    marginTop: 20,
    marginBottom: 60,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  itemsContainer: {
    marginTop: 20,
    gap: 20,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
    fontFamily: "Cairo-Regular",
  },
});

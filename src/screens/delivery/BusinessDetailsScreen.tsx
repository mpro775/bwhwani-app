import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import BusinessInfoCard from "../../components/business/BusinessInfoCard";
import BusinessTabs from "../../components/business/BusinessTabs";
import BusinessProductList from "../../components/business/BusinessProductList";
import FloatingCartButton from "../../components/FloatingCartButton";

import { RootStackParamList } from "../../types/navigation";
import { fetchWithAuth } from "api/authService";
import { useCart } from "../../context/CartContext";
import { API_URL } from "../../utils/api/config";
import { fetchUserProfile } from "api/userApi";
import { estimateDuration, haversineDistance } from "utils/distanceUtils";
import { isStoreOpenNow } from "utils/isStoreOpenNow";
import DeliveryHeader from "components/delivery/DeliveryHeader";

type SubCategory = { _id: string; name: string };
type StoreProduct = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  image: string;
  subCategoryId?: string;
};
type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: { uri: string };
};

type RouteProps = RouteProp<RootStackParamList, "BusinessDetails">;
type NavProps = NativeStackNavigationProp<RootStackParamList>;

export default function BusinessDetailsScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavProps>();
  const { business } = route.params;
  const { addToCart } = useCart();
  const [info, setInfo] = useState<any>(null);

  const [selectedTab, setSelectedTab] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<
    Record<string, Product[]>
  >({});
  useEffect(() => {
    const calcDistanceAndTime = async () => {
      // لو الوقت والمسافة موجودين في بيانات المتجر، استخدمهم مباشرة
      if (business.distance && business.time) {
        setInfo(business);
        return;
      }
      try {
        // جلب موقع المستخدم
        const userData = await fetchUserProfile();
        const userLocation = userData?.defaultAddress?.location;
        const storeLocation = business?.location;

        if (
          userLocation &&
          typeof userLocation.lat === "number" &&
          typeof userLocation.lng === "number" &&
          storeLocation &&
          typeof storeLocation.lat === "number" &&
          typeof storeLocation.lng === "number"
        ) {
          const distanceKm = haversineDistance(
            userLocation.lat,
            userLocation.lng,
            storeLocation.lat,
            storeLocation.lng
          );
          setInfo({
            ...business,
            distance: !isNaN(distanceKm)
              ? `${distanceKm.toFixed(2)} كم`
              : "غير محدد",
            time: !isNaN(distanceKm)
              ? estimateDuration(distanceKm)
              : "غير محدد",
          });
        } else {
          setInfo({
            ...business,
            distance: "غير محدد",
            time: "غير محدد",
          });
        }
      } catch (err) {
        setInfo({
          ...business,
          distance: "غير محدد",
          time: "غير محدد",
        });
      }
    };

    calcDistanceAndTime();
  }, [business]);
  useEffect(() => {
    const loadAll = async () => {
      try {
        const subRes = await fetchWithAuth(
          `${API_URL}/delivery/subcategories/store/${business._id}`
        );
        const subs: SubCategory[] = await subRes.json();

        const prodRes = await fetchWithAuth(
          `${API_URL}/delivery/products?storeId=${business._id}`
        );
        const prods: StoreProduct[] = await prodRes.json();

        const names = subs.map((s) => s.name);
        setCategories(names);

        const grouped: Record<string, Product[]> = {};
        subs.forEach((sub) => {
          grouped[sub.name] = prods
            .filter((p) => p.subCategoryId === sub._id)
            .map((p) => ({
              id: p._id,
              name: p.name,
              price: p.price,
              originalPrice: p.originalPrice,
              image: { uri: p.image },
              description: p.description, 
            }));
        });
        setProductsByCategory(grouped);

        setSelectedTab(names[0] || "");
      } catch (err) {
        console.error("خطأ في جلب بيانات صفحة المتجر:", err);
      }
    };

    loadAll();
  }, [business._id]);
  if (!info) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#D84315" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.stickyHeader}>
        <DeliveryHeader />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <BusinessInfoCard
          business={{
            ...info,
            categories: info?.categories || [],
            schedule: info?.schedule || [],
            name: info?.name || "",
            nameAr: info?.nameAr || "",
            logo: info?.logo || "",
            rating: typeof info?.rating === "number" ? info.rating : 0,
            distance: info?.distance || "غير محدد",
            time: info?.time || "غير محدد",
            isOpen: isStoreOpenNow(info?.schedule || []),
          }}
        />

        <View style={{ marginTop: 20, marginBottom: 16 }}>
          <BusinessTabs
            categories={categories}
            selected={selectedTab}
            onSelect={setSelectedTab}
          />
        </View>

        <BusinessProductList
          products={productsByCategory[selectedTab] || []}
          storeId={business._id}
          storeType={
            business.category.name === "بقالة" ? "grocery" : "restaurant"
          }
          onAdd={async (product, qty) => {
            const success = await addToCart({
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: qty,
              image: product.image,
              originalPrice: product.originalPrice,
              storeId: business._id,
              storeType:
                business.category.name === "بقالة" ? "grocery" : "restaurant",
            });
            if (success) {
              Alert.alert("✅ تمت الإضافة", "تمت إضافة المنتج إلى السلة بنجاح");
            } else {
              Alert.alert(
                "⚠️ تعارض في السلة",
                "لا يمكنك خلط منتجات من متاجر مختلفة"
              );
            }
          }}
        />

        <View style={styles.footerSpacing} />
      </ScrollView>

      <FloatingCartButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },

  storeName: {
    fontFamily: "Cairo-Bold",
    fontSize: 22,
    color: "#fff",
    textAlign: "center",
    marginTop: 8,
  },
  container: { flex: 1, backgroundColor: "#ffffff" },
  contentContainer: { padding: 16, paddingBottom: 100 },
  tabs: { marginTop: 16, marginBottom: 8 },
  tabIndicator: {
    backgroundColor: "#FF5E3A",
    height: 3,
    borderRadius: 2,
  },
  stickyHeader: {
    zIndex: 10, // تأكد أنه فوق
    backgroundColor: "#FFFFFF",
    paddingBottom: 6,
  },
  tabText: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 14,
    textTransform: "capitalize",
  },
  footerSpacing: { height: 80 },
});

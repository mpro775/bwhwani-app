import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import BusinessHeader from "../../components/business/BusinessHeader";
import BusinessInfoCard from "../../components/business/BusinessInfoCard";
import BusinessTabs from "../../components/business/BusinessTabs";
import BusinessProductList from "../../components/business/BusinessProductList";
import FloatingCartButton from "../../components/FloatingCartButton";

import { RootStackParamList } from "../../types/navigation";
import { fetchWithAuth } from "api/authService";
import { useCart } from "../../context/CartContext";
import { API_URL } from "utils/api/config";

// نوعات الراجعة من الباك
type SubCategory = { _id: string; name: string };
type StoreProduct = {
  _id: string;
  name: string;
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

  const [selectedTab, setSelectedTab] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<
    Record<string, Product[]>
  >({});

  useEffect(() => {
    const loadAll = async () => {
      try {
        // 1) جلب فئات فرعية للمتجر
        const subRes = await fetchWithAuth(
          `${API_URL}/delivery/subcategories/store/${business._id}`
        );
        const subs: SubCategory[] = await subRes.json();

        // 2) جلب منتجات المتجر
        const prodRes = await fetchWithAuth(
          `${API_URL}/delivery/products?storeId=${business._id}`
        );
        const prods: StoreProduct[] = await prodRes.json();

        // 3) بناء مصفوفة أسماء الفئات
        const names = subs.map((s) => s.name);
        setCategories(names);

        // 4) تجميع المنتجات حسب الفئة الفرعيّة
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
            }));
        });
        setProductsByCategory(grouped);

        // 5) اختر التاب الافتراضي (الأوّل)
        setSelectedTab(names[0] || "");
      } catch (err) {
        console.error("خطأ في جلب بيانات صفحة المتجر:", err);
      }
    };

    loadAll();
  }, [business._id]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <BusinessHeader
        image={{ uri: business.image }}
        onBackPress={() => navigation.goBack()}
        onSharePress={() => console.log("مشاركة")}
        onFavoritePress={() => console.log("إضافة للمفضلة")}
      />

      <BusinessInfoCard
        business={{
          ...business,
          categories,
          distance: business.distance || "غير محدد",
          time: business.time || "غير محدد",
        }}
      />

      <BusinessTabs
        categories={categories}
        selected={selectedTab}
        onSelect={setSelectedTab}
      />

    // BusinessDetailsScreen.tsx (مقتطف)
<BusinessProductList
  products={productsByCategory[selectedTab] || []}
  storeId={business._id}
  storeType={business.category.name === "بقالة" ? "grocery" : "restaurant"}
  onAdd={async (product, qty) => {
    const success = await addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: qty,
      image: product.image,
      originalPrice: product.originalPrice,
      storeId: business._id,
      storeType: business.category.name === "بقالة" ? "grocery" : "restaurant",
    });
    if (success) {
      Alert.alert("✅ تمت الإضافة", "تمت إضافة المنتج إلى السلة بنجاح");
    } else {
      Alert.alert("⚠️ تعارض في السلة", "لا يمكنك خلط منتجات من متاجر مختلفة");
    }
  }}
/>



      <FloatingCartButton />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 15, marginTop: 30 },
  contentContainer: { paddingBottom: 20 },
});

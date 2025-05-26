import React from "react";
import { useRoute } from "@react-navigation/native";
import { ScrollView, StyleSheet, View, Text } from "react-native";

import CategoryHeader from "../../components/category/CategoryHeader";
import CategorySearchBar from "../../components/category/CategorySearchBar";
import CategoryBannerSlider from "../../components/category/CategoryBannerSlider";
import GroceryProductCard from "../../components/grocery/GroceryProductCard";

type Product = {
  id: string;
  name: string;
  image: any;
  price: number;
  originalPrice?: number;
};

type RouteParams = {
  categoryTitle: string;
  products: Product[];
  banners?: any[];
};

const GroceryDetailsScreen = () => {
  const route = useRoute();
  const { categoryTitle, products, banners = [] } = route.params as RouteParams;

  return (
    <ScrollView style={styles.container}>
      <CategoryHeader location="شارع الدوحة" />
      <CategorySearchBar />
      <CategoryBannerSlider banners={banners} />

      <Text style={styles.sectionTitle}>منتجات {categoryTitle}</Text>

      <View style={styles.productsContainer}>
        {products.map((product) => (
          <GroceryProductCard
            key={product.id}
            product={product}
            onAdd={() => console.log("أضيف إلى السلة:", product.name)}
            onFavoriteToggle={() => console.log("مفضل:", product.name)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default GroceryDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3E2723",
    marginVertical: 10,
  },
  productsContainer: {
    gap: 15,
    paddingBottom: 30,
  },
});

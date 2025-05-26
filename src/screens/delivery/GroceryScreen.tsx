import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import CategoryBannerSlider from "../../components/category/CategoryBannerSlider";
import CategorySearchBar from "../../components/category/CategorySearchBar";
import CategoryHeader from "../../components/category/CategoryHeader";
import DeliveryHeader from "../../components/delivery/DeliveryHeader";
import DeliveryCategories from "../../components/delivery/DeliveryCategories";
import GroceryProductCard from "../../components/grocery/GroceryProductCard";
import FloatingCartButton from "../../components/FloatingCartButton";

// تعريف الألوان
const COLORS = {
  primary: "#D84315",
  secondary: "#5D4037",
  background: "#FFFFFF",
  text: "#4E342E",
  accent: "#8B4B47",
};
const trendingProducts = [
  {
    id: "p1",
    name: "موز يمني",
    price: 650,
    originalPrice: 800,
    image: require("../../../assets/products/banana.jpg"),
  },
  {
    id: "p2",
    name: "تفاح أمريكي",
    price: 1200,
    originalPrice: 1500,
    image: require("../../../assets/products/apple.jpg"),
  },
  {
    id: "p3",
    name: "لبن نادك",
    price: 300,
    originalPrice: 400,
    image: require("../../../assets/products/milk.jpg"),
  },
];

const GroceryHomeScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {/* العنوان */}
      <DeliveryHeader />
      {/* البحث */}
      <CategorySearchBar />
      {/* سلايدر إعلانات */}
      <CategoryBannerSlider
        banners={[
          require("../../../assets/banners/grocery1.jpg"),
          require("../../../assets/banners/grocery2.jpg"),
        ]}
      />
      <DeliveryCategories
        sectionTitle="فئات البقالة"
        categories={[
          {
            id: "f1",
            title: "الخضروات",
            icon: require("../../../assets/icons/fruits.png"),
          },
          {
            id: "f2",
            title: "الألبان",
            icon: require("../../../assets/icons/milk.png"),
          },
          {
            id: "f3",
            title: "اللحوم",
            icon: require("../../../assets/icons/meat.png"),
          },
          {
            id: "f4",
            title: "المخبوزات",
            icon: require("../../../assets/icons/bread.png"),
          },
        ]}
        onSelectCategory={(id) => console.log("تم اختيار الفئة:", id)}
      />
      {/* الرائج اليوم */}
      <Text style={styles.sectionTitle}>الرائج اليوم</Text>
      <View style={{ marginTop: 10, marginBottom: 40 }}>
        <FlatList
          horizontal
          data={trendingProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ marginHorizontal: 8 }}>
              <GroceryProductCard product={item} />
            </View>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 8 }}
        />
      </View>{" "}
      <FloatingCartButton />
    </ScrollView>
  );
};

export default GroceryHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 40,
    backgroundColor: COLORS.background,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: COLORS.primary,
    fontFamily: "Cairo-Bold",
    textAlign: "right",
    marginBottom: 16,
  },
  categoriesContainer: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
  },

  icon: {
    width: 50,
    height: 50,
    marginBottom: 6,
  },
  catName: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    fontFamily: "Cairo-Regular",
  },
  categoriesSection: {
    marginTop: 24,
  },
  categoriesTitle: {
    fontSize: 22,
    color: COLORS.primary,
    fontFamily: "Cairo-Bold",
    textAlign: "right",
    marginBottom: 16,
  },
  categoryRows: {
    flexDirection: "column",
    gap: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  categoryCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryImage: {
    width: 60,
    height: 60,
    marginBottom: 8,
    resizeMode: "contain",
  },
  categoryText: {
    fontSize: 14,
    color: COLORS.text,
    fontFamily: "Cairo-Regular",
    textAlign: "center",
  },
});

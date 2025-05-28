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
import CategorySearchBar from "../../components/category/CategorySearchBar";
import CategoryHeader from "../../components/category/CategoryHeader";
import DeliveryHeader from "../../components/delivery/DeliveryHeader";
import DeliveryCategories from "../../components/delivery/DeliveryCategories";
import GroceryProductCard from "../../components/grocery/GroceryProductCard";
import FloatingCartButton from "../../components/FloatingCartButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "types/navigation";
import { useNavigation } from "@react-navigation/native";
import DeliveryTrending from "components/delivery/DeliveryTrending";
import DeliveryBannerSlider from "components/delivery/DeliveryBannerSlider";

// تعريف الألوان
const COLORS = {
  primary: "#D84315",
  secondary: "#5D4037",
  background: "#FFFFFF",
  text: "#4E342E",
  accent: "#8B4B47",
};
type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CategoryDetails"
>;


const GroceryHomeScreen = () => {
    const navigation = useNavigation<NavigationProp>();
  
  return (
    <ScrollView style={styles.container}>
      {/* العنوان */}
      <DeliveryHeader />
      {/* البحث */}
      <CategorySearchBar />
      {/* سلايدر إعلانات */}
      <DeliveryBannerSlider
      />
        <DeliveryCategories
              onSelectCategory={(id: string, title: string) =>
            navigation.navigate("CategoryDetails", {
                categoryId: id,

              categoryName: title,
            })
          }
        />
   <View style={styles.section}>
        <DeliveryTrending onSelect={(id) => console.log("تم الضغط على:", id)} />
      </View>
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
    section: {
    marginBottom: 10, // مسافة بين العناصر
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

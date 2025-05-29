// ✅ نسخة محسّنة من AllProductsScreen: تحسين الفلاتر + التحقق من وجود منتجات
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  I18nManager,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useRoute } from "@react-navigation/native";
import { fetchProducts } from "../../api/productApi";
import { Product } from "data/products";
import { fetchCategories } from "api/categoryApi";
import { isFavorite, addFavorite, removeFavorite } from "../../utils/favoratStorage";
import { fetchUserProfile } from "api/userApi";
import { FavoriteItem } from "types/types";
import ProductCard from "components/market/ProductCard";

const COLORS = {
  primary: "#D84315",
  secondary: "#5D4037",
  background: "#FFF8F0",
  text: "#4E342E",
  accent: "#8B4B47",
};

const { width } = Dimensions.get("window");
const itemsPerPage = 6;

const AllProductsScreen = () => {
  const route = useRoute<RouteProp<any, any>>();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
const [products, setProducts] = useState<Product[]>([]);
const [categories, setCategories] = useState<{ id: string; title: string }[]>([]);
const [loading, setLoading] = useState(false);
const [favoriteMap, setFavoriteMap] = useState<Record<string, boolean>>({});

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showOffersOnly, setShowOffersOnly] = useState(
    route.params?.showOffersOnly ?? false
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    route.params?.selectedCategoryId ?? "all"
  );
  type Category = {
  _id: string;
  name: string;
  image?: string;
};
  useEffect(() => {
  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
  const formatted = data.map((cat: Category) => ({
        id: cat._id,
        title: cat.name,
      }));
      setCategories(formatted);
    } catch (err) {
      console.error("فشل في تحميل الفئات", err);
    }
  };
  loadCategories();
}, []);
useEffect(() => {
  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts({
        category: selectedCategoryId,
        hasOffer: showOffersOnly,
        search: searchQuery,
        page: currentPage,
        limit: 6,
      });
      setProducts(data);
      const user = await fetchUserProfile();
const map: Record<string, boolean> = {};
for (const item of data) {
  map[item._id] = await isFavorite(item._id, "product");
}
setFavoriteMap(map);

    } catch (err) {
      console.error("خطأ في التحميل", err);
    } finally {
      setLoading(false);
    }
  };

  load();
}, [selectedCategoryId, searchQuery, showOffersOnly, currentPage]);


const renderCategoryFilter = () => (
  <FlatList
    horizontal
    data={[{ id: "all", title: "الكل" }, ...categories]}
    renderItem={({ item }) => (
      <TouchableOpacity
        onPress={() => {
          setSelectedCategoryId(item.id);
          setCurrentPage(1);
        }}
        style={[
          styles.category,
          selectedCategoryId === item.id && styles.categoryActive,
        ]}
      >
        <Text
          style={[
            styles.categoryText,
            selectedCategoryId === item.id && styles.categoryTextActive,
          ]}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    )}
    keyExtractor={(item) => item.id}
    contentContainerStyle={styles.categories}
    showsHorizontalScrollIndicator={false}
  />
);

 

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
const toggleFavorite = async (productId: string) => {
  const user = await fetchUserProfile();
  const current = favoriteMap[productId];
const item: FavoriteItem = {
  itemId: productId,
  itemType: "product",
  userId: user.id,
};

  if (current) {
    await removeFavorite(item);
  } else {
    await addFavorite(item);
  }

  setFavoriteMap((prev) => ({ ...prev, [productId]: !current }));
};
 const renderProduct = ({ item }: any) => (
  <ProductCard
    product={item}
    isFavorited={favoriteMap[item._id]}
    onToggleFavorite={toggleFavorite}
    onPress={() =>
      navigation.navigate("ProductDetails", {
        product: {
          ...item,
          media: item.media?.map((m: any) => ({
            ...m,
            uri: m.uri.startsWith("http") ? m.uri : `http://192.168.1.102:3000${m.uri}`,
          })) || [],
        },
      })
    }
  />
);
  return (
    <View style={styles.container}>
      {/* Filters */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.offerFilterButton,
            showOffersOnly && styles.offerFilterActive,
          ]}
          onPress={() => setShowOffersOnly((prev:Boolean) => !prev)}
        >
          <Text style={styles.offerFilterText}>
            {showOffersOnly ? "الكل" : "العروض"}
          </Text>
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color={COLORS.accent} />
          <TextInput
            style={styles.searchInput}
            placeholder="ابحث عن منتج..."
            placeholderTextColor="#9E9E9E"
            onChangeText={setSearchQuery}
            value={searchQuery}
          />
        </View>
      </View>

   

 <FlatList
  data={products.length === 0 ? [] : products}
  renderItem={products.length === 0 ? undefined : renderProduct}
  keyExtractor={(item) => item._id}
  numColumns={2}
  columnWrapperStyle={
    products.length > 1
      ? { justifyContent: "space-between", gap: 16 }
      : { justifyContent: "center" }
  }
  contentContainerStyle={styles.productsContainer}
  ListHeaderComponent={renderCategoryFilter}
  ListEmptyComponent={() => (
    <View style={{ alignItems: "center", marginTop: 50 }}>
      <Image
        source={require("../../../assets/empty-box.png")}
        style={{ width: 120, height: 120, marginBottom: 16 }}
      />
      <Text
        style={{ fontFamily: "Cairo-Bold", fontSize: 16, color: "#999" }}
      >
        لا توجد منتجات مطابقة
      </Text>
    </View>
  )}
/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    gap: 8,
  },
  offerFilterButton: { padding: 8, backgroundColor: "#EEE", borderRadius: 20 },
  offerFilterActive: { backgroundColor: COLORS.primary },
  offerFilterText: {
    fontFamily: "Cairo-Bold",
    fontSize: 14,
    color: COLORS.text,
  },
  searchContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    flex: 1,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    color: COLORS.text,
    textAlign: "right",
    marginStart: 8,
  },
  categories: { paddingHorizontal: 16 },

  categoryActive: { backgroundColor: COLORS.primary },
  category: {
    paddingHorizontal: 20,
    marginRight: 8,
    marginBottom: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 24,
  },
  categoryText: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 16,
    color: COLORS.text,
  },
  categoryTextActive: { color: "#FFF" },
  productsContainer: { padding: 16 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 16,
    flex: 1,
    elevation: 3,
    overflow: "hidden",
  },
  imageContainer: { height: 150, position: "relative" },
  image: { width: "100%", height: "100%", resizeMode: "cover" },
  offerBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: COLORS.primary,
    padding: 4,
    borderRadius: 8,
  },
  offerBadgeText: { color: "#FFF", fontSize: 12, fontFamily: "Cairo-Bold" },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 6,
    borderRadius: 20,
  },
  details: { padding: 12 },
  name: {
    fontFamily: "Cairo-Bold",
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
  },
  priceRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  price: { fontFamily: "Cairo-Bold", fontSize: 14, color: COLORS.primary },
  originalPrice: {
    fontFamily: "Cairo-Regular",
    fontSize: 12,
    color: "#888",
    textDecorationLine: "line-through",
  },
});

export default AllProductsScreen;

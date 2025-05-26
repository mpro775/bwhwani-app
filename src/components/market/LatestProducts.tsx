import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  I18nManager,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { fetchLatestProducts } from "api/productApi";
type Product = {
  _id: string;
  name: string;
  price: number;
  offerPrice?: number;
  hasOffer: boolean;
  media: { type: string; uri: string }[]; // ✅ تعديل هنا
  description: string;
  category: string;
  categoryId: string;
  user: {
    name: string;
    phone: string;
    profileImage: string;
  };
  createdAt: string;
  viewsCount: number;
  location: string;
  comments: { user: string; text: string }[];
};

type MarketStackParamList = {
  AllProducts: { showOffersOnly: boolean };
  ProductDetails: { product: Product };
};
const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.65;
const CARD_MARGIN = 12;

const LatestProducts = () => {
const [latestProducts, setLatestProducts] = useState<Product[]>([]);

useEffect(() => {
  const load = async () => {
    try {
      const data = await fetchLatestProducts();
      setLatestProducts(data);
    } catch (err) {
      console.error("فشل تحميل أحدث المنتجات", err);
    }
  };
  load();
}, []);
const productsWithoutOffers = latestProducts;

  const navigation =
    useNavigation<NativeStackNavigationProp<MarketStackParamList>>();
  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
onPress={() =>
  navigation.navigate("ProductDetails", {
    product: {
      ...item,
media: item.media?.map((m: { type: "image" | "video"; uri: string }) => ({
    ...m,
    uri: m.uri // ✅ رابط كامل
  }))
    },
  })
}     >
      <View style={styles.imageContainer}>
        <Image
        source={{ uri: item.media?.[0]?.uri}}
          style={styles.image}
          resizeMode="cover"
        />
        <TouchableOpacity style={styles.favoriteButton}>
          <MaterialIcons name="favorite-border" size={24} color="#D32F2F" />
        </TouchableOpacity>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>{item.price.toLocaleString()} ر.ي</Text>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={16} color="#FFC107" />
            <Text style={styles.ratingText}>4.8</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>التفاصيل</Text>
          <MaterialIcons name="add" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("AllProducts", { showOffersOnly: false })
          }
        >
          <Text style={styles.seeAll}>عرض الكل</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🆕 الأحدث في المتجر</Text>
      </View>

      <FlatList
        data={productsWithoutOffers}
        renderItem={renderItem}
        keyExtractor={(item) => item._id }
        horizontal
        inverted={I18nManager.isRTL}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_MARGIN}
        decelerationRate="fast"
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontFamily: "Cairo-Bold",
    color: "#2D3436",
    letterSpacing: -0.5,
  },
  seeAll: {
    color: "#E53935",
    fontFamily: "Cairo-SemiBold",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    marginRight: CARD_MARGIN,
    elevation: 6,
    shadowColor: "#2D3436",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  imageContainer: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  favoriteButton: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    padding: 6,
  },
  detailsContainer: {
    padding: 16,
  },
  name: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 15,
    color: "#2D3436",
    lineHeight: 22,
    height: 44,
    textAlign: "right",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  price: {
    fontFamily: "Cairo-Bold",
    fontSize: 16,
    color: "#E53935",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontFamily: "Cairo-SemiBold",
    color: "#757575",
    fontSize: 14,
    marginRight: 4,
  },
  addToCartButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E53935",
    borderRadius: 12,
    paddingVertical: 10,
    marginTop: 14,
    gap: 8,
  },
  addToCartText: {
    color: "#FFFFFF",
    fontFamily: "Cairo-SemiBold",
    fontSize: 14,
  },
});

export default LatestProducts;

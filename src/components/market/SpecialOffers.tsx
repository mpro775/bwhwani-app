import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  I18nManager,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { fetchSpecialOffers } from "../../api/productApi"; // حسب المسار الصحيح
type Product = {
  _id: string;
  name: string;
  price: number;
  offerPrice?: number;
  hasOffer: boolean;
  images: string[]; // 
  // ✅ بدلاً من image
    media?: { type: "image"; uri: string }[];

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
const CARD_WIDTH = width * 0.75;
const CARD_MARGIN = 16;

const formatCurrency = (value: number) =>
  value.toLocaleString("ar-YE") + " ر.ي";

const calculateSavings = (price: number, offerPrice: number | null) => {
  if (offerPrice === null) return { discount: "", saved: "" };
  const discount = 100 - (offerPrice / price) * 100;
  const saved = price - offerPrice;
  return {
    discount: `${Math.round(discount)}% خصم`,
    saved: `${saved.toLocaleString()} ر.ي`,
  };
};


const SpecialOffers = () => {

  const [offers, setOffers] = useState<Product[]>([]);

useEffect(() => {
  const load = async () => {
    try {
      const data = await fetchSpecialOffers();
      setOffers(data);
    } catch (err) {
      console.error("فشل تحميل العروض", err);
    }
  };
  load();
}, []);

    const navigation =
    useNavigation<NativeStackNavigationProp<MarketStackParamList>>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.seeAllButton}
          onPress={() =>
            navigation.navigate("AllProducts", { showOffersOnly: true })
          }
        >
          <Text style={styles.seeAllText}>تصفح الكل</Text>
          <MaterialCommunityIcons name="arrow-left" size={18} color="#E53935" />
        </TouchableOpacity>
        <Text style={styles.title}> العروض الحصرية</Text>
      </View>

      <FlatList
        horizontal
        inverted={I18nManager.isRTL}
        data={offers}
        keyExtractor={(item) => item._id}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_MARGIN}
        decelerationRate="fast"
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
        const { discount, saved } = calculateSavings(item.price, item.offerPrice ?? null);

          return (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.9}
         onPress={() =>
  navigation.navigate("ProductDetails", {
    product: {
      ...item,
media: item.images?.map((img: string) => ({ type: "image", uri: img }))
    },
  })
}

            >
              <View style={styles.discountRibbon}>
                <Text style={styles.discountText}>{discount}</Text>
              </View>

              <View style={styles.imageContainer}>
                <Image 
        source={{ uri: `http://192.168.1.102:3000${item.media?.[0]?.uri}` }}
                
                style={styles.image} />
                <TouchableOpacity style={styles.favoriteButton}>
                  <MaterialCommunityIcons
                    name="heart-outline"
                    size={24}
                    color="#FFF"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.details}>
                <Text style={styles.name} numberOfLines={2}>
                  {item.name}
                </Text>

                <View style={styles.priceContainer}>
                  <View>
                    <Text style={styles.oldPrice}>
                      {formatCurrency(item.price)}
                    </Text>
                    <Text style={styles.newPrice}>
                      {item.offerPrice !== null && (
                        <Text style={styles.newPrice}>
                        {formatCurrency(item.offerPrice ?? 0)}
                        </Text>
                      )}
                    </Text>
                  </View>
                  <Text style={styles.saveText}>وفر {saved}</Text>
                </View>

                <View style={styles.ratingContainer}>
                  <MaterialCommunityIcons
                    name="star"
                    size={16}
                    color="#FFC107"
                  />
                  <Text style={styles.ratingText}>4.8 (127 تقييم)</Text>
                </View>

                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() =>
                    navigation.navigate("ProductDetails", { product: item })
                  }
                >
                  <Text style={styles.addButtonText}>التفاصيل</Text>
                  <MaterialCommunityIcons name="plus" size={20} color="#FFF" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // نفس تنسيقك السابق، لم أغير شيء فيه
  container: { marginVertical: 32, backgroundColor: "#F8F9FA" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: "Cairo-Bold",
    color: "#2D3436",
    letterSpacing: -0.5,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  seeAllText: {
    color: "#E53935",
    fontFamily: "Cairo-SemiBold",
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    marginRight: CARD_MARGIN,
    elevation: 6,
    shadowColor: "#2D3436",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    overflow: "hidden",
  },
  discountRibbon: {
    position: "absolute",
    top: 16,
    left: -24,
    backgroundColor: "#E53935",
    paddingVertical: 4,
    paddingHorizontal: 20,
    transform: [{ rotate: "-45deg" }],
    zIndex: 2,
  },
  discountText: {
    color: "#FFF",
    fontFamily: "Cairo-Bold",
    fontSize: 12,
    textAlign: "center",
  },
  imageContainer: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  favoriteButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
    padding: 8,
  },
  details: {
    padding: 6,
  },
  name: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 15,
    color: "#2D3436",
    lineHeight: 24,
    height: 40,
    textAlign: "right",
  },
  priceContainer: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  oldPrice: {
    fontSize: 14,
    color: "#757575",
    textDecorationLine: "line-through",
    fontFamily: "Cairo-Regular",
  },
  newPrice: {
    fontSize: 18,
    color: "#E53935",
    fontFamily: "Cairo-Bold",
    marginTop: 4,
  },
  saveText: {
    fontFamily: "Cairo-SemiBold",
    color: "#4CAF50",
    fontSize: 10,
    backgroundColor: "#E8F5E9",
    padding: 6,
    borderRadius: 6,
  },
  ratingContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
  },
  ratingText: {
    fontFamily: "Cairo-Regular",
    color: "#757575",
    fontSize: 12,
  },
  addButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E53935",
    borderRadius: 14,
    padding: 12,
    marginTop: 14,
    gap: 10,
    elevation: 4,
  },
  addButtonText: {
    color: "#FFF",
    fontFamily: "Cairo-SemiBold",
    fontSize: 15,
  },
});

export default SpecialOffers;

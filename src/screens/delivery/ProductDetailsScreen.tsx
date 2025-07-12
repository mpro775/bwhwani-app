import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useCart } from "../../context/CartContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import COLORS from "constants/colors";

// ثوابت الألوان حسب الهوية البرتقالية
const ORANGE = COLORS.primary ?? "#FF8500";
const ORANGE_DARK = COLORS.orangeDark ?? "#D84315";
const ACCENT = COLORS.accent ?? "#8B4B47";
const BG = COLORS.background ?? "#FFF";

type RouteParams = {
  product: {
    id: string;
    name: string;
    image: any;
    price: number;
    originalPrice?: number;
    description?: string;
  };
  storeId: string;
  storeType: "restaurant" | "grocery" | "shop";
};

const { width } = Dimensions.get("window");
const IMAGE_HEIGHT = width * 0.74;

const CommonProductDetailsScreen = () => {
  const { product, storeId, storeType } = useRoute<any>().params as RouteParams;
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const scaleAnim = new Animated.Value(1);
  const [favorite, setFavorite] = useState(false);
  const navigation = useNavigation();

  // زر الكمية أنيميشن بسيط
  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleAddToCart = async () => {
    const success = await addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image,
        originalPrice: product.originalPrice,
        storeId,
        storeType,
      },
      quantity
    );

    Alert.alert(
      success ? "✅ تمت الإضافة" : "حدث خطأ",
      success
        ? `${product.name} تمت إضافته إلى السلة`
        : "تعذر إضافة المنتج، حاول مجددًا"
    );
  };

  // المفضلة أنيميشن
  const toggleFavorite = () => {
    setFavorite(!favorite);
    Animated.spring(scaleAnim, {
      toValue: favorite ? 1 : 1.18,
      useNativeDriver: true,
    }).start();
  };

  // عرض السعر والخصم
  const renderPrice = () => {
    if (product.originalPrice && product.originalPrice > product.price) {
      const discount = Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      );
      return (
        <View style={styles.priceContainer}>
          <Text style={styles.originalPrice}>
            {product.originalPrice.toFixed(1)} ر.س
          </Text>
          <Text style={styles.discountedPrice}>
            {product.price.toFixed(1)} ر.س
          </Text>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{discount}%</Text>
          </View>
        </View>
      );
    }
    return <Text style={styles.price}>{product.price.toFixed(1)} ر.س</Text>;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* صورة المنتج مع gradient برتقالي أسفل الصورة */}
        <Animated.View
          style={[styles.imageContainer, { transform: [{ scale: scaleAnim }] }]}
        >
          <Image
            source={product.image}
            style={styles.image}
            resizeMode="cover"
          />
          <LinearGradient
            colors={[
              "transparent",
              "rgba(255,133,0,0.15)",
              "rgba(255,133,0,0.42)",
            ]}
            style={styles.imageGradient}
            start={{ x: 0.5, y: 0.4 }}
            end={{ x: 0.5, y: 1 }}
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={toggleFavorite}
          >
            <MaterialIcons
              name={favorite ? "favorite" : "favorite-border"}
              size={28}
              color={favorite ? "#FF5252" : "#fff"}
            />
          </TouchableOpacity>
        </Animated.View>

        {/* تفاصيل المنتج */}
        <View style={styles.detailsCard}>
          <View style={styles.header}>
            <Text style={styles.name}>{product.name}</Text>
            {renderPrice()}
          </View>
          {product.description && (
            <Text style={styles.description}>{product.description}</Text>
          )}

          {/* عداد الكمية */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الكمية</Text>
            <View style={styles.qtyContainer}>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => {
                  setQuantity((q) => Math.max(1, q - 1));
                  animateButton();
                }}
              >
                <Ionicons name="remove" size={22} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => {
                  setQuantity((q) => q + 1);
                  animateButton();
                }}
              >
                <Ionicons name="add" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* زر الإضافة إلى السلة (ثابت) */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>المجموع</Text>
          <Text style={styles.totalPrice}>
            {(product.price * quantity).toFixed(1)} ر.س
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleAddToCart}
          style={styles.addButton}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>إضافة إلى السلة</Text>
          <Ionicons
            name="cart"
            size={20}
            color="#fff"
            style={styles.cartIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// التنسيقات البرتقالية الاحترافية
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  scrollContainer: {
    paddingBottom: 140, // مساحة للزر
    marginBottom: 40,
  },
  imageContainer: {
    height: IMAGE_HEIGHT,
    width: "100%",
    overflow: "hidden",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    backgroundColor: "#FFF6F0",
    marginBottom: -22,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageGradient: {
    ...StyleSheet.absoluteFillObject,
    bottom: 0,
    zIndex: 1,
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 48 : 22,
    left: 16,
    backgroundColor: "rgba(255,133,0,0.54)",
    borderRadius: 22,
    padding: 8,
    zIndex: 2,
  },
  favoriteButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 48 : 22,
    right: 16,
    backgroundColor: "rgba(255,133,0,0.54)",
    borderRadius: 22,
    padding: 8,
    zIndex: 2,
  },
  detailsCard: {
    flex: 1,
    padding: 26,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -28,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    fontFamily: "Cairo-SemiBold",

    color: ACCENT,
    flex: 1,
    marginRight: 5,
  },
  priceContainer: {
    alignItems: "flex-end",
    flexDirection: "row-reverse",
    gap: 7,
  },
  price: {
    fontSize: 22,
    fontWeight: "700",
    fontFamily: "Cairo-Bold",
    color: ORANGE,
  },
  originalPrice: {
    fontSize: 16,
    color: "#bbb",
    textDecorationLine: "line-through",
    fontFamily: "Cairo-Regular",
  },
  discountedPrice: {
    fontSize: 22,
    fontWeight: "700",
    fontFamily: "Cairo-Bold",
    color: ORANGE_DARK,
    marginLeft: 5,
  },
  discountBadge: {
    backgroundColor: "#FFE1B9",
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 1,
    alignSelf: "center",
    marginLeft: 7,
  },
  discountText: {
    fontSize: 13,
    color: ORANGE_DARK,
    fontFamily: "Cairo-Bold",
  },
  description: {
    fontSize: 15.5,
    color: "#515151",
    fontFamily: "Cairo-Regular",
    lineHeight: 25,
    marginBottom: 23,
    marginTop: -4,
    textAlign: "right",
    opacity: 0.97,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15.5,
    fontWeight: "600",
    color: "#7C4D26",
    fontFamily: "Cairo-SemiBold",
    marginBottom: 12,
    marginRight: 2,
  },
  qtyContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: ORANGE,
    borderRadius: 14,
    padding: 5,
    alignSelf: "flex-start",
    shadowColor: ORANGE_DARK,
    shadowOpacity: 0.08,
    shadowRadius: 3,
    marginTop: 5,
  },
  qtyButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  qtyText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginHorizontal: 10,
    minWidth: 28,
    textAlign: "center",
    fontFamily: "Cairo-Bold",
    letterSpacing: 1,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 18,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#FFD9BD",
    shadowColor: ORANGE_DARK,
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.11,
    shadowRadius: 7,
    elevation: 7,
    zIndex: 30,
  },
  totalContainer: {
    flex: 1,
  },
  totalText: {
    fontSize: 15,
    color: ACCENT,
    fontFamily: "Cairo-Regular",
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: ORANGE,
    fontFamily: "Cairo-Bold",
  },
  addButton: {
    backgroundColor: ORANGE,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 13,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    minWidth: 170,
    shadowColor: ORANGE_DARK,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 17,
    fontFamily: "Cairo-Bold",
    fontWeight: "bold",
    marginLeft: 4,
  },
  cartIcon: {
    marginRight: 6,
  },
});

export default CommonProductDetailsScreen;

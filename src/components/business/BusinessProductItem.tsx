import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Product as P } from "./BusinessProductList";
import COLORS from "constants/colors";

type RootStackParamList = {
  UniversalProductDetails: {
    product: {
      id: string;
      name: string;
      image: any;
      price: number;
      originalPrice?: number;
      discountPercent?: number;
    };
    
    storeId: string;
    storeType: "restaurant" | "grocery" | "shop";
  };
};

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "UniversalProductDetails"
>;

interface Props {
  product: P;
  storeId: string;
  storeType: "restaurant" | "grocery" | "shop";
  onAdd: (item: P, quantity: number) => void;
}

const BusinessProductItem: React.FC<Props> = ({
  product,
  storeId,
  storeType,
  onAdd,
}) => {
  const navigation = useNavigation<NavigationProp>();

  const handleAddPress = () => {
    onAdd(product, 1);
  };

  const handleCardPress = () => {
    navigation.navigate("UniversalProductDetails", {
      product,
      storeId,
      storeType,
    });
  };

  // حساب نسبة الخصم إن وجدت
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : undefined;

  return (
    <TouchableOpacity
      onPress={handleCardPress}
      activeOpacity={0.84}
      style={styles.touchArea}
    >
      <View style={styles.card}>
        <View style={styles.imageBox}>
          <Image source={product.image} style={styles.image} />
          {discountPercent && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{discountPercent}%</Text>
            </View>
          )}
        </View>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{product.price} ﷼</Text>
            {product.originalPrice && product.originalPrice > product.price && (
              <Text style={styles.originalPrice}>
                {product.originalPrice} ﷼
              </Text>
            )}
          </View>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default BusinessProductItem;

const styles = StyleSheet.create({
  touchArea: { marginBottom: 16 },
  card: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#FFF",
    fontFamily: "Cairo-SemiBold",

    borderRadius: 17,
    padding: 11,
    elevation: 3,
    shadowColor: "#B14D35",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    marginBottom: 0,
    minHeight: 96,
    position: "relative",
  },
  imageBox: {
    position: "relative",
    marginLeft: 15,
    marginRight: 2,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: "#F9E8E1",
  },
  discountBadge: {
    position: "absolute",
    top: 5,
    left: 5,
    backgroundColor: "#FFD7DC",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 1,
    zIndex: 2,
    borderWidth: 1,
    borderColor: "#FFF2F2",
  },
  discountText: {
    fontSize: 12,
    color: "#C62828",
    fontWeight: "bold",
  },
  info: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 5,
    marginRight: 8,
  },
  name: {
    fontSize: 15,
    fontFamily: "Cairo-SemiBold",

    fontWeight: "700",
    textAlign: "right",
    marginBottom: 4,
    color: "#4E342E",
  },
  priceRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
  },
  price: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.primary,
    fontFamily: "Cairo-SemiBold",

    textAlign: "right",
    marginLeft: 6,
  },
  originalPrice: {
    fontSize: 13,
    color: "#C1C1C1",
    fontFamily: "Cairo-SemiBold",

    textDecorationLine: "line-through",
    marginRight: 7,
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: COLORS.primary,
    padding: 13,
    borderRadius: 24,
    marginLeft: 4,
    shadowColor: COLORS.accent,
    shadowOpacity: 0.15,
    shadowRadius: 7,
    elevation: 4,
  },
});

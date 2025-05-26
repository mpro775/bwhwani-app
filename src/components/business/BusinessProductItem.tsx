import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Product as P } from "./BusinessProductList";
import { useCart } from "../../context/CartContext";

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
    // نضيف دائماً كمية 1 عند الضغط على زر +
    onAdd(product, 1);
  };

  const handleCardPress = () => {
    // احسب نسبة الخصم لو موجودة
    const discountPercent = product.originalPrice
      ? ((product.originalPrice - product.price) / product.originalPrice) * 100
      : undefined;

       navigation.navigate("UniversalProductDetails", {
      product,
      storeId,    // هذا يأتي من props
      storeType,  // هذا أيضًا من props
    })
  };

  return (
    <TouchableOpacity onPress={handleCardPress} activeOpacity={0.8}>
      <View style={styles.card}>
        <Image source={product.image} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {product.name}
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{product.price} ﷼</Text>
            {product.originalPrice && (
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
  card: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    elevation: 3,
    marginBottom: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  info: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "right",
  },
  originalPrice: {
    fontSize: 12,
    color: "#999",
    textDecorationLine: "line-through",
    textAlign: "right",
  },
  addButton: {
    backgroundColor: "#8B4B47",
    padding: 12,
    borderRadius: 25,
  },
});

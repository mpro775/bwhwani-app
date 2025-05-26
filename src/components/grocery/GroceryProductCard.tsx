import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface Props {
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: any;
  };
  onAdd?: () => void;
  onFavoriteToggle?: () => void;
}
export type RootStackParamList = {
  UniversalProductDetails: {
    product: {
      id: string;
      name: string;
      image: any;
      price: number;
      originalPrice?: number;
      discountPercent?: number;
    };
  };
  // أضف شاشاتك الأخرى هنا...
};
type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "UniversalProductDetails"
>;

const GroceryProductCard: React.FC<Props> = ({
  product,
  onAdd,
  onFavoriteToggle,
}) => {
  const navigation = useNavigation<NavigationProp>();

  const handleAdd = () => {
    if (onAdd) onAdd();
    else navigation.navigate("UniversalProductDetails", { product });
  };

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("UniversalProductDetails", { product })
      }
    >
      <View style={styles.card}>
        <Image source={product.image} style={styles.image} />
        <View style={styles.info}>
          <View style={styles.rowBetween}>
            <Text numberOfLines={1} style={styles.name}>
              {product.name}
            </Text>
            <TouchableOpacity onPress={onFavoriteToggle}>
              <Ionicons name="heart-outline" size={20} color="#8B4B47" />
            </TouchableOpacity>
          </View>

          <View style={styles.rowBetween}>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{product.price.toFixed(1)} ريال</Text>
              {product.originalPrice && (
                <Text style={styles.originalPrice}>
                  {product.originalPrice.toFixed(1)} ريال
                </Text>
              )}
            </View>

            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
              <Ionicons name="add" size={20} color="#8B4B47" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default GroceryProductCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row-reverse",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginVertical:20,
    elevation: 2,
    alignItems: "center",
    gap: 10,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  info: {
    flex: 1,
    fontFamily: "Cairo-SemiBold",
  },
  rowBetween: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 13,
    fontWeight: "bold",
    fontFamily: "Cairo-SemiBold",

    color: "#333",
    flexShrink: 1,
  },
  priceContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
  },
  price: {
    fontSize: 13,
    color: "#8B4B47",
    fontFamily: "Cairo-SemiBold",

    fontWeight: "bold",
  },
  originalPrice: {
    fontSize: 12,
    color: "#999",
    textDecorationLine: "line-through",
  },
  addButton: {
    backgroundColor: "#fce8e6",
    padding: 6,
    borderRadius: 10,
  },
});

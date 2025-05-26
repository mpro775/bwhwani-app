// src/screens/delivery/CommonProductDetailsScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useCart } from "../../context/CartContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

type RouteParams = {
  product: {
    id: string;
    name: string;
    image: any;
    price: number;
    originalPrice?: number;
  };
  storeId: string;
  storeType: "restaurant" | "grocery" | "shop";
};

const CommonProductDetailsScreen = () => {
  const { product, storeId, storeType } = useRoute<any>().params as RouteParams;
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const scaleAnim = new Animated.Value(1);

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleAddToCart = async () => {
    // فعلاً ننادي addToCart من الـ Context
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
    Alert.alert(success ? "✅ تمت الإضافة" : "⚠️ فشل الإضافة");
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.imageContainer, { transform: [{ scale: scaleAnim }] }]}>
        <Image source={product.image} style={styles.image} />
        <LinearGradient
          colors={["rgba(0,0,0,0.3)", "transparent"]}
          style={styles.imageGradient}
        />
      </Animated.View>

      {/* تفاصيل المنتج */}
      <View style={styles.detailsCard}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>
          {(product.price * quantity).toFixed(1)} ر.س
        </Text>

        {/* عداد الكمية */}
        <View style={styles.qtyContainer}>
          <TouchableOpacity onPress={() => { setQuantity(q => Math.max(1, q - 1)); animateButton(); }}>
            <Ionicons name="remove" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantity}</Text>
          <TouchableOpacity onPress={() => { setQuantity(q => q + 1); animateButton(); }}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

      <TouchableOpacity onPress={handleAddToCart} style={styles.addButton}>

  <Text style={styles.addButtonText}>إضافة إلى السلة</Text>
</TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  imageContainer: { height: 300, overflow: "hidden" },
  image: { width: "100%", height: "100%" },
  imageGradient: { ...StyleSheet.absoluteFillObject },
  detailsCard: { flex: 1, padding: 16 },
  name: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  price: { fontSize: 20, color: "#D84315", marginBottom: 16 },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D84315",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  qtyText: { color: "#fff", fontSize: 18, marginHorizontal: 16 },
  addButton: {
    backgroundColor: "#D84315",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default CommonProductDetailsScreen;

// components/ProductPriceSection.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../../constants/colors";
import { Product } from "../../../types/product"; // Import the Product type

interface ProductPriceSectionProps {
  product: Product;
  showDollar: boolean;
  onToggleDollar: () => void;
  negotiationPrice: string;
  onNegotiationPriceChange: (text: string) => void;
  onNegotiate: () => void;
    currentUID: string | null; // ✅ أضف هذا

}

const ProductPriceSection: React.FC<ProductPriceSectionProps> = ({ product, showDollar, onToggleDollar, negotiationPrice, onNegotiationPriceChange, onNegotiate ,currentUID}) => {
  return (
    <View style={styles.priceSection}>
      <View style={styles.priceWrapper}>
        {product.hasOffer && (
          <View style={styles.offerTime}>
            <Ionicons name="time" size={16} color="#FFF" />
            <Text style={styles.offerTimeText}>متبقي 2 أيام</Text>
          </View>
        )}

        <View style={styles.priceContainer}>
          {product.hasOffer && (
            <Text style={styles.originalPrice}>
              {product.price.toLocaleString()} ر.ي
            </Text>
          )}
          <TouchableOpacity onPress={onToggleDollar}>
            <Text style={styles.currentPrice}>
              {showDollar
                ? ((product.offerPrice || product.price) / 530).toFixed(2) + " $"
                : (product.offerPrice || product.price).toLocaleString() + " ر.ي"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 16, width: "100%" }}>
          <Text style={{ fontFamily: "Cairo-Bold", fontSize: 16, textAlign: "right", marginBottom: 8 }}>
             تفاوض على السعر
          </Text>
          <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 8 }}>
            <TextInput
              placeholder="سعرك المقترح"
              keyboardType="numeric"
              value={negotiationPrice}
              onChangeText={onNegotiationPriceChange}
              style={{
                flex: 1,
                backgroundColor: "#F3F3F3",
                borderRadius: 10,
                padding: 12,
                textAlign: "right",
                fontFamily: "Cairo-Regular",
              }}
            />
            <TouchableOpacity
  onPress={() => {
    if (!currentUID) {
      Alert.alert("تنبيه", "يجب تسجيل الدخول أولاً لإرسال سعر تفاوضي.");
      return;
    }
    onNegotiate();
  }}
  style={{
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  }}
>
  <Text style={{ color: "#fff", fontFamily: "Cairo-Bold" }}>إرسال</Text>
</TouchableOpacity>

          </View>
        </View>
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Ionicons name="eye" size={18} color="#4B86B4" />
            <Text style={styles.metaText}>{product.viewsCount}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="chatbubbles" size={18} color="#4B86B4" />
            <Text style={styles.metaText}>{product.comments.length}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  priceSection: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  priceWrapper: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 16,
  },
  offerTime: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#FF6B6B",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
    alignSelf: "flex-start",
  },
  offerTimeText: {
    color: "#FFF",
    fontFamily: "Cairo-SemiBold",
    fontSize: 12,
  },
  priceContainer: {
    alignItems: "flex-end",
    alignSelf: "flex-end",
  },
  originalPrice: {
    fontFamily: "Cairo-Regular",
    fontSize: 16,
    color: "#999",
    textDecorationLine: "line-through",
  },
  currentPrice: {
    fontFamily: "Cairo-Bold",
    fontSize: 24,
    color: COLORS.primary,
  },
  metaContainer: {
    flexDirection: "row-reverse",
    gap: 16,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  metaItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontFamily: "Cairo-SemiBold",
    color: "#2A4D69",
    fontSize: 14,
  },
});

export default ProductPriceSection;
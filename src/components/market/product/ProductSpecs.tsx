// components/ProductSpecs.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../../constants/colors";
import { Product } from "../../../types/product";

interface ProductSpecsProps {
  product: Product;
}

const ProductSpecs: React.FC<ProductSpecsProps> = ({ product }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>المواصفات الفنية</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalSpecs}
      >
        {/* حالة المنتج */}
        <View style={styles.specCard}>
          <Ionicons name="cube" size={16} color={COLORS.primary} />
          <View style={styles.specContent}>
            <Text style={styles.specLabel}>الحالة</Text>
            <Text style={styles.specValue}>
              {product.condition === "new" ? "جديد" : "مستعمل"}
            </Text>
          </View>
        </View>

        {/* الضمان */}
        <View style={styles.specCard}>
          <Ionicons name="shield-checkmark" size={16} color="#4CAF50" />
          <View style={styles.specContent}>
            <Text style={styles.specLabel}>الضمان</Text>
            <Text style={styles.specValue}>
              {product.warranty ? "مُتاح" : "غير متاح"}
            </Text>
          </View>
        </View>

        {/* الماركة */}
        <View style={styles.specCard}>
          <Ionicons name="pricetag" size={16} color={COLORS.primary} />
          <View style={styles.specContent}>
            <Text style={styles.specLabel}>العلامة التجارية</Text>
            <Text style={styles.specValue}>
              {product.specs.brand || "غير محدد"}
            </Text>
          </View>
        </View>

        {/* الوقت المتبقي للعرض (إذا كان هناك عرض) */}
        {product.hasOffer && (
          <View style={[styles.specCard, styles.offerCard]}>
            <Ionicons name="alarm" size={16} color="#FFF" />
            <View style={styles.specContent}>
              <Text style={[styles.specLabel, styles.offerText]}>
                الوقت المتبقي
              </Text>
              <Text style={[styles.specValue, styles.offerText]}>
                {product.remainingTime || "غير محدد"}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
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
  sectionTitle: {
    fontFamily: "Cairo-Bold",
    fontSize: 18,
    color: COLORS.text,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
    paddingBottom: 10,
    marginBottom: 12,
    textAlign: "right",
  },
  horizontalSpecs: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 8,
  },
  specCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    padding: 12,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    minWidth: 120,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  specContent: {
    flex: 1,
  },
  specLabel: {
    fontFamily: "Cairo-SemiBold",
    color: "#666",
    fontSize: 12,
    marginBottom: 2,
  },
  specValue: {
    fontFamily: "Cairo-Bold",
    color: COLORS.text,
    fontSize: 13,
  },
  offerCard: {
    backgroundColor: COLORS.primary,
  },
  offerText: {
    color: "#FFF",
  },
});

export default ProductSpecs;
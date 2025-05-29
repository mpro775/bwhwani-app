import React from "react";
import { View, Text, StyleSheet } from "react-native";
import COLORS from "../../../constants/colors";

interface ProductHeaderProps {
  productCount: number;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ productCount }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>إدارة المنتجات</Text>
      <Text style={styles.productCount}>({productCount}) منتج</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontFamily: "Cairo-Bold",
    fontSize: 22,
    color: COLORS.text,
  },
  productCount: {
    fontFamily: "Cairo-SemiBold",
    color: "#666",
    fontSize: 16,
  },
});

export default ProductHeader;
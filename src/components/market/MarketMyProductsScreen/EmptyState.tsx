import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const EmptyState: React.FC = () => {
  return (
    <View style={styles.emptyState}>
      <Ionicons name="cube-outline" size={80} color="#ddd" />
      <Text style={styles.emptyText}>لا توجد منتجات مضافة</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontFamily: "Cairo-SemiBold",
    color: "#999",
    fontSize: 16,
    marginTop: 16,
  },
});

export default EmptyState;
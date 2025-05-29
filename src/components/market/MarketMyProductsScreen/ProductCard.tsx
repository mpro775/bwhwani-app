import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../../constants/colors";
import { outProduct } from "../../../types/product";

interface ProductCardProps {
  item: outProduct;
  onEdit: (product: outProduct) => void;
  onDelete: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ item, onEdit, onDelete }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        {item.hasOffer && (
          <View style={styles.offerTag}>
            <Text style={styles.offerTagText}>عرض خاص</Text>
          </View>
        )}
        <Image
          source={{ uri: item.media[0]?.uri }}
          style={styles.cardImage}
        />
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>

        <View style={styles.priceContainer}>
          {item.hasOffer ? (
            <>
              <Text style={styles.originalPrice}>{item.price} ر.ي</Text>
              <Text style={styles.finalPrice}>{item.offerPrice} ر.ي</Text>
            </>
          ) : (
            <Text style={styles.finalPrice}>{item.price} ر.ي</Text>
          )}
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onEdit(item)}
          >
            <Ionicons name="create-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onDelete(item._id!)} // Assuming _id exists for items in the list
          >
            <Ionicons name="trash-outline" size={20} color="#D32F2F" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardHeader: {
    position: "relative",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 180,
  },
  offerTag: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: COLORS.accent,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    zIndex: 1,
  },
  offerTagText: {
    color: "white",
    fontFamily: "Cairo-SemiBold",
    fontSize: 12,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontFamily: "Cairo-Bold",
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
  },
  originalPrice: {
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    color: "#999",
    textDecorationLine: "line-through",
  },
  finalPrice: {
    fontFamily: "Cairo-Bold",
    fontSize: 18,
    color: COLORS.primary,
  },
  cardActions: {
    flexDirection: "row-reverse",
    justifyContent: "flex-start",
    gap: 16,
    marginTop: 12,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
  },
});

export default ProductCard;
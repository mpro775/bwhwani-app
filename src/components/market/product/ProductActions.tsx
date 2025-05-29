// components/ProductActions.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking, Share } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../../constants/colors";
import { Product } from "../../../types/product"; // Import the Product type

interface ProductActionsProps {
  product: Product;
  handleWhatsApp: () => void;
  handleShare: () => Promise<void>; // Share is async
  handleCopyLink: () => void;
  handleCall: () => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({ product, handleWhatsApp, handleShare, handleCopyLink, handleCall }) => {
  return (
    <>
      {/* Social Shares & Rating */}
      <View style={styles.ratingContainer}>
        <View style={styles.ratingStars}>
          {[...Array(5)].map((_, i) => (
            <Ionicons
              key={i}
              name={i < Math.floor(product.rating) ? "star" : "star-half"}
              size={20}
              color="#FFA000"
            />
          ))}
        </View>
        <Text style={styles.ratingText}>{product.rating}/5</Text>
      </View>

      <View style={styles.socialShares}>
        <View style={styles.shareItem}>
          <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
          <Text style={styles.shareCount}>
            {product.socialShares.whatsapp}
          </Text>
        </View>
        <View style={styles.shareItem}>
          <Ionicons name="logo-facebook" size={20} color="#1877F2" />
          <Text style={styles.shareCount}>
            {product.socialShares.facebook}
          </Text>
        </View>
      </View>

      {/* Floating Actions */}
      {/* These buttons are floated so they are outside the scroll view.
          If they are intended to be fixed at the bottom, they should be
          outside the ScrollView in the parent component.
          For now, I'm keeping them here as per original structure,
          but note the potential for overlapping with scroll view content.
          The parent `ProductDetailsScreen` will handle the actual floating.
          This component primarily groups related actions.
      */}
      <View style={styles.inlineActionButtons}> {/* Renamed style to avoid conflict with parent's floatingActions */}
        <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
          <Ionicons name="call" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.whatsappButton]}
          onPress={handleWhatsApp}
        >
          <Ionicons name="logo-whatsapp" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.shareButton]}
          onPress={handleShare}
        >
          <Ionicons name="share-social" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={handleCopyLink}
        style={{ alignSelf: "center", marginTop: 10, marginBottom: 20 }}
      >
        <Text
          style={{ color: COLORS.accent, fontFamily: "Cairo-SemiBold" }}
        >
          نسخ رابط المنتج
        </Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  inlineActionButtons: { // Changed name
    flexDirection: "row", // Arrange horizontally
    justifyContent: "center", // Center buttons
    gap: 12,
    marginVertical: 20, // Add some vertical margin
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  whatsappButton: {
    backgroundColor: "#25D366",
  },
  shareButton: {
    backgroundColor: "#3E2723",
  },
  ratingContainer: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  ratingStars: {
    flexDirection: "row-reverse",
    gap: 4,
  },
  ratingText: {
    fontFamily: "Cairo-SemiBold",
    color: "#FFA000",
    fontSize: 14,
  },
  socialShares: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row-reverse",
    justifyContent: "space-around",
    marginVertical: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  shareItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
  },
  shareCount: {
    fontFamily: "Cairo-SemiBold",
    color: "#2A4D69",
    fontSize: 14,
  },
});

export default ProductActions;
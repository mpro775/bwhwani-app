// components/ProductCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  product: any;
  isFavorited: boolean;
  onToggleFavorite: (productId: string) => void;
  onPress: () => void;
};

const COLORS = {
  primary: "#D84315",
  text: "#4E342E",
};

const ProductCard: React.FC<Props> = ({ product, isFavorited, onToggleFavorite, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        {product.hasOffer && product.offerPrice !== null && (
          <View style={styles.offerBadge}>
            <Text style={styles.offerBadgeText}>
              خصم {Math.round(100 - (product.offerPrice / product.price) * 100)}٪
            </Text>
          </View>
        )}
        <Image
          source={{
            uri: product.media?.[0]?.uri.startsWith("http")
              ? product.media[0].uri
              : `http://192.168.1.102:3000${product.media?.[0]?.uri}`,
          }}
          style={styles.image}
        />
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => onToggleFavorite(product._id)}
        >
          <MaterialIcons
            name={isFavorited ? "favorite" : "favorite-border"}
            size={24}
            color="#FFF"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{product.price.toLocaleString()} ر.ي</Text>
          {product.hasOffer && (
            <Text style={styles.originalPrice}>
              {product.offerPrice?.toLocaleString()} ر.ي
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 16,
    flex: 1,
    elevation: 3,
    overflow: "hidden",
  },
  imageContainer: { height: 150, position: "relative" },
  image: { width: "100%", height: "100%", resizeMode: "cover" },
  offerBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: COLORS.primary,
    padding: 4,
    borderRadius: 8,
  },
  offerBadgeText: { color: "#FFF", fontSize: 12, fontFamily: "Cairo-Bold" },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 6,
    borderRadius: 20,
  },
  details: { padding: 12 },
  name: {
    fontFamily: "Cairo-Bold",
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
  },
  priceRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  price: { fontFamily: "Cairo-Bold", fontSize: 14, color: COLORS.primary },
  originalPrice: {
    fontFamily: "Cairo-Regular",
    fontSize: 12,
    color: "#888",
    textDecorationLine: "line-through",
  },
});

export default ProductCard;

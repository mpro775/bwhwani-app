import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const CARD_WIDTH = Dimensions.get('window').width * 0.65;
const COLORS = {
  primary: "#D84315",
  text: "#2D3436",
};

type Props = {
  product: any;
  isFavorited?: boolean;
  onToggleFavorite?: (productId: string) => void;
  onPress: () => void;
};

const HorizontalProductCard: React.FC<Props> = ({
  product,
  isFavorited = false,
  onToggleFavorite,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.media?.[0]?.uri }}
          style={styles.image}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => onToggleFavorite?.(product._id)}
        >
          <MaterialIcons
            name={isFavorited ? "favorite" : "favorite-border"}
            size={24}
            color={isFavorited ? "#D84315" : "#888"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>{product.price.toLocaleString()} ر.ي</Text>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={16} color="#FFC107" />
            <Text style={styles.ratingText}>4.8</Text>
          </View>
        </View>

    
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#FFF",
    borderRadius: 24,
    marginRight: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  imageContainer: {
    height: 180,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 6,
    elevation: 2,
  },
  detailsContainer: {
    padding: 16,
  },
  name: {
    fontFamily: "Cairo-Bold",
    fontSize: 16,
    color: COLORS.text,
    height: 44,
    textAlign: "right",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  price: {
    fontFamily: "Cairo-Bold",
    fontSize: 16,
    color: COLORS.primary,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontFamily: "Cairo-Regular",
    color: "#757575",
    fontSize: 14,
    marginRight: 4,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 10,
    marginTop: 14,
    gap: 8,
  },
  buttonText: {
    fontFamily: "Cairo-SemiBold",
    color: "#FFF",
    fontSize: 14,
  },
});

export default HorizontalProductCard;

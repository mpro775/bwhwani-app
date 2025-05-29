// components/ProductImageSlider.tsx
import React from "react";
import { View, Image, StyleSheet, Dimensions, Text } from "react-native";
import Swiper from "react-native-swiper";
import { Video, ResizeMode } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../../constants/colors";
import { ProductMedia } from "../../../types/product"; // Import the type

const { width } = Dimensions.get("window");

interface ProductImageSliderProps {
  media: ProductMedia[];
  hasOffer: boolean;
}

const ProductImageSlider: React.FC<ProductImageSliderProps> = ({ media, hasOffer }) => {
  const fixedMedia = media.map((item) => ({
    ...item,
    uri: item.uri.startsWith("http")
      ? item.uri
      : `http://192.168.1.102:3000${item.uri}`, // Adjust this as needed
  }));

  return (
    <View style={styles.swiperContainer}>
      <Swiper
        loop
        showsPagination
        paginationStyle={styles.pagination}
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
      >
        {fixedMedia.map((item, index) =>
          item.type === "image" ? (
            <Image
              key={index}
              source={{ uri: item.uri }}
              style={styles.swiperImage}
              resizeMode="cover"
            />
          ) : (
            <Video
              key={index}
              source={{ uri: item.uri }}
              style={styles.swiperImage}
              useNativeControls
              resizeMode={ResizeMode.COVER}
              shouldPlay={false}
              isLooping
            />
          )
        )}
      </Swiper>
      {hasOffer && (
        <View style={styles.offerTag}>
          <Ionicons name="pricetag" size={20} color="white" />
          <Text style={styles.offerText}>خصم مميز</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  swiperContainer: {
    height: width * 0.9,
    backgroundColor: "#FFF",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  swiperImage: {
    width: "100%",
    height: "100%",
  },
  pagination: {
    bottom: 20,
  },
  dot: {
    backgroundColor: "rgba(255,255,255,0.5)",
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 20,
    height: 8,
    borderRadius: 4,
  },
  offerTag: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "#E53935",
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 8,
    zIndex: 1,
  },
  offerText: {
    color: "#FFF",
    fontFamily: "Cairo-SemiBold",
    fontSize: 14,
  },
});

export default ProductImageSlider;
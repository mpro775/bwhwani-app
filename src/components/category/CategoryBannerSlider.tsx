import React from "react";
import { ScrollView, Image, StyleSheet, View } from "react-native";

interface Props {
  banners?: any[]; // صور محلية بصيغة require أو URI
}

const defaultBanners = [
  require("../../../assets/banners/banner1.jpg"),
  require("../../../assets/banners/banner2.jpg"),
  require("../../../assets/banners/banner3.jpg"),
];

const CategoryBannerSlider: React.FC<Props> = ({
  banners = defaultBanners,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.slider}
      contentContainerStyle={{ gap: 10 }}
    >
      {banners.map((banner, index) => (
        <Image
          key={index}
          source={banner}
          style={styles.banner}
          resizeMode="cover"
        />
      ))}
    </ScrollView>
  );
};

export default CategoryBannerSlider;

const styles = StyleSheet.create({
  slider: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  banner: {
    width: 320,
    height: 150,
    borderRadius: 20,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // ظل للأندرويد
  },
});

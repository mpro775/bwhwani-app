import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { API_BASE_URL } from "config/config";

const SLIDER_WIDTH = Dimensions.get("window").width;
const ITEM_WIDTH = SLIDER_WIDTH * 0.88;
const ITEM_SPACING = SLIDER_WIDTH * 0.06;

type Slide = {
  _id: string;
  title: string;
  image: string;
};

const MarketSlider = () => {
  const flatListRef = useRef<FlatList>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://192.168.1.105:3000/market/sliders").then((res) => {
      setSlides(res.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % slides.length;
      const offset = nextIndex * (ITEM_WIDTH + ITEM_SPACING);
      flatListRef.current?.scrollToOffset({ offset, animated: true });
      setCurrentIndex(nextIndex);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, slides.length]);

  if (loading) {
    return <ActivityIndicator size="large" color="#D84315" style={{ marginVertical: 30 }} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        decelerationRate="fast"
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH + ITEM_SPACING,
          offset: (ITEM_WIDTH + ITEM_SPACING) * index,
          index,
        })}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
    source={{ uri:item.image}}
              style={styles.image} />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.6)"]}
              style={styles.gradient}
            />
            <Text style={styles.text}>{item.title}</Text>
          </View>
        )}
      />

      <View style={styles.pagination}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === currentIndex && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  card: {
    width: ITEM_WIDTH,
    marginHorizontal: ITEM_SPACING / 2,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 6,
  },
  image: {
    width: "100%",
    height: 200,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    justifyContent: "flex-end",
  },
  text: {
    position: "absolute",
    bottom: 16,
    right: 16,
    left: 16,
    color: "#fff",
    fontSize: 20,
    fontFamily: "Cairo-Bold",
    textAlign: "right",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#8B4B47",
    width: 20,
  },
});

export default MarketSlider;

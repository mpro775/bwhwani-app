import React, { useEffect, useRef, useState } from "react";
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ActivityIndicator,
  Linking,
} from "react-native";
import { Animated } from "react-native";
import { API_URL } from "utils/api/config";

// ✅ عدّل هذا حسب رابط السيرفر الخاص بك

const COLORS = {
  primary: "#D84315",
  secondary: "#5D4037",
  background: "#FFFFFF",
  text: "#4E342E",
  accent: "#8B4B47",
};

interface Banner {
  _id: string;
  image: string; // رابط الصورة
  link?: string;
}

const DeliveryBannerSlider: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  // ✅ تحميل البيانات من الباك إند
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${API_URL}/delivery/banners`);
        const data = await res.json();

        setBanners(data);
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // ✅ التشغيل التلقائي
  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
      const newIndex = (activeIndex + 1) % banners.length;
      scrollViewRef.current?.scrollTo({ x: newIndex * 320, animated: true });
      setActiveIndex(newIndex);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeIndex, banners]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / 320);
    setActiveIndex(index);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.sliderContainer}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ref={scrollViewRef}
      >
        {banners.map((banner, index) => (
          <TouchableOpacity
            key={banner._id}
            activeOpacity={0.9}
            onPress={() => {
              // يمكن فتح الرابط إذا وُجد:
              Linking.openURL(banner.link || "");
            }}
          >
            <Image source={{ uri: banner.image }} style={styles.image} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {banners.map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  activeIndex === index ? COLORS.primary : "#E0E0E0",
                width: activeIndex === index ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    marginBottom: 25,
  },
  image: {
    width: 320,
    height: 180,
    borderRadius: 20,
    marginRight: 15,
    resizeMode: "cover",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  loader: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DeliveryBannerSlider;

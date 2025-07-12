// src/components/DeliveryBannerSlider.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  Linking,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { API_URL } from "utils/api/config";

const COLORS = {
  primary: "#D84315",
  background: "#FFFFFF",
};

interface Banner {
  _id: string;
  image: string;
  link?: string;
}

const DeliveryBannerSlider: React.FC = () => {
  const { width } = useWindowDimensions();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<ScrollView>(null);

 useEffect(() => {
 fetch(`${API_URL}/delivery/promotions`)
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then(data => setBanners(data))
  .catch(err => console.error("Fetch error:", err))
  .finally(() => setLoading(false));

}, []);

  // تشغيل تلقائي
  useEffect(() => {
    if (!banners.length) return;
    const iv = setInterval(() => {
      const next = (activeIndex + 1) % banners.length;
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
      setActiveIndex(next);
    }, 3000);
    return () => clearInterval(iv);
  }, [activeIndex, banners, width]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(idx);
  };

  if (loading) {
    return (
      <View style={[styles.loader, { width }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        ref={scrollRef}
  snapToInterval={width * 0.9 + 16} 
    decelerationRate="fast"

      >
        {banners.map((b) => (
          <TouchableOpacity
            key={b._id}
            activeOpacity={0.9}
            onPress={() => b.link && Linking.openURL(b.link)}
 style={{
          width: width * 0.9,
          borderRadius: 12,
          marginRight: 16,
          backgroundColor: COLORS.background,
          overflow: "hidden",
          // ظل
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 8,
          elevation: 4,
        }}
          >
            <Image
              source={{ uri: b.image }}
style={{
            width: width * 0.9,
            height: width * 0.9 * 0.5,
            resizeMode: "cover",
          }}            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {banners.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === activeIndex ? styles.dotActive : null]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
 
  // البطاقة نفسها: ظل وخلفية بيضاء وزوايا دائرية
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginRight: 16,
    // ظل على iOS
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    // ظل على Android
    elevation: 4,
    overflow: "hidden",  // حتى يتبع الـ borderRadius
  },
  // الصورة: تغطي البطاقة كاملة مع الحفاظ على نسبة العرض إلى الارتفاع

  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 4,
  },
  dotActive: {
    width: 12,
    height: 12,                      // نقط أكبر قليلاً للحالة النشطة
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  loader: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
});


export default DeliveryBannerSlider;

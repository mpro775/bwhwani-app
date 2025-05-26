import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { API_BASE_URL } from "config/config";

const API_URL = `${API_BASE_URL}/delivery/stores`;

const COLORS = {
  primary: "#D84315",
  secondary: "#5D4037",
  background: "#FFFFFF",
  text: "#4E342E",
  accent: "#8B4B47",
};

interface Store {
  _id: string;
  name: string;
  image: string;
}

interface Props {
  onSelect?: (storeId: string) => void;
  sectionTitle?: string;
}

const DeliveryTrending: React.FC<Props> = ({
  onSelect,
  sectionTitle = "الرائج اليوم",
}) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();

        setStores(data); // ← تأكد أن الاستجابة عبارة عن array مباشرة
      } catch (error) {
        console.error("فشل في تحميل المتاجر:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{sectionTitle}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {stores.map((store) => (
          <TouchableOpacity
            key={store._id}
            style={styles.card}
            onPress={() => onSelect?.(store._id)}
            activeOpacity={0.9}
          >
            <Image source={{ uri: store.image }} style={styles.image} />
            <View style={styles.overlay}>
              <Text style={styles.text}>{store.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default DeliveryTrending;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  loader: {
  height: 200,
  justifyContent: "center",
  alignItems: "center",
},
  title: {
    fontSize: 20,
    color: COLORS.primary,
    fontFamily: "Cairo-Bold",
    textAlign: "right",
    marginBottom: 15,
  },
  scrollViewContent: {
    paddingRight: 15, // مساحة إضافية في نهاية التمرير
  },
  card: {
    width: 180, // عرض أكبر للبطاقة
    marginRight: 15,
    borderRadius: 15, // حواف دائرية
    overflow: "hidden", // لضمان أن الصورة لا تتخطى الحواف الدائرية
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // ظل للأندرويد
  },
  image: {
    width: "100%",
    height: 150, // ارتفاع أكبر للصورة
    resizeMode: "cover", // لتغطية المساحة بالكامل
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // تعتيم خفيف
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 16,
    color: COLORS.background,
    fontFamily: "Cairo-Regular",
    textAlign: "right",
  },
});

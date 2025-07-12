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
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "utils/api/config";
import { RootStackParamList } from "types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const COLORS = {
  primary: "#D84315",
  secondary: "#5D4037",
  background: "#FFF",
  text: "#4E342E",
  accent: "#FFA726",
  cardShadow: "#00000033",
};

interface Store {
  _id: string;
  name: string;
  image: string;
  isTrending?: boolean; // ← مهم للحقل الجديد
}
type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "BusinessDetails"
>;
interface Props {
  onSelect?: (store: Store) => void;
  sectionTitle?: string;
}

const DeliveryTrending: React.FC<Props> = ({
  onSelect,
  sectionTitle = "الرائج اليوم",
}) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await fetch(`${API_URL}/delivery/stores`);
        const data = await res.json();

        // فلترة المتاجر الرائجة فقط
        const trendingStores = Array.isArray(data)
          ? data.filter((store) => store.isTrending === true)
          : [];

        setStores(trendingStores);
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

  // إذا لم يوجد أي متجر رائج
  if (stores.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{sectionTitle}</Text>
        <Text style={{ color: COLORS.secondary, textAlign: "center" }}>
          لا يوجد متاجر رائجة حالياً.
        </Text>
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
          onPress={() => {
  if (onSelect) {
    onSelect(store);
  } else {
    navigation.navigate("BusinessDetails", { business: store });
  }


            }}
            activeOpacity={0.88}
          >
            <Image source={{ uri: store.image }} style={styles.image} />
            <View style={styles.overlay}>
              <Text style={styles.text} numberOfLines={1}>
                {store.name}
              </Text>
              <Text style={styles.trendingTag}>رائج 🔥</Text>
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
    paddingHorizontal: 12,
    paddingVertical: 20,
  },
  loader: {
    height: 170,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    color: COLORS.primary,
    fontFamily: "Cairo-Bold",
    textAlign: "right",
    marginBottom: 10,
  },
  scrollViewContent: {
    paddingRight: 5,
  },
  card: {
    width: 165,
    marginRight: 12,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#FFF",
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 2,
  },
  image: {
    width: "100%",
    height: 112,
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(30, 18, 10, 0.60)",
    paddingVertical: 10,
    paddingHorizontal: 8,
    flexDirection: "column",
    alignItems: "flex-end",
  },
  text: {
    fontSize: 16,
    color: "#FFF",
    fontFamily: "Cairo-Bold",
    marginBottom: 2,
    textAlign: "right",
  },
  trendingTag: {
    backgroundColor: COLORS.accent,
    color: "#fff",
    fontSize: 12,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 1,
    alignSelf: "flex-end",
    fontFamily: "Cairo-SemiBold",
    marginTop: 2,
    opacity: 0.9,
  },
});

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { API_URL } from "utils/api/config";


const COLORS = {
  primary: "#D84315",
  secondary: "#5D4037",
  background: "#FFFFFF",
  text: "#4E342E",
  accent: "#8B4B47",
};

interface Category {
  _id: string;
  name: string;
  image: string; // رابط صورة القسم من الباك إند
}
interface Props {
  onSelectCategory?: (categoryId: string, title: string) => void;
    sectionTitle?: string;

}



const DeliveryCategories: React.FC<Props> = ({
  onSelectCategory,
  sectionTitle = "الفئات",
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {

      try {
        const res = await fetch(`${API_URL}/delivery/categories`);
        const data = await res.json();
        setCategories(data);

      } catch (error) {
        console.error("فشل في تحميل الفئات", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const chunkedCategories = [];
  for (let i = 0; i < categories.length; i += 3) {
    chunkedCategories.push(categories.slice(i, i + 3));
  }

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
      {chunkedCategories.map((row, index) => (
        <View key={index} style={styles.row}>
          {row.map((item) => (
            <TouchableOpacity
              key={item._id}
              style={styles.categoryCard}
onPress={() => onSelectCategory?.(item._id, item.name)}
              activeOpacity={0.9}
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={styles.text}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

export default DeliveryCategories;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 22,
    color: COLORS.primary,
    fontFamily: "Cairo-Bold",
    textAlign: "right",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  categoryCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  image: {
    width: 60,
    height: 60,
    marginBottom: 6,
    resizeMode: "contain",
  },
  text: {
    fontSize: 14,
    color: COLORS.text,
    fontFamily: "Cairo-Regular",
    textAlign: "center",
    paddingHorizontal: 5,
  },
  loader: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
});

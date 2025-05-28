import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  I18nManager,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {categories} from "../../data/data";
import { useNavigation } from "@react-navigation/native";
import { CompositeNavigationProp } from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation"; // تأكد من استيراد هذا
import { fetchCategories } from "api/categoryApi";

type Category = {
  _id: string;
  name: string;
  image?: string;
};
// نظام الألوان الموحد
const COLORS = {
  primary: "#D84315", // أحمر ترابي
  secondary: "#5D4037", // بني داكن
  background: "#FFFFFF", // بيج فاتح
  text: "#4E342E", // بني غامق
  accent: "#8B4B47", // أحمر داكن
};
// نوع التنقل
type MarketStackParamList = {
  AllProducts: { selectedCategoryId?: string };
  ProductDetails: { product: any };
};
type Props = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList, "MarketStack">,
  NativeStackNavigationProp<MarketStackParamList>
>;


const { width } = Dimensions.get("window");
const CARD_SIZE = (width - 48) / 4; // 16 * 3 padding

const MarketCategories = () => {
  const navigation = useNavigation<Props>();

const [categories, setCategories] = useState<Category[]>([]);

useEffect(() => {
  const load = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      console.error("فشل في تحميل الفئات", err);
    }
  };
  load();
}, []);

  const renderItem = ({ item }: { item: Category }) => (
  <TouchableOpacity
    style={styles.card}
    activeOpacity={0.9}
    onPress={() =>
      navigation.navigate("MarketStack", {
        screen: "AllProducts",
        params: { selectedCategoryId: item._id },
      })
    }
  >
<View style={styles.iconContainer}>
  <Image
    source={{ uri:item.image}}
    style={{ width: 40, height: 40, resizeMode: "contain" }}
  />
</View>
    <Text style={styles.label}>{item.name}</Text>
  </TouchableOpacity>
);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>فئات المتجر</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>المزيد</Text>
        </TouchableOpacity>
      </View>

  <FlatList
  data={categories}
  renderItem={renderItem}
  keyExtractor={(item) => item._id}
  numColumns={4}
  scrollEnabled={false}
  columnWrapperStyle={styles.row}
  contentContainerStyle={styles.listContent}
/>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: "Cairo-Bold",
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  seeAll: {
    color: COLORS.accent,
    fontFamily: "Cairo-SemiBold",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  listContent: {
    paddingHorizontal: 4,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE + 20,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    elevation: 3,
    shadowColor: COLORS.secondary,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  label: {
    fontSize: 12,
    fontFamily: "Cairo-SemiBold",
    color: COLORS.text,
    textAlign: "center",
    lineHeight: 16,
  },
});

export default MarketCategories;

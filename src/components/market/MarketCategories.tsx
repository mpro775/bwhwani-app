import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  RefreshControl,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CompositeNavigationProp } from "@react-navigation/native";
import {
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { fetchCategories } from "api/categoryApi";
import { RootStackParamList } from "types/navigation";
import SkeletonBox from "components/SkeletonBox";

const COLORS = {
  primary: "#D84315",
  secondary: "#5D4037",
  background: "#FFFFFF",
  text: "#4E342E",
  accent: "#8B4B47",
};

const { width } = Dimensions.get("window");
const CARD_SIZE = (width - 48) / 3; // ← فقط 3 أعمدة

type Category = {
  _id: string;
  name: string;
  image?: string;
};

type MarketStackParamList = {
  AllProducts: { selectedCategoryId?: string };
  ProductDetails: { product: any };
};

type Props = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList, "MarketStack">,
  NativeStackNavigationProp<MarketStackParamList>
>;

const MarketCategories = () => {
  const navigation = useNavigation<Props>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("⚠️ فشل في تحميل الفئات:", err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, []);

  const renderItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() =>
        navigation.navigate("MarketStack", {
          screen: "AllProducts",
          params: { selectedCategoryId: item._id },
        })
      }
    >
      <View style={styles.iconContainer}>
        <Image
          source={{ uri: item.image }}
        style={styles.image}
        />
      </View>
    <Text style={styles.label}>{item.name}</Text>
    </TouchableOpacity>
  );
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>فئات المتجر</Text>
        <TouchableOpacity >
          <Text style={styles.seeAll}>عرض الكل</Text>
        </TouchableOpacity>
      </View>

    {loading ? (
  <View style={styles.row}>
    {[...Array(4)].map((_, index) => (
      <View key={index} style={styles.card}>
        <SkeletonBox width={78} height={78} borderRadius={39} />
        <SkeletonBox width={52} height={12} borderRadius={6} style={{ marginTop: 8 }} />
      </View>
    ))}
  </View>
) : (
  <FlatList
    data={categories}
    scrollEnabled={false}
    renderItem={renderItem}
    keyExtractor={(item) => item._id}
    numColumns={4}
    columnWrapperStyle={styles.row}
    contentContainerStyle={styles.listContent}
    refreshControl={
      <RefreshControl refreshing={loading} onRefresh={loadCategories} />
    }
    ListEmptyComponent={
      !loading ? (
        <Text style={styles.emptyText}>لا توجد فئات حالياً</Text>
      ) : null
    }
  />
)}


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: "Cairo-Bold",
    color: COLORS.text,
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
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
iconContainer: {
  width: 78,
  height: 78,
  borderRadius: 39, // دائرة
  backgroundColor: "#FFF",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 8,
  elevation: 3,
  shadowColor: "#000",
  shadowOpacity: 0.15,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 3 },
},
image: {
  width: 52,
  height: 52,
  resizeMode: "cover", // تغطية
  borderRadius: 26, // الشكل ناعم حتى لو كانت الصورة مربعة
},
label: {
  fontSize: 14,
  fontFamily: "Cairo-Bold",
  color: COLORS.text,
  textAlign: "center",
  marginTop: 4,
},


  emptyText: {
    textAlign: "center",
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    color: "#999",
    marginTop: 16,
  },
});

export default MarketCategories;

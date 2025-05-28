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

const COLORS = {
  primary: "#D84315",
  secondary: "#5D4037",
  background: "#FFFFFF",
  text: "#4E342E",
  accent: "#8B4B47",
};

const { width } = Dimensions.get("window");
const CARD_SIZE = (width - 48) / 4;

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
          style={{ width: 36, height: 36, resizeMode: "contain" }}
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

      <FlatList
        data={categories}
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
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    elevation: 2,
    shadowColor: COLORS.secondary,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  label: {
    fontSize: 12,
    fontFamily: "Cairo-SemiBold",
    color: COLORS.text,
    textAlign: "center",
    lineHeight: 16,
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

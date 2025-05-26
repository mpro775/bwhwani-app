import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";

const categories = [
  "المطاعم",
  "وجبات المطاعم",
  "المتاجر",
  "التحف والهدايا",
] as const;

const sampleFavorites: Record<Category, any[]> = {
  المطاعم: [],
  "وجبات المطاعم": [],
  المتاجر: [],
  "التحف والهدايا": [],
};
type Category = (typeof categories)[number];
const FavoritesScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>("المطاعم");

  const data = sampleFavorites[selectedCategory];

  const handleRefresh = () => {
    // منطق جلب المفضلة من السيرفر أو من التخزين
    console.log("جاري التحديث...");
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            style={[styles.tab, selectedCategory === cat && styles.activeTab]}
          >
            <Text
              style={[
                styles.tabText,
                selectedCategory === cat && styles.activeTabText,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* قائمة المفضلة أو فارغ */}
      {data.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={require("../../../assets/empty_favorite.png")}
            style={styles.emptyImage}
          />
          <Text style={styles.emptyText}>لا يوجد مفضلة</Text>
          <TouchableOpacity onPress={handleRefresh}>
            <Text style={styles.refreshText}>تحديث</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 80 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text>{item.name}</Text>
              {/* أضف عرض المنتج / المتجر حسب التصميم */}
            </View>
          )}
        />
      )}
    </View>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  tabsContainer: {
    flexDirection: "row-reverse",
    paddingVertical: 6,
    paddingHorizontal: 4,
    minHeight: 40,
    alignItems: "center",
  },

  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#eee",
    marginHorizontal: 4,
    marginVertical: 30,
    alignSelf: "flex-start", // مهم لتقليل الارتفاع
  },
  activeTab: {
    backgroundColor: "#F28B50",
  },
  tabText: {
    fontSize: 13,
    color: "#555",
    fontFamily: "Cairo-Regular", // أضف هذا
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "bold", // يمكن إزالته والاكتفاء بالخط
    fontFamily: "Cairo-Bold", // أضف هذا
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  emptyImage: {
    width: 140,
    height: 140,
    resizeMode: "contain",
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
  },
  refreshText: {
    color: "#E64A19",
    fontWeight: "bold",
  },
  card: {
    padding: 16,
    backgroundColor: "#f7f7f7",
    marginBottom: 10,
    borderRadius: 10,
  },
});

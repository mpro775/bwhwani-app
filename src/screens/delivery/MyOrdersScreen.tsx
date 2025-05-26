import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// تعريف الألوان
const COLORS = {
  primary: "#D84315",
  secondary: "#5D4037",
  background: "#FFFFFF",
  text: "#4E342E",
  accent: "#8B4B47",
};

type RootStackParamList = {
  MyOrders: undefined;
  OrderDetailsScreen: {
    order: {
      id: number;
      store: string;
      date: string;
      time: string;
      address: string;
      status: string;
      basket: {
        name: string;
        quantity: number;
        price: number;
      }[];
      total: number;
      deliveryFee: number;
      discount: number;
      paymentMethod: string;
      notes?: string;
    };
  };
};

type Order = {
  id: number;
  store: string;
  logo?: any;
  total: number;
  date: string;
  time: string;
  status: string;
  category: string;
  address: string;
  basket: {
    name: string;
    quantity: number;
    price: number;
  }[];
  deliveryFee: number;
  discount: number;
  paymentMethod: string;
  notes?: string;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "MyOrders">;
const categories = ["الكل", "المطاعم", "المتاجر", "التحف والهدايا"];

const MyOrdersScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [selectedMonth, setSelectedMonth] = useState("2025-5");
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const loadOrders = async () => {
      const stored = await AsyncStorage.getItem("user-orders");
      if (stored) {
        const parsed = JSON.parse(stored);
        setOrders(parsed);
      }
    };
    loadOrders();
  }, []);

  const filteredOrders = orders.filter((order) =>
    selectedCategory === "الكل" ? true : order.category === selectedCategory
  );

  return (
    <View style={styles.container}>
      {/* فلترة الفترة مع أيقونة */}
      <View style={styles.filterContainer}>
        <Ionicons name="calendar" size={20} color={COLORS.primary} />
        <TouchableOpacity style={styles.monthFilter}>
          <Text style={styles.monthText}>{selectedMonth}</Text>
          <Ionicons name="chevron-down" size={16} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* تصنيفات بتدرج لوني */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
        style={styles.categoriesWrapper} // أضف هذا
      >
        {categories.map((cat, index) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            style={[
              styles.categoryButton,
              selectedCategory === cat && styles.activeCategory,
              index !== 0 && { marginRight: 8 }, // بدل gap
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat && styles.activeCategoryText,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* قائمة الطلبات مع تصميم مميز */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.ordersList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.orderCard}
            onPress={() =>
              navigation.navigate("OrderDetailsScreen", { order: item })
            }
            activeOpacity={0.9}
          >
            {/* شريط حالة الطلب */}
            <View
              style={[
                styles.statusBar,
                item.status === "تم التوصيل"
                  ? styles.deliveredBar
                  : styles.pendingBar,
              ]}
            >
              <View style={styles.progressIndicator} />
            </View>

            <View style={styles.orderContent}>
              {/* معلومات المتجر */}
              <View style={styles.storeInfo}>
                <Image source={item.logo} style={styles.storeLogo} />
                <View>
                  <Text style={styles.storeName}>{item.store}</Text>
                  <Text style={styles.orderCategory}>{item.category}</Text>
                </View>
              </View>

              {/* تفاصيل الطلب */}
              <View style={styles.orderDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="time" size={16} color="#666" />
                  <Text style={styles.detailText}>{item.time}</Text>
                  <Text style={styles.detailText}>{item.date}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="pricetag" size={16} color="#666" />
                  <Text style={styles.totalPrice}>
                    {item.total.toFixed(1)} ر.س
                  </Text>
                </View>
              </View>

              {/* حالة الطلب مع أيقونة */}
              <View style={styles.statusContainer}>
                <Ionicons
                  name={
                    item.status === "تم التوصيل" ? "checkmark-done" : "timer"
                  }
                  size={20}
                  color="#fff"
                />
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  categoriesWrapper: {
    maxHeight: 50, 
marginBottom:20,
  },

  filterContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    marginVertical: 16,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    flexGrow: 0,
  },
  monthFilter: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
  },
  monthText: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 16,
    color: COLORS.text,
  },
  categoriesContainer: {
    flexDirection: "row-reverse",
    paddingVertical: 6,
    paddingHorizontal: 4,
    alignItems: "center",
    minHeight: 40,
  },
  categoryButton: {
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#EEE",
    alignSelf: "flex-start",
  },

  activeCategory: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.accent,
  },
  categoryText: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 14,
    color: "#666",
  },
  activeCategoryText: {
    color: "#fff",
  },
  ordersList: {},
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 2,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: "hidden",
  },
  statusBar: {
    height: 4,
    width: "100%",
    backgroundColor: "#F5F5F5",
  },
  deliveredBar: {
    backgroundColor: "#4CAF50",
  },
  pendingBar: {
    backgroundColor: "#FFA000",
  },
  progressIndicator: {
    width: "70%",
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  orderContent: {
    padding: 16,
  },
  storeInfo: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  storeLogo: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  storeName: {
    fontFamily: "Cairo-Bold",
    fontSize: 18,
    color: COLORS.text,
  },
  orderCategory: {
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    color: "#666",
  },
  orderDetails: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#F5F5F5",
    paddingVertical: 16,
    marginVertical: 12,
  },
  detailRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    marginVertical: 6,
  },
  detailText: {
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    color: "#666",
  },
  totalPrice: {
    fontFamily: "Cairo-Bold",
    fontSize: 16,
    color: COLORS.primary,
  },
  statusContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  statusText: {
    fontFamily: "Cairo-Bold",
    fontSize: 14,
    color: "#fff",
  },
});

export default MyOrdersScreen;

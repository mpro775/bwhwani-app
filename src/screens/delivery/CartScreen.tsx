import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
} from "react-native";
import { useCart } from "../../context/CartContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import ScheduledDeliveryPicker from "components/ScheduledDeliveryPicker";
import RadioGroup from "components/RadioGroup";

const COLORS = {
  primary: "#D84315",
  secondary: "#5D4037",
  background: "#FFF5F2",
  text: "#4E342E",
  accent: "#8B4B47",
};
type RootStackParamList = {
  CartScreen: undefined;
  InvoiceScreen: {
    items: any[]; // أو تكتب النوع الحقيقي لاحقًا
  };
};

type NavProp = NativeStackNavigationProp<RootStackParamList, "CartScreen">;

const CartScreen = () => {
  const { items, updateQuantity, removeFromCart, totalPrice, totalQuantity } =
    useCart();
    const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
const cartItems = items || [];
const [deliveryMode, setDeliveryMode] = useState<"unified" | "split">("split");
const storeIds = [...new Set(cartItems.map((item: any) => item.storeId?.toString()))];

  const navigation = useNavigation<NavProp>();

  const scaleAnim = new Animated.Value(1);

  const animatePress = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      friction: 3,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start();
    });
  };

  const confirmRemove = (id: string) => {
    Alert.alert("حذف المنتج", "هل أنت متأكد من حذف هذا المنتج؟", [
      {
        text: "إلغاء",
        style: "cancel",
        onPress: () => animatePress(),
      },
      {
        text: "نعم",
        onPress: () => {
          removeFromCart(id);
          animatePress();
        },
      },
    ]);
  };

  const renderItem = ({ item }: any) => (
    <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
<Image source={{ uri: item.image }} style={styles.image} />      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>

        <View style={styles.priceContainer}>
          {item.originalPrice && item.originalPrice > item.price && (
            <Text style={styles.originalPrice}>
              {item.originalPrice.toFixed(1)} ر.س
            </Text>
          )}
          <Text style={styles.price}>{item.price.toFixed(1)} ر.س</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => confirmRemove(item.id)}
            style={styles.deleteButton}
          >
            <Ionicons name="trash" size={20} color={COLORS.primary} />
          </TouchableOpacity>

          <View style={styles.quantityControl}>
            <TouchableOpacity
              onPress={() => updateQuantity(item.id, item.quantity - 1)}
              style={styles.quantityButton}
            >
              <Ionicons name="remove" size={18} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.quantity}>{item.quantity}</Text>

            <TouchableOpacity
              onPress={() => updateQuantity(item.id, item.quantity + 1)}
              style={styles.quantityButton}
            >
              <Ionicons name="add" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#ddd" />
          <Text style={styles.emptyText}>سلتك فارغة</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
          />

          <LinearGradient
            colors={["rgba(255,245,242,0.9)", "rgba(255,245,242,1)"]}
            style={styles.footer}
          >
            {storeIds.length > 1 && (
  <View style={{ marginVertical: 10 }}>
    <Text>اختر نوع التوصيل:</Text>
    <RadioGroup
      options={[
        { label: "توصيل موحد (مندوب واحد)", value: "unified" },
        { label: "توصيل منفصل لكل متجر", value: "split" }
      ]}
      selectedValue={deliveryMode}
      onChange={setDeliveryMode}
    />
  </View>
)}
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => navigation.navigate("InvoiceScreen", { items })}
              activeOpacity={0.9}
            >
              <View style={styles.checkoutContent}>
                <View style={styles.totalContainer}>
                  <Text style={styles.totalLabel}>الإجمالي</Text>
                  <Text style={styles.totalPrice}>
                    {totalPrice.toFixed(1)} ر.س
                  </Text>
                </View>

                <View style={styles.checkoutBadge}>
                  <Text style={styles.badgeText}>{totalQuantity}</Text>
                  <Ionicons name="arrow-forward" size={24} color="#fff" />
                </View>
                <ScheduledDeliveryPicker onChange={(date) => setScheduledDate(date)} />


              </View>
            </TouchableOpacity>
          </LinearGradient>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    marginVertical: 60,
  },
  card: {
    flexDirection: "row-reverse",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    elevation: 5,
    textAlign: "right",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "cover",
  },
  details: {
    flex: 1,
    padding: 16,
    textAlign: "right",

    justifyContent: "space-between",
  },
  name: {
    fontFamily: "Cairo-Bold",
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 8,
    textAlign: "right",
  },
  priceContainer: {
    flexDirection: "row-reverse",
    alignItems: "baseline",
    gap: 8,
    marginBottom: 12,
  },
  price: {
    fontFamily: "Cairo-Bold",
    fontSize: 18,
    color: COLORS.primary,
  },
  originalPrice: {
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    color: "#999",
    textDecorationLine: "line-through",
  },
  actions: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deleteButton: {
    padding: 8,
  },
  quantityControl: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 6,
  },
  quantityButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    padding: 6,
  },
  quantity: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 16,
    color: "#fff",
    minWidth: 30,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  checkoutContent: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  totalContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  totalLabel: {
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
  },
  totalPrice: {
    fontFamily: "Cairo-Bold",
    fontSize: 24,
    color: "#fff",
  },
  checkoutBadge: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  badgeText: {
    fontFamily: "Cairo-Bold",
    fontSize: 18,
    color: "#fff",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  emptyText: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 18,
    color: "#ccc",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 150,
  },
});

export default CartScreen;

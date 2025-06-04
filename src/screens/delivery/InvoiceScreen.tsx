import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
  ActivityIndicator,
  Dimensions,
  Platform,
} from "react-native";
import { useCart } from "../../context/CartContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axiosInstance from "utils/api/axiosInstance";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { isConnected } from "utils/network";
import { queueOfflineRequest } from "utils/offlineQueue";

// تعريف الألوان
const COLORS = {
  primary: "#D84315",
  secondary: "#5D4037",
  background: "#FFFFFF",
  text: "#212121",
  accent: "#8B4B47",
  border: "#E0E0E0",
  error: "#F44336",
  warning: "#FF9800",
  info: "#2196F3",
  success: "#4CAF50",
  white: "#FFFFFF",
  gray: "#9E9E9E",
  darkGray: "#616161",
};

type RootStackParamList = {
  CartScreen: undefined;
  MyOrdersScreen: undefined;
};

type NavProp = NativeStackNavigationProp<RootStackParamList, "CartScreen">;

const { width } = Dimensions.get("window");

const InvoiceScreen = () => {
  const navigation = useNavigation<NavProp>();
  const { items, clearCart, totalPrice } = useCart();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [captainTip, setCaptainTip] = useState<number>(0);
  const [coupon, setCoupon] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "cod">("cod");
  const [loading, setLoading] = useState<boolean>(false);
  const [couponValid, setCouponValid] = useState<boolean | null>(null);

  const animatePress = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // حساب الأسعار
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = 650;
  const discount = coupon === "خصم10" ? subtotal * 0.1 : 0;
  const total = subtotal + deliveryFee + captainTip - discount;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // جلب عناوين المستخدم
  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get("/users/address");
        const { addresses: userAddresses, defaultAddressId } = res.data;
        setAddresses(userAddresses);

        if (defaultAddressId) {
          setSelectedAddressId(defaultAddressId);
        } else if (userAddresses.length) {
          setSelectedAddressId(userAddresses[0]._id);
        }
      } catch (err: any) {
        console.log("fetch addresses error", err.response?.status, err.response?.data);
        Alert.alert(
          "خطأ",
          "تعذر جلب العناوين: " + (err.response?.data?.message || err.message)
        );
      }
    })();
  }, []);

  const handlePressIn = () => {
    Animated.spring(animatePress, { toValue: 0.98, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animatePress, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const validateCoupon = () => {
    if (coupon.trim() === "") {
      setCouponValid(null);
      return;
    }

    const isValid = coupon === "خصم10";
    setCouponValid(isValid);

    if (!isValid) {
      Alert.alert("كوبون غير صالح", "رمز الكوبون الذي أدخلته غير صحيح");
    }
  };

  const handleOrder = async () => {
    if (!selectedAddressId) {
      Alert.alert("تنبيه", "يرجى اختيار عنوان التوصيل");
      return;
    }

    if (items.length === 0) {
      Alert.alert("تنبيه", "لا توجد عناصر في السلة");
      return;
    }
      const connected = await isConnected();

    setLoading(true);
    try {
      const payload = {
        addressId: selectedAddressId,
        notes,
        paymentMethod,
        captainTip,
        coupon: couponValid ? coupon : "",
        items: items.map((i) => ({
          productId: i.id,
          name: i.name,
          quantity: i.quantity,
          unitPrice: i.price,
        })),
      };

      await axiosInstance.post("/delivery/cart/add", {
        items: payload.items,
        storeId: items[0]?.storeId,
      });

  if (!connected) {
    await queueOfflineRequest("POST", "/orders", payload);
    Alert.alert("لا يوجد اتصال، سيتم إرسال الطلب تلقائيًا عند استعادة الشبكة.","تنبية");
  } else {
    await axiosInstance.post("/orders", payload);
  }

      const response = await axiosInstance.post("/delivery/order", payload);
      clearCart();
      
      Alert.alert(
        "✅ تم تنفيذ الطلب بنجاح!",
        `رقم الطلب: ${response.data.orderNumber}`,
        [
          { text: "استمرار", style: "cancel" },
          {
            text: "عرض طلباتي",
            onPress: () => navigation.navigate("MyOrdersScreen"),
          },
        ]
      );
    } catch (err: any) {
      console.log("Order error status:", err.response?.status);
      console.log("Order error data:  ", err.response?.data);
      Alert.alert(
        "خطأ",
        err.response?.data?.message || "حدث خطأ أثناء تنفيذ الطلب"
      );
    } finally {
      setLoading(false);
    }
  };

  const renderPriceBreakdown = () => {
    return (
      <View style={styles.priceBreakdown}>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>المجموع الجزئي</Text>
          <Text style={styles.priceValue}>{subtotal.toFixed(1)} ر.س</Text>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>رسوم التوصيل</Text>
          <Text style={styles.priceValue}>{deliveryFee.toFixed(1)} ر.س</Text>
        </View>
        
        {discount > 0 && (
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, styles.discountText]}>الخصم</Text>
            <Text style={[styles.priceValue, styles.discountText]}>
              -{discount.toFixed(1)} ر.س
            </Text>
          </View>
        )}
        
        {captainTip > 0 && (
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>بقشيش المندوب</Text>
            <Text style={styles.priceValue}>{captainTip.toFixed(1)} ر.س</Text>
          </View>
        )}
      </View>
    );
  };

  const renderTipButtons = () => {
    const tips = [0, 5, 10, 15];
    return (
      <View style={styles.tipContainer}>
        <Text style={styles.tipTitle}>إضافة بقشيش للمندوب</Text>
        <View style={styles.tipButtons}>
          {tips.map((tip) => (
            <TouchableOpacity
              key={tip}
              style={[
                styles.tipButton,
                captainTip === tip && styles.selectedTipButton,
              ]}
              onPress={() => setCaptainTip(tip)}
            >
              <Text
                style={[
                  styles.tipButtonText,
                  captainTip === tip && styles.selectedTipButtonText,
                ]}
              >
                {tip === 0 ? "لا شكراً" : `${tip} ر.س`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* عنوان التوصيل */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>عنوان التوصيل</Text>
          </View>
          
          {addresses.length === 0 ? (
            <Text style={styles.emptyText}>لا توجد عناوين مسجلة</Text>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.addressesContainer}
            >
              {addresses.map((addr) => (
                <TouchableOpacity
                  key={addr._id}
                  style={[
                    styles.addressCard,
                    selectedAddressId === addr._id && styles.selectedCard,
                  ]}
                  onPress={() => setSelectedAddressId(addr._id)}
                >
                  <View style={styles.addressHeader}>
                    <Text style={styles.addressLabel}>{addr.label}</Text>
                    {selectedAddressId === addr._id && (
                      <MaterialIcons
                        name="check-circle"
                        size={20}
                        color={COLORS.primary}
                      />
                    )}
                  </View>
                  <Text style={styles.addressText}>
                    {addr.street}, {addr.city}
                  </Text>
                  <Text style={styles.addressDetails}>
                    {addr.additionalDetails}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* كوبون الخصم */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="pricetag" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>كوبون الخصم</Text>
          </View>
          
          <View style={styles.couponRow}>
            <TextInput
              style={[
                styles.couponInput,
                couponValid === true && styles.validCoupon,
                couponValid === false && styles.invalidCoupon,
              ]}
              placeholder="أدخل رمز الكوبون"
              placeholderTextColor={COLORS.gray}
              value={coupon}
              onChangeText={(text) => {
                setCoupon(text);
                setCouponValid(null);
              }}
            />
            <TouchableOpacity
              style={styles.validateButton}
              onPress={validateCoupon}
            >
              <Text style={styles.validateButtonText}>تحقق</Text>
            </TouchableOpacity>
          </View>
          
          {couponValid === true && (
            <View style={styles.couponSuccess}>
              <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
              <Text style={styles.couponSuccessText}>
                تم تطبيق خصم 10% على الطلب
              </Text>
            </View>
          )}
        </View>

        {/* بقشيش المندوب */}
        {renderTipButtons()}

        {/* تفاصيل الطلب */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="list" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>تفاصيل الطلب</Text>
          </View>
          
          <View style={styles.itemsContainer}>
            {items.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemQuantity}>× {item.quantity}</Text>
                </View>
                <Text style={styles.itemPrice}>
                  {(item.price * item.quantity).toFixed(1)} ر.س
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* تفاصيل السعر */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="receipt" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>تفاصيل الفاتورة</Text>
          </View>
          {renderPriceBreakdown()}
        </View>

        {/* طريقة الدفع */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="card" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>طريقة الدفع</Text>
          </View>
          
          <View style={styles.paymentMethods}>
            {[
              { label: "الدفع عند الاستلام", value: "cod", icon: "cash" },
              { label: "دفع من المحفظة", value: "wallet", icon: "wallet" },
            ].map((m) => (
              <TouchableOpacity
                key={m.value}
                style={[
                  styles.paymentMethod,
                  paymentMethod === m.value && styles.selectedPayment,
                ]}
                onPress={() => setPaymentMethod(m.value as any)}
              >
                <Ionicons
                  name="cash"
                  size={24}
                  color={paymentMethod === m.value ? COLORS.primary : COLORS.gray}
                />
                <Text
                  style={[
                    styles.paymentText,
                    paymentMethod === m.value && styles.selectedPaymentText,
                  ]}
                >
                  {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ملاحظات إضافية */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="create" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>ملاحظات إضافية</Text>
          </View>
          
          <TextInput
            style={styles.notesInput}
            placeholder="أكتب ملاحظاتك هنا..."
            placeholderTextColor={COLORS.gray}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />
        </View>
      </ScrollView>

      {/* زر التأكيد */}
      <Animated.View
        style={[
          styles.confirmContainer,
          { transform: [{ scale: animatePress }] },
        ]}
      >
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>الإجمالي النهائي</Text>
          <Text style={styles.totalValue}>{total.toFixed(1)} ر.س</Text>
        </View>
        
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleOrder}
          disabled={loading}
          activeOpacity={0.8}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.confirmButtonText}>تأكيد الطلب</Text>
              <Ionicons
                name="arrow-forward"
                size={20}
                color="#fff"
                style={styles.confirmIcon}
              />
            </>
          )}
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 120,
  },
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
    color: COLORS.text,
  },
  emptyText: {
    textAlign: "center",
    color: COLORS.gray,
    marginVertical: 8,
  },
  addressesContainer: {
    paddingVertical: 4,
  },
  addressCard: {
    width: width * 0.75,
    padding: 16,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 12,
  },
  selectedCard: {
    borderColor: COLORS.primary,
    backgroundColor: "#F1F8E9",
  },
  addressHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  addressText: {
    fontSize: 14,
    color: COLORS.darkGray,
    textAlign: "right",
    marginBottom: 2,
  },
  addressDetails: {
    fontSize: 13,
    color: COLORS.gray,
    textAlign: "right",
    fontStyle: "italic",
  },
  couponRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginTop: 8,
  },
  couponInput: {
    flex: 1,
    padding: 12,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    textAlign: "right",
    fontSize: 16,
    color: COLORS.text,
  },
  validCoupon: {
    borderColor: COLORS.success,
    backgroundColor: "#E8F5E9",
  },
  invalidCoupon: {
    borderColor: COLORS.error,
    backgroundColor: "#FFEBEE",
  },
  validateButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  validateButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 14,
  },
  couponSuccess: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginTop: 8,
    padding: 8,
    backgroundColor: "#E8F5E9",
    borderRadius: 8,
  },
  couponSuccessText: {
    color: COLORS.success,
    marginRight: 4,
    fontSize: 14,
  },
  tipContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 12,
    textAlign: "right",
  },
  tipButtons: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  tipButton: {
    width: width * 0.43,
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
    alignItems: "center",
  },
  selectedTipButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tipButtonText: {
    fontSize: 14,
    color: COLORS.text,
  },
  selectedTipButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  itemsContainer: {
    marginTop: 8,
  },
  itemRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  itemInfo: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  itemName: {
    fontSize: 15,
    color: COLORS.text,
    marginRight: 8,
  },
  itemQuantity: {
    fontSize: 14,
    color: COLORS.gray,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },
  priceBreakdown: {
    marginTop: 8,
  },
  priceRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  priceLabel: {
    fontSize: 14,
    color: COLORS.text,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  discountText: {
    color: COLORS.success,
  },
  paymentMethods: {
    marginTop: 8,
  },
  paymentMethod: {
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
  },
  selectedPayment: {
    borderColor: COLORS.primary,
    backgroundColor: "#F1F8E9",
  },
  paymentText: {
    fontSize: 15,
    color: COLORS.text,
    marginRight: 8,
  },
  selectedPaymentText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  notesInput: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: "top",
    textAlign: "right",
    fontSize: 14,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  confirmContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  totalContainer: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "600",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: "row-reverse",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  confirmIcon: {
    marginRight: 8,
  },
});

export default InvoiceScreen;
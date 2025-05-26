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
} from "react-native";
import { useCart } from "../../context/CartContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axios from "axios";
import axiosAuth from "utils/axiosAuth";

// تعريف الألوان
const COLORS = {
  primary: "#D84315",
  secondary: "#5D4037",
  background: "#FFFFFF",
  text: "#4E342E",
  accent: "#8B4B47",
};

type RootStackParamList = {
  CartScreen: undefined;
  MyOrdersScreen: undefined;
};

type NavProp = NativeStackNavigationProp<RootStackParamList, 'CartScreen'>;

const InvoiceScreen = () => {
  const navigation = useNavigation<NavProp>();
  const { items, clearCart, totalPrice } = useCart();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [captainTip, setCaptainTip] = useState<number>(0);
  const [coupon, setCoupon] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'cod'>('cod');
  const [loading, setLoading] = useState<boolean>(false);

  const animatePress = useRef(new Animated.Value(1)).current;

  // حساب الأسعار
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = 650;
  const discount = coupon === "خصم10" ? subtotal * 0.1 : 0;
  const total = subtotal + deliveryFee + captainTip - discount;

  // جلب عناوين المستخدم
 useEffect(() => {
  (async () => {
    try {
      // لوق للتأكد
      console.log('calling', axiosAuth.defaults.baseURL + '/users/address');
      
      const res = await axiosAuth.get('/users/address');
      console.log('addresses response', res.status, res.data);

      // تفكيك البيانات
      const { addresses: userAddresses, defaultAddressId } = res.data;
      setAddresses(userAddresses);

      if (defaultAddressId) {
        setSelectedAddressId(defaultAddressId);
      } else if (userAddresses.length) {
        setSelectedAddressId(userAddresses[0]._id);
      }
    } catch (err: any) {
      console.log('fetch addresses error', err.response?.status, err.response?.data);
      Alert.alert(
        'خطأ',
        'تعذر جلب العناوين: ' +
          (err.response?.data?.message || err.message)
      );
    }
  })();
}, []);


  const handlePressIn = () => {
    Animated.spring(animatePress, { toValue: 0.98, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(animatePress, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start();
  };

  const handleOrder = async () => {
    if (!selectedAddressId) {
      Alert.alert('تنبيه', 'يرجى اختيار عنوان');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        addressId: selectedAddressId,
        notes,
        paymentMethod,
        captainTip,
        coupon,
      };
await axiosAuth.post('/delivery/order', payload);
      clearCart();
      Alert.alert('✅ تم تنفيذ الطلب بنجاح!', '', [
        { text: 'عرض طلباتي', onPress: () => navigation.navigate('MyOrdersScreen') }
      ]);
      
    } catch (err: any) {
        console.log('Order error status:', err.response?.status);
  console.log('Order error data:  ', err.response?.data);
      Alert.alert('خطأ', err.response?.data?.message || 'فشل تنفيذ الطلب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* اختيار العنوان */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>اختر عنوان التوصيل</Text>
        {addresses.map(addr => (
          <TouchableOpacity
            key={addr._id}
            style={[styles.addressCard, selectedAddressId === addr._id && styles.selectedCard]}
            onPress={() => setSelectedAddressId(addr._id)}>
            <Text style={styles.addressLabel}>{addr.label}</Text>
            <Text style={styles.addressText}>{addr.street}, {addr.city}</Text>
          </TouchableOpacity>
        ))}
      </View>



      {/* كوبون الخصم */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>كوبون الخصم</Text>
        <View style={styles.couponContainer}>
          <TextInput
            style={styles.couponInput}
            placeholder="أدخل رمز الكوبون"
            value={coupon}
            onChangeText={setCoupon}
          />
        </View>
      </View>

      {/* ملخص الطلب */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>ملخص الطلب</Text>
        {items.map(item => (
          <View key={item.id} style={styles.itemRow}>
            <Text style={styles.itemName}>{item.name} × {item.quantity}</Text>
            <Text style={styles.itemPrice}>{(item.price * item.quantity).toFixed(1)} ر.س</Text>
          </View>
        ))}
      </View>

      {/* طريقة الدفع */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>طريقة الدفع</Text>
        {[
          { label: 'الدفع عند الاستلام', value: 'cod' },
          { label: 'دفع من المحفظة', value: 'wallet' }
        ].map(m => (
          <TouchableOpacity
            key={m.value}
            style={[styles.paymentMethod, paymentMethod === m.value && styles.selectedPayment]}
            onPress={() => setPaymentMethod(m.value as any)}>
            <Text style={styles.paymentText}>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ملاحظات */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>ملاحظات إضافية</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="أكتب ملاحظاتك..."
          value={notes}
          onChangeText={setNotes}
          multiline
        />
      </View>

      {/* الإجمالي النهائي */}
      <Animated.View
        style={[styles.totalCard, { transform: [{ scale: animatePress }] }]
        }
        onTouchStart={handlePressIn}
        onTouchEnd={handlePressOut}
      >
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>الإجمالي النهائي</Text>
          <Text style={styles.totalValue}>{total.toFixed(1)} ر.س</Text>
        </View>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleOrder}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : (
            <Text style={styles.confirmButtonText}>تأكيد الطلب</Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 ,marginVertical:60},
  sectionCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, textAlign: 'right' },
  addressCard: { padding: 12, borderRadius: 8, backgroundColor: '#f5f5f5', marginBottom: 8 },
  selectedCard: { borderWidth: 2, borderColor: COLORS.primary },
  addressLabel: { fontSize: 16, fontWeight: '600', textAlign: 'right' },
  addressText: { fontSize: 14, color: '#666', textAlign: 'right' },
  chipsContainer: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8 },
  chip: { padding: 8, borderRadius: 20, backgroundColor: '#eee', marginRight: 8 },
  activeChip: { backgroundColor: COLORS.primary },
  chipText: { textAlign: 'center' },
  activeChipText: { color: '#fff' },
  couponContainer: { flexDirection: 'row-reverse' },
  couponInput: { flex: 1, padding: 12, backgroundColor: '#fafafa', borderRadius: 8, textAlign: 'right' },
  itemRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginVertical: 4 },
  itemName: { fontSize: 16 },
  itemPrice: { fontSize: 16, fontWeight: '600' },
  paymentMethod: { padding: 12, borderRadius: 8, backgroundColor: '#fafafa', marginVertical: 4 },
  selectedPayment: { borderWidth: 2, borderColor: COLORS.primary },
  paymentText: { textAlign: 'right', fontSize: 16 },
  notesInput: { backgroundColor: '#fafafa', borderRadius: 8, padding: 12, minHeight: 80, textAlignVertical: 'top', textAlign: 'right' },
  totalCard: { borderRadius: 12, backgroundColor: COLORS.primary, padding: 16, alignItems: 'center' },
  totalRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', width: '100%', marginBottom: 12 },
  totalLabel: { color: '#fff', fontSize: 18 },
  totalValue: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  confirmButton: { backgroundColor: COLORS.secondary, paddingVertical: 12, paddingHorizontal: 32, borderRadius: 8 },
  confirmButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default InvoiceScreen;
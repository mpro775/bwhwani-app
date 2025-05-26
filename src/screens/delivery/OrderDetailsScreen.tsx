import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import RatingModal from "../../components/RatingModal";

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

type OrderProduct = {
  name: string;
  quantity: number;
  price: number;
};

type OrderData = {
  id: number;
  store: string;
  date: string;
  time: string;
  address: string;
  status: string;
  basket: OrderProduct[];
  total: number;
  deliveryFee: number;
  discount: number;
  paymentMethod: string;
  notes?: string;
};

const OrderDetailsScreen = () => {
  type RouteType = RouteProp<RootStackParamList, "OrderDetailsScreen">;
  const route = useRoute<RouteType>();
  const { order } = route.params;
  const [showRatingModal, setShowRatingModal] = useState(false);
  const handleSubmitRating = (rating: number, comment: string) => {
    // هنا يمكنك إرسال البيانات للخادم أو حفظها محليًا
    console.log("التقييم:", rating, "التعليق:", comment);
    // مثال:
    // axios.post('/api/ratings', { rating, comment });
  };

  const calculateSubtotal = () =>
    order.basket.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* شريط الحالة العلوي */}
      <LinearGradient
        colors={["#D84315", "#8B4B47"]}
        style={styles.statusHeader}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
      >
        <Text style={styles.orderNumber}>الطلب #{order.id}</Text>
        <View style={styles.statusPill}>
          <Ionicons name="timer" size={18} color="#fff" />
          <Text style={styles.statusText}>{order.status}</Text>
        </View>
      </LinearGradient>

      {/* البطاقة الرئيسية */}
      <View style={styles.mainCard}>
        {/* شريط التتبع الزمني */}
        <View style={styles.timelineContainer}>
          {["قيد المراجعة", "قيد التحضير", "في الطريق", "تم التوصيل"].map(
            (stage, index) => (
              <View key={index} style={styles.timelineStep}>
                <View
                  style={[
                    styles.timelineDot,
                    order.status === stage && styles.activeDot,
                    index <=
                      [
                        "قيد المراجعة",
                        "قيد التحضير",
                        "في الطريق",
                        "تم التوصيل",
                      ].indexOf(order.status) && styles.completedDot,
                  ]}
                >
                  {index <=
                    [
                      "قيد المراجعة",
                      "قيد التحضير",
                      "في الطريق",
                      "تم التوصيل",
                    ].indexOf(order.status) && (
                    <Ionicons name="checkmark" size={12} color="#fff" />
                  )}
                </View>
                <Text
                  style={[
                    styles.timelineLabel,
                    order.status === stage && styles.activeLabel,
                  ]}
                >
                  {stage}
                </Text>
                {index < 3 && (
                  <View
                    style={[
                      styles.timelineLine,
                      index <
                        [
                          "قيد المراجعة",
                          "قيد التحضير",
                          "في الطريق",
                          "تم التوصيل",
                        ].indexOf(order.status) && styles.completedLine,
                    ]}
                  />
                )}
              </View>
            )
          )}
        </View>

        {/* معلومات الطلب */}
        <View style={styles.infoSection}>
          <DetailItem icon="storefront" title="المتجر" value={order.store} />
          <DetailItem
            icon="time"
            title="تاريخ الطلب"
            value={`${order.date} - ${order.time}`}
          />
          <DetailItem icon="location" title="العنوان" value={order.address} />
          <DetailItem
            icon="wallet"
            title="طريقة الدفع"
            value={order.paymentMethod}
          />
        </View>

        {/* قائمة المنتجات */}
        <View style={styles.productsSection}>
          <Text style={styles.sectionTitle}>المنتجات المطلوبة</Text>
          {order.basket.map((item, index) => (
            <View key={index} style={styles.productRow}>
              <Text style={styles.productName}>{item.name}</Text>
              <View style={styles.productDetails}>
                <Text style={styles.productQty}>×{item.quantity}</Text>
                <Text style={styles.productPrice}>
                  {item.price.toFixed(1)} ر.س
                </Text>
                <Text style={styles.productTotal}>
                  {(item.price * item.quantity).toFixed(1)} ر.س
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* ملخص الدفع */}
        <View style={styles.paymentSummary}>
          <SummaryRow
            label="الإجمالي الفرعي"
            value={calculateSubtotal().toFixed(1)}
          />
          <SummaryRow
            label="رسوم التوصيل"
            value={order.deliveryFee.toFixed(1)}
          />
          <SummaryRow
            label="الخصم"
            value={`-${order.discount.toFixed(1)}`}
            color={COLORS.primary}
          />
          <View style={styles.divider} />
          <SummaryRow
            label="الإجمالي النهائي"
            value={order.total.toFixed(1)}
            bold
          />
        </View>

        {/* الملاحظات */}
        {order.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>ملاحظات خاصة</Text>
            <Text style={styles.notesText}>{order.notes}</Text>
          </View>
        )}
      </View>

      {/* أزرار الإجراءات */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.secondaryButton}>
          <Ionicons name="refresh" size={20} color={COLORS.primary} />
          <Text style={styles.secondaryButtonText}>تحديث الحالة</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rateButton}
          onPress={() => setShowRatingModal(true)}
        >
          <Text style={styles.rateButtonText}>تقييم الطلب</Text>
        </TouchableOpacity>

        <RatingModal
          visible={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          onSubmit={handleSubmitRating}
        />
      </View>
    </ScrollView>
  );
};

const DetailItem = ({
  icon,
  title,
  value,
}: {
  icon: string;
  title: string;
  value: string;
}) => (
  <View style={styles.detailRow}>
    <Ionicons name="storefront-outline" size={20} color={COLORS.primary} />
    <View style={styles.detailTextContainer}>
      <Text style={styles.detailTitle}>{title}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  </View>
);

const SummaryRow = ({
  label,
  value,
  color,
  bold,
}: {
  label: string;
  value: string;
  color?: string;
  bold?: boolean;
}) => (
  <View style={styles.summaryRow}>
    <Text style={[styles.summaryLabel, bold && styles.boldText]}>{label}</Text>
    <Text
      style={[
        styles.summaryValue,
        { color: color || COLORS.text },
        bold && styles.boldText,
      ]}
    >
      {value} ر.س
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    marginVertical: 30,
  },
  statusHeader: {
    padding: 24,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    elevation: 6,
  },
  orderNumber: {
    fontFamily: "Cairo-Bold",
    fontSize: 20,
    color: "#fff",
  },
  statusPill: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  statusText: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 16,
    color: "#fff",
  },
  mainCard: {
    backgroundColor: "#fff",
    borderRadius: 32,
    margin: 16,
    padding: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  rateButton: {
    backgroundColor: "#D84315",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    margin: 20,
  },
  rateButtonText: {
    color: "#FFF",
    fontFamily: "Cairo-Bold",
    fontSize: 18,
  },
  timelineContainer: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  timelineStep: {
    alignItems: "center",
    position: "relative",
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
  },
  completedDot: {
    backgroundColor: COLORS.primary,
  },
  timelineLabel: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 12,
    color: "#888",
  },
  activeLabel: {
    color: COLORS.primary,
  },
  timelineLine: {
    position: "absolute",
    height: 2,
    backgroundColor: "#eee",
    top: 11,
    right: -24,
    left: -24,
    zIndex: -1,
  },
  completedLine: {
    backgroundColor: COLORS.primary,
  },
  infoSection: {
    gap: 16,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailTitle: {
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    color: "#666",
  },
  detailValue: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 16,
    color: COLORS.text,
  },
  productsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: "Cairo-Bold",
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 16,
    textAlign: "right",
  },
  productRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#f5f5f5",
  },
  productName: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
  },
  productDetails: {
    flexDirection: "row-reverse",
    gap: 16,
    alignItems: "center",
  },
  productQty: {
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    color: "#666",
  },
  productPrice: {
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    color: "#666",
  },
  productTotal: {
    fontFamily: "Cairo-Bold",
    fontSize: 16,
    color: COLORS.primary,
  },
  paymentSummary: {
    gap: 12,
  },
  summaryRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  },
  summaryLabel: {
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 14,
  },
  boldText: {
    fontFamily: "Cairo-Bold",
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },
  notesSection: {
    marginTop: 16,
  },
  notesText: {
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    color: "#666",
    lineHeight: 24,
    textAlign: "right",
  },
  actionButtons: {
    flexDirection: "row-reverse",
    gap: 16,
    padding: 16,
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row-reverse",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 16,
    elevation: 3,
  },
  primaryButtonText: {
    fontFamily: "Cairo-Bold",
    fontSize: 16,
    color: "#fff",
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row-reverse",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 16,
    borderRadius: 16,
  },
  secondaryButtonText: {
    fontFamily: "Cairo-Bold",
    fontSize: 16,
    color: COLORS.primary,
  },
});

export default OrderDetailsScreen;

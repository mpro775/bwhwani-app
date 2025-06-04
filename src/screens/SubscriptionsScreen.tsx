import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "utils/api/axiosInstance";

const COLORS = {
  primary: "#D84315",
  background: "#FFFFFF",
  border: "#E0E0E0",
  text: "#333",
  success: "#4CAF50",
  error: "#F44336",
};

const plans = [
  {
    id: "basic",
    title: "الباقة الأساسية",
    price: 1500,
    perks: ["خصم 5%", "بدون توصيل مجاني", "نقاط عادية", "دعم عادي"],
  },
  {
    id: "premium",
    title: "الباقة المميزة",
    price: 3000,
    perks: ["خصم 10%", "توصيل مجاني لأول طلب", "نقاط مضاعفة", "دعم أولوية"],
  },
  {
    id: "gold",
    title: "الباقة الذهبية",
    price: 5000,
    perks: [
      "خصم 15%",
      "توصيل مجاني لطلبين شهريًا",
      "نقاط مضاعفة + هدايا",
      "دعم VIP",
    ],
  },
];

const SubscriptionsScreen = () => {
  const [loading, setLoading] = useState(false);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);

  const subscribeToPlan = async (planId: string) => {
    try {
      setLoading(true);
      const res = await axios.post("/subscriptions", { planId });
      setActivePlanId(planId);
      Alert.alert("تم الاشتراك بنجاح ✅", "شكراً لاختيارك هذه الباقة!");
    } catch (err: any) {
      Alert.alert("خطأ", err.response?.data?.message || "فشل الاشتراك");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // استعلام الباقة الحالية للمستخدم
    axios
      .get("/subscriptions/my")
      .then((res) => setActivePlanId(res.data?.planId))
      .catch(() => {});
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🧾 اختر الباقة المناسبة لك</Text>
      {plans.map((plan) => (
        <View key={plan.id} style={styles.card}>
          <Text style={styles.title}>{plan.title}</Text>
          <Text style={styles.price}>{plan.price.toLocaleString()} ﷼/شهر</Text>
          {plan.perks.map((perk, idx) => (
            <Text key={idx} style={styles.perk}>
              • {perk}
            </Text>
          ))}
          <TouchableOpacity
            style={[
              styles.button,
              activePlanId === plan.id && { backgroundColor: COLORS.success },
            ]}
            onPress={() => subscribeToPlan(plan.id)}
            disabled={loading}
          >
            {loading && activePlanId !== plan.id ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {activePlanId === plan.id ? "الباقة الحالية" : "اشترك الآن"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

export default SubscriptionsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: COLORS.background,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "right",
    marginBottom: 20,
  },
  card: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 10,
  },
  perk: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
  },
  button: {
    marginTop: 12,
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

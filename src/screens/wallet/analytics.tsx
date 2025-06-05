// screens/wallet/AnalyticsScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import axiosInstance from "utils/api/axiosInstance";
import COLORS from "constants/colors";

export default function AnalyticsScreen() {
  const [data, setData] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const screenWidth = Dimensions.get("window").width - 32; // طرح الحاشية (16+16)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/wallet/analytics/monthly");
        setData(res.data.monthly || []);
      } catch {
        setError("فشل في جلب البيانات");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const labels = [
    "ينا",
    "فبر",
    "مار",
    "أبر",
    "ماي",
    "يون",
    "يول",
    "أغس",
    "سبت",
    "أكت",
    "نوف",
    "ديس",
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>تحليلات المشتريات الشهرية</Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ marginTop: 40 }}
        />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16 }}
        >
          <LineChart
            data={{
              labels,
              datasets: [{ data }],
            }}
            width={screenWidth}
            height={240}
            yAxisSuffix=" ر.ي"
            chartConfig={{
              backgroundColor: COLORS.background,
              backgroundGradientFrom: COLORS.background,
              backgroundGradientTo: COLORS.background,
              decimalPlaces: 0,
              color: () => COLORS.primary,
              labelColor: () => COLORS.text,
              style: { borderRadius: 12 },
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: COLORS.primary,
              },
            }}
            style={styles.chartStyle}
          />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F0", // نفس خلفية باقي شاشات المحفظة
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: "Cairo-Regular",
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 16,
    textAlign: "center",
  },
  chartStyle: {
    borderRadius: 12,
  },
  errorText: {
    marginTop: 20,
    textAlign: "center",
    color: "#B71C1C",
    fontSize: 16,
    fontFamily: "Cairo-Regular",
  },
});

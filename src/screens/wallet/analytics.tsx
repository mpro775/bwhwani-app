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

const AnalyticsScreen = () => {
  const [data, setData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const screenWidth = Dimensions.get("window").width - 32; // نخصم حاشية الأعضاء

  useEffect(() => {
    const fetchData = async () => {
      try {
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

  const labels = ["ينا", "فبر", "مار", "أبر", "ماي", "يون", "يول", "أغس", "سبت", "أكت", "نوف", "ديس"];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>تحليلات المشتريات الشهرية</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#D84315" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <LineChart
            data={{
              labels,
              datasets: [{ data }],
            }}
            width={screenWidth}
            height={220}
            yAxisSuffix=" ر.ي"
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 0,
              color: () => "#D84315",
              labelColor: () => "#3E2723",
              style: { borderRadius: 12 },
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: "#D84315",
              },
            }}
            style={styles.chartStyle}
          />
        </ScrollView>
      )}
    </View>
  );
};

export default AnalyticsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F0",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3E2723",
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
  },
});

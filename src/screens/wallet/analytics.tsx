import { useEffect, useState } from "react";
import { LineChart } from "react-native-chart-kit";
import axiosInstance from "utils/api/axiosInstance";
import { Dimensions } from "react-native";

const [data, setData] = useState([]);
const screenWidth = Dimensions.get("window").width;

useEffect(() => {
  axiosInstance.get("/wallet/analytics/monthly").then(res => setData(res.data.monthly));
}, []);

<LineChart
  data={{
    labels: ["ينا", "فبر", "مار", "أبر", "ماي", "يون", "يول", "أغس", "سبت", "أكت", "نوف", "ديس"],
    datasets: [{ data }]
  }}
  width={screenWidth}
  height={220}
  yAxisSuffix=" ر.ي"
  chartConfig={{ backgroundColor: "#fff", color: () => "#000" }}
/>

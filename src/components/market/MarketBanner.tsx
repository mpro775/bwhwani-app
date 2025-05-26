import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, I18nManager } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const getTimeRemaining = (endTime: Date) => {
  const total = endTime.getTime() - new Date().getTime();
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  return { total, hours, minutes, seconds };
};

const TimeBox = ({ label, value }: { label: string; value: number }) => (
  <View style={styles.box}>
    <Text style={styles.timeValue}>{value.toString().padStart(2, "0")}</Text>
    <Text style={styles.timeLabel}>{label}</Text>
  </View>
);

const MarketBanner = () => {
  const endTime = new Date();
  endTime.setHours(endTime.getHours() + 3);

  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(endTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(endTime));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <LinearGradient
      colors={["#D84315", "#D84315"]}
      style={styles.banner}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <Text style={styles.title}>⚡ عرض خاص لفترة محدودة!</Text>
      <View style={styles.timer}>
        <TimeBox label="ساعات" value={timeLeft.hours} />
        <TimeBox label="دقائق" value={timeLeft.minutes} />
        <TimeBox label="ثواني" value={timeLeft.seconds} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    direction: "rtl",
    backgroundColor: "D84315",
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Cairo-Bold",
    marginBottom: 12,
    textAlign: "center",
    writingDirection: "rtl",
  },
  timer: {
    flexDirection: "row-reverse",
    justifyContent: "center",
    gap: 8,
  },
  box: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: "center",
    minWidth: 60,
  },
  timeValue: {
    fontSize: 20,
    fontFamily: "Cairo-Bold",
    color: "#D84315",
  },
  timeLabel: {
    fontSize: 13,
    fontFamily: "Cairo-Regular",
    color: "#5D4037",
    marginTop: 4,
    writingDirection: "rtl",
  },
});

export default MarketBanner;

// screens/TransportScreen.tsx
import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TransportScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Ionicons
          name="construct-outline"
          size={80}
          color="#D84315"
          style={styles.icon}
        />
        <Text style={styles.title}>قيد التطوير</Text>
        <Text style={styles.message}>نعمل على تجهيز هذه الخدمة</Text>
        <Text style={styles.details}>
          سنكون متاحين قريباً بفضل الله
          {"\n"}
          شكراً لتفهمكم
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  icon: {
    marginBottom: 24,
    opacity: 0.8,
  },
  title: {
    fontFamily: "Cairo-Bold",
    fontSize: 32,
    color: "#2C3E50",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 20,
    color: "#D84315",
    marginBottom: 16,
    textAlign: "center",
  },
  details: {
    fontFamily: "Cairo-Regular",
    fontSize: 16,
    color: "#7F8C8D",
    textAlign: "center",
    lineHeight: 24,
  },
});

export default TransportScreen;

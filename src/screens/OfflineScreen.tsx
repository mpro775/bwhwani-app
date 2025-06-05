// src/screens/OfflineScreen.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function OfflineScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>عذراً</Text>
      <Text style={styles.message}>يرجى توصيل الإنترنت لإتمام عمل التطبيق.</Text>
      {/* زر لإعادة المحاولة بعد توصيل الإنترنت */}
      <TouchableOpacity onPress={onRetry} style={styles.button}>
        <Text style={styles.buttonText}>إعادة المحاولة</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#8B4B47",
  },
  message: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 24,
    color: "#555",
  },
  button: {
    backgroundColor: "#8B4B47",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

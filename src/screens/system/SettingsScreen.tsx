import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SettingsScreen = () => {
  const handleLogout = () => {
    Alert.alert("تم تسجيل الخروج");
    // هنا تنفذ عملية تسجيل الخروج لاحقاً
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>الإعدادات</Text>

      <TouchableOpacity style={styles.item}>
        <Text style={styles.itemText}>تعديل الحساب</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item}>
        <Text style={styles.itemText}>تغيير اللغة</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item}>
        <Text style={styles.itemText}>الدعم الفني</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>تسجيل الخروج</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3E2723",
    marginBottom: 24,
  },
  item: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  itemText: {
    fontSize: 16,
    color: "#5D4037",
  },
  logoutButton: {
    marginTop: 32,
    paddingVertical: 16,
    backgroundColor: "#E53935",
    borderRadius: 8,
  },
  logoutText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default SettingsScreen;

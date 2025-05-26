import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { sendPasswordReset } from "api/authService";

const COLORS = {
  primary: "#D84315",
  background: "#FFFFFF",
  text: "#4E342E",
  border: "#DDD",
};

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
  await sendPasswordReset(email);
};

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.card}>
        <Text style={styles.title}>استعادة كلمة المرور</Text>
        <Text style={styles.subtitle}>
          أدخل بريدك الإلكتروني لإرسال رابط إعادة تعيين كلمة المرور.
        </Text>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#999" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="البريد الإلكتروني"
            placeholderTextColor="#999"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.5 }]}
          onPress={handleForgotPassword}
          disabled={loading}
        >
          <Text style={styles.buttonText}>إرسال</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#777",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 10,
    height: 45,
  },
  icon: {
    marginHorizontal: 6,
  },
  input: {
    flex: 1,
    textAlign: "right",
    color: COLORS.text,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

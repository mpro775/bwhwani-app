import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useGoogleLogin } from "../../utils/api/googleAuth";
import { loginWithEmail, registerWithEmail } from "api/authService";

type AuthStackParamList = {
  Login: undefined;
  MainApp: undefined;
  Register: undefined;
};

const COLORS = {
  primary: "#D84315",
  secondary: "#5D4037",
  background: "#FFFFFF",
  accent: "#8B4B47",
  text: "#4E342E",
};

const API_URL = "http://192.168.1.105:3000";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { promptAsync } = useGoogleLogin();

  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const showErrorAlert = useCallback(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        delay: 2000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim]);

  const validateForm = useCallback(() => {
    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage("يرجى تعبئة جميع الحقول");
      showErrorAlert();
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("البريد الإلكتروني غير صالح");
      showErrorAlert();
      return false;
    }
    if (password.length < 6) {
      setErrorMessage("كلمة المرور يجب أن تكون على الأقل 6 أحرف");
      showErrorAlert();
      return false;
    }
    if (password !== confirmPassword) {
      setErrorMessage("كلمتا المرور غير متطابقتين");
      showErrorAlert();
      return false;
    }
    return true;
  }, [name, email, password, confirmPassword, showErrorAlert]);

  const handleRegister = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      const result = await registerWithEmail(email, password);
      await AsyncStorage.setItem("firebase-token", result.idToken);

      await axios.post(
        `${API_URL}/users/init`,
        { email: result.email, fullName: name, phone },
        { headers: { Authorization: `Bearer ${result.idToken}` } }
      );

      Alert.alert("🎉 مرحبًا!", `أهلًا بك يا ${name} في بثواني 💙`);
      navigation.replace("MainApp");
    } catch (error: any) {
      const message = error?.response?.data?.error?.message;

      if (message === "EMAIL_EXISTS") {
        try {
          const loginResult = await loginWithEmail(email, password);
          await AsyncStorage.setItem("firebase-token", loginResult.idToken);

          await axios.post(
            `${API_URL}/users/init`,
            { email: loginResult.email, fullName: name, phone },
            { headers: { Authorization: `Bearer ${loginResult.idToken}` } }
          );

          Alert.alert("🎉 أهلاً من جديد!", `تم تسجيل الدخول تلقائيًا كـ ${name}`);
          navigation.replace("MainApp");
        } catch (loginError: any) {
          Alert.alert("تنبيه", "البريد موجود ولكن كلمة المرور غير صحيحة.");
        }
      } else {
        Alert.alert("خطأ", "حدث خطأ أثناء التسجيل");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={[styles.errorBox, { opacity: fadeAnim }]}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </Animated.View>

        <View>
          {[
            {
              icon: "person-outline",
              value: name,
              setValue: setName,
              placeholder: "الاسم الكامل",
              key: "name",
keyboardType: "default" as const,
            },
            {
              icon: "mail-outline",
              value: email,
              setValue: setEmail,
              placeholder: "البريد الإلكتروني",
              key: "email",
                keyboardType: "email-address" as const,
            },
            {
              icon: "call-outline",
              value: phone,
              setValue: setPhone,
              placeholder: "رقم الهاتف",
              key: "phone",
              keyboardType: "phone-pad" as const,
            },
            {
              icon: "lock-closed-outline",
              value: password,
              setValue: setPassword,
              placeholder: "كلمة المرور",
              key: "password",
              keyboardType: "default" as const,
              secure: true,
            },
            {
              icon: "lock-closed-outline",
              value: confirmPassword,
              setValue: setConfirmPassword,
              placeholder: "تأكيد كلمة المرور",
              key: "confirm",
keyboardType: "default" as const,
              secure: true,
            },
          ].map((field) => (
            <View style={styles.inputContainer} key={field.key}>
              <Ionicons
                name={field.icon as any}
                size={20}
                color={focusedInput === field.key ? COLORS.primary : "#999"}
                style={styles.inputIcon}
              />
              <TextInput
                placeholder={field.placeholder}
                placeholderTextColor="#999"
                style={[
                  styles.input,
                  focusedInput === field.key && styles.inputFocused,
                ]}
                value={field.value}
                onChangeText={field.setValue}
                keyboardType={field.keyboardType}
                secureTextEntry={field.secure}
                onFocus={() => setFocusedInput(field.key)}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          ))}

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.6 }]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "جارٍ التسجيل..." : "إنشاء الحساب"}
            </Text>
          </TouchableOpacity>
{/* أضف هذا بعده مباشرة */}
<View style={{ marginTop: 16 }}>
  <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
    <Ionicons name="logo-google" size={20} color="#DB4437" />
    <Text style={styles.googleButtonText}>الاشتراك باستخدام Google</Text>
  </TouchableOpacity>
</View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>هل لديك حساب؟ </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.footerLink}>تسجيل الدخول</Text>
            </TouchableOpacity>
          </View>
        </View>
        
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 30,
     justifyContent: "center", 
  },
googleButton: {
  flexDirection: "row-reverse",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#FFF",
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "#DDD",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 2,
},

googleButtonText: {
  fontFamily: "Cairo-SemiBold",
  color: "#444",
  fontSize: 14,
},
  inputContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEE",
    marginBottom: 12,
    height: 48,
    backgroundColor: "#FFF",
  },
  inputIcon: { marginHorizontal: 16 },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Cairo-Regular",
    textAlign: "right",
    color: COLORS.text,
  },
  inputFocused: {
    backgroundColor: "#fdfdfd",
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  buttonText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Cairo-Bold",
  },
  footer: {
    flexDirection: "row-reverse",
    justifyContent: "center",
    marginTop: 16,
  },
  footerText: {
    fontFamily: "Cairo-Regular",
    color: "#666",
  },
  footerLink: {
    fontFamily: "Cairo-SemiBold",
    color: COLORS.secondary,
    textDecorationLine: "underline",
  },
  errorBox: {
    backgroundColor: "#FFEBEE",
    padding: 12,
    borderRadius: 12,
    marginVertical: 12,
    marginHorizontal: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#D32F2F",
  },
  errorText: {
    fontFamily: "Cairo-SemiBold",
    color: "#D32F2F",
    textAlign: "center",
  },
});

export default RegisterScreen;

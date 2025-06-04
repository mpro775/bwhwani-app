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
import {
  loginWithEmail,
  registerWithEmail,
  storeFirebaseTokens,
} from "api/authService";
import { API_URL } from "utils/api/config";

type AuthStackParamList = {
  Login: undefined;
  MainApp: undefined;
  Register: undefined;
  OTPVerification: { email: string ,userId:string};
};

const COLORS = {
  primary: "#D84315",
  secondary: "#5D4037",
  background: "#FFFFFF",
  accent: "#8B4B47",
  text: "#4E342E",
};


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
    if (!email || !password || !name || !phone) {
      Alert.alert("خطأ", "يرجى تعبئة جميع الحقول");
      return;
    }

    try {
      // 1. تسجّل حساب Firebase
      const result = await registerWithEmail(email, password);

      // 2. خزّن التوكنات في AsyncStorage
      await storeFirebaseTokens(
        result.idToken,
        result.refreshToken,
        parseInt(result.expiresIn, 10)
      );

      // 3. أرسل طلب إنشاء الملف الشخصي
      await axios.post(
        `${API_URL}/users/init`,
        { fullName: name, email, phone },
        { headers: { Authorization: `Bearer ${result.idToken}` } }
      );
      await axios.post(
        `${API_URL}/users/otp/send`,
        { email }, // فقط البريد لأن الـ userId لم يُسجل بعد في DB
        { headers: { Authorization: `Bearer ${result.idToken}` } }
      );
const userRes = await axios.get(`${API_URL}/users/me`, {
  headers: { Authorization: `Bearer ${result.idToken}` },
});
const user = userRes.data;

navigation.navigate("OTPVerification", { email, userId: user._id.toString() });
    } catch (err: any) {
      const msg =
        err.response?.data?.error?.message || err.response?.data?.message;

      if (msg === "EMAIL_EXISTS") {
        try {
          // تسجيل دخول تلقائي مؤقت
          const loginData = await loginWithEmail(email, password);

          // فحص حالة البريد
          const userRes = await axios.get(`${API_URL}/users/me`, {
            headers: { Authorization: `Bearer ${loginData.idToken}` },
          });

          const user = userRes.data;

          if (!user.emailVerified) {
            // إعادة إرسال OTP
            await axios.post(
              `${API_URL}/users/otp/send`,
              { email },
              { headers: { Authorization: `Bearer ${loginData.idToken}` } }
            );

            Alert.alert("تأكيد البريد", "يرجى تأكيد بريدك الإلكتروني أولًا.");
navigation.navigate("OTPVerification", { email, userId: user._id.toString() });
            return;
          }

          // المستخدم مفعل ✅
          await storeFirebaseTokens(
            loginData.idToken,
            loginData.refreshToken,
            parseInt(loginData.expiresIn, 10)
          );

          await axios.post(
            `${API_URL}/users/init`,
            { fullName: name, email, phone },
            { headers: { Authorization: `Bearer ${loginData.idToken}` } }
          );

          Alert.alert("مرحبًا مجددًا", `تم تسجيل دخولك تلقائيًا يا ${name}`);
          navigation.replace("MainApp");
        } catch (loginErr: any) {
          Alert.alert("خطأ", "كلمة المرور غير صحيحة أو فشل تسجيل الدخول.");
        }
      }
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
            <TouchableOpacity
              style={styles.googleButton}
              onPress={() => promptAsync()}
            >
              <Ionicons name="logo-google" size={20} color="#DB4437" />
              <Text style={styles.googleButtonText}>
                الاشتراك باستخدام Google
              </Text>
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

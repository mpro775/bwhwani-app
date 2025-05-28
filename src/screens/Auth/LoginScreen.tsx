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
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGoogleLogin } from "../../utils/api/googleAuth";
import { loginWithEmail } from "../../api/authService";
import { useCart } from "context/CartContext";

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  MainApp: undefined;
  ForgotPassword: undefined;
};

const COLORS = {
  primary: "#D84315",
  secondary: "#5D4037",
  background: "#FFFFFF",
  accent: "#8B4B47",
  text: "#4E342E",
};

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { promptAsync } = useGoogleLogin();
    const { mergeGuestCart } = useCart();

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
        delay: 2500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim]);

  const validateForm = useCallback(() => {
    if (!email || !password) {
      setErrorMessage("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      showErrorAlert();
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("صيغة البريد الإلكتروني غير صحيحة");
      showErrorAlert();
      return false;
    }

    return true;
  }, [email, password, showErrorAlert]);
const handleLogin = async () => {
  if (!validateForm()) return;
  setLoading(true);

  try {
    // 1) نرسل بيانات تسجيل الدخول
    const result = await loginWithEmail(email, password);
    // 2) نستخرج الحقول الصحيحة
    const token        = result.idToken;
    const refreshToken = result.refreshToken;
    // expiresIn هو نصّ بالثواني مثلاً "3600"
    const expiresInMs  = parseInt(result.expiresIn, 10) * 1000;
    const expiryTime   = Date.now() + expiresInMs;

    // 3) خزّن التوكنات ووقت الانتهاء
    await AsyncStorage.multiSet([
      ["firebase-idToken",      token],
      ["firebase-refreshToken", refreshToken],
      ["firebase-expiryTime",   expiryTime.toString()],
    ]);

    const userId = result.localId;
    if (!token || !userId) {
      setErrorMessage("لم يتم استلام البيانات بشكل صحيح");
      showErrorAlert();
      return;
    }

    // 4) يمكنك أيضاً حفظ idToken/oauth token العام للتطبيق:
    await AsyncStorage.setItem("firebase-idToken", token);
    await AsyncStorage.setItem("userId", userId);

    // 5) ادمج سلة الضيف مع حساب المستخدم
    await mergeGuestCart(userId);

    Alert.alert("🎉 مرحبًا بك من جديد!", `تم تسجيل الدخول بنجاح.`);
    navigation.replace("MainApp");
  } catch (error: any) {
    // إدارة أخطاء Firebase
    const firebaseError = error?.response?.data?.error?.message;
    const msg =
      firebaseError === "EMAIL_NOT_FOUND"
        ? "البريد الإلكتروني غير مسجل"
        : firebaseError === "INVALID_PASSWORD"
        ? "كلمة المرور غير صحيحة"
        : "حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.";
    setErrorMessage(msg);
    showErrorAlert();
  } finally {
    setLoading(false);
  }
};


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={[styles.errorBox, { opacity: fadeAnim }]}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </Animated.View>

        <View style={styles.card}>
          {[
            {
              icon: "mail-outline",
              value: email,
              setValue: setEmail,
              placeholder: "البريد الإلكتروني",
              key: "email",
              keyboardType: "email-address" as const,
            },
            {
              icon: "lock-closed-outline",
              value: password,
              setValue: setPassword,
              placeholder: "كلمة المرور",
              key: "password",
              secure: true,
              keyboardType: "default" as const,
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
            style={styles.forgotPassword}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.forgotPasswordText}>نسيت كلمة المرور؟</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.6 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
            </Text>
          </TouchableOpacity>

          {/* Google Login */}
          <View style={{ marginTop: 16 }}>
            <TouchableOpacity
              style={styles.googleButton}
              onPress={() => promptAsync()}
            >
              <Ionicons
                name="logo-google"
                size={20}
                color="#DB4437"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.googleButtonText}>
                الدخول باستخدام Google
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>ليس لديك حساب؟ </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.footerLink}>إنشاء حساب جديد</Text>
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
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 30,
  },
  card: { width: "100%", paddingTop: 32 },
  inputContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    height: 48,
    borderColor: "#EEE",
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
    marginTop: 12,
  },
  buttonText: {
    fontFamily: "Cairo-Bold",
    fontSize: 14,
    color: "#FFF",
    textAlign: "center",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 8,
  },
  forgotPasswordText: {
    fontFamily: "Cairo-SemiBold",
    color: COLORS.secondary,
    fontSize: 12,
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
});

export default LoginScreen;

// useGoogleLogin.ts
import { useEffect } from "react";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

WebBrowser.maybeCompleteAuthSession();

type AuthStackParamList = {
  Login: undefined;
  MainApp: undefined;
  Register: undefined;
};

const API_URL = "http://192.168.1.100:3000"; // 🔧 غيّره عند الإنتاج
const FIREBASE_API_KEY = "AIzaSyCFdBl4qtA6OwpdNsDX24V_9phbjAiMQWU";

export const useGoogleLogin = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "238306579115-vgnhtsf2iapvut4077s6us9r8aciu43s.apps.googleusercontent.com",
    selectAccount: true,
  });

  useEffect(() => {
    if (response?.type === "success" && response.authentication?.idToken) {
      const idToken = response.authentication.idToken;
      handleGoogleLogin(idToken);
    }
  }, [response]);

  const handleGoogleLogin = async (googleIdToken: string) => {
    try {
      // 🔐 تسجيل الدخول إلى Firebase باستخدام Google ID Token
      const res = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=${FIREBASE_API_KEY}`,
        {
          postBody: `id_token=${googleIdToken}&providerId=google.com`,
          requestUri: "http://localhost", // مطلوبة حتى لو وهمية
          returnIdpCredential: true,
          returnSecureToken: true,
        }
      );

      const { idToken, email, displayName, localId } = res.data;

      // إرسال البيانات إلى الباك إند
      await axios.post(`${API_URL}/users/init`, {
        fullName: displayName,
        email,
        phone: "", // Google API doesn't return phone by default
      }, {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      // تخزين التوكن
      await AsyncStorage.setItem("firebase-token", idToken);

      navigation.navigate("MainApp");
    } catch (err) {
      console.error("Google login error:", err);
    }
  };

  return { request, promptAsync };
};

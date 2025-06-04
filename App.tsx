import "react-native-gesture-handler";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import React, { useEffect, useState } from "react";
import { Alert, I18nManager } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import AppNavigation from "./src/navigation";
import { CartProvider } from "./src/context/CartContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OnboardingScreen from "screens/OnboardingScreen";
import Toast from "react-native-toast-message";
import { toastConfig } from "utils/toastConfig";
import { ThemeProvider } from "./src/context/ThemeContext";
import { queueOfflineRequest, retryQueuedRequests } from "utils/offlineQueue";
import { isConnected } from "utils/network";
import axiosInstance from "utils/api/axiosInstance";
import TestLottie from "screens/TestLottie";
import { CartProviderShein } from "context/CartContextShein";

// ✅ إبقاء Splash ظاهرة لحين تهيئة التطبيق
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    const prepareApp = async () => {
      try {
        // ✅ تحميل الخطوط
        await Font.loadAsync({
          "Cairo-Regular": require("./assets/fonts/cairo_regular.ttf"),
          "Cairo-Bold": require("./assets/fonts/cairo_bold.ttf"),
          "Cairo-SemiBold": require("./assets/fonts/cairo_semibold.ttf"),
        });

        // ✅ تفعيل RTL إن لم يكن مفعل
        if (!I18nManager.isRTL) {
          I18nManager.allowRTL(true);
          I18nManager.forceRTL(true);
          // ملاحظة: في بعض الحالات تحتاج لإعادة التشغيل هنا
        }

        const seen = await AsyncStorage.getItem("hasSeenOnboarding");
        setHasSeenOnboarding(seen === "true");

        await SplashScreen.hideAsync();
        setAppIsReady(true);
      } catch (e) {
        console.warn("❌ Error initializing app:", e);
      } finally {
        // ✅ إخفاء Splash بمجرد انتهاء التهيئة
        await SplashScreen.hideAsync();
        setAppIsReady(true);
      }
    };

    prepareApp();
  }, []);
  useEffect(() => {
    retryQueuedRequests();
  }, []);

  if (!appIsReady || hasSeenOnboarding === null) return null;

  return (
    <ThemeProvider>
      <CartProviderShein>
      <CartProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <StatusBar style="auto" />
            <AppNavigation hasSeenOnboarding={hasSeenOnboarding} />
            <Toast config={toastConfig} />
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </CartProvider>
      </CartProviderShein>
    </ThemeProvider>
  );
}

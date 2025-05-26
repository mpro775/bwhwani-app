import 'react-native-gesture-handler';
import 'react-native-reanimated'; // مهم جدًا
import { GestureHandlerRootView } from "react-native-gesture-handler";

import React, { useEffect, useState } from "react";
import { I18nManager } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import AppNavigation from "./src/navigation";
import { CartProvider, useCart } from "./src/context/CartContext";


// منع الإخفاء التلقائي للسبيلاش
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isReady, setIsReady] = useState(false);



  useEffect(() => {
    const prepare = async () => {
      try {
        await Font.loadAsync({
          "Cairo-Regular": require("./assets/fonts/cairo_regular.ttf"),
          "Cairo-Bold": require("./assets/fonts/cairo_bold.ttf"),
          "Cairo-SemiBold": require("./assets/fonts/cairo_semibold.ttf"),
        });

        if (!I18nManager.isRTL) {
          I18nManager.allowRTL(true);
          I18nManager.forceRTL(true);
        }

        // ⏳ إخفاء Splash بعد مهلة صغيرة فقط للعرض
        setTimeout(async () => {
          await SplashScreen.hideAsync();
          setIsReady(true);
        }, 2000); // 2 ثانية فقط
      } catch (error) {
        console.warn("⚠️ Initialization Error:", error);
        setIsReady(true);
      }
    };

    prepare();
  }, []);

  if (!isReady) return null;

  return (
    <CartProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          
          <StatusBar style="dark" />
          <AppNavigation />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </CartProvider>
  );
}

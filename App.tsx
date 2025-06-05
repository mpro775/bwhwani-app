import "react-native-gesture-handler";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  I18nManager,
  StyleSheet,
  View,
  StatusBar,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
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
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import { CartProviderShein } from "context/CartContextShein";
import OfflineScreen from "screens/OfflineScreen";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);

  const handleRetry = useCallback(() => {
    setChecking(true);
    NetInfo.fetch().then((state: NetInfoState) => {
      setIsConnected(state.isConnected);
      setChecking(false);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsConnected(state.isConnected);
    });

    NetInfo.fetch().then((state: NetInfoState) => {
      setIsConnected(state.isConnected);
      setChecking(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const prepareApp = async () => {
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

        const seen = await AsyncStorage.getItem("hasSeenOnboarding");
        setHasSeenOnboarding(seen === "true");

        await SplashScreen.hideAsync();
        setAppIsReady(true);
      } catch (e) {
        console.warn("❌ Error initializing app:", e);
      } finally {
        await SplashScreen.hideAsync();
        setAppIsReady(true);
      }
    };

    prepareApp();
  }, []);

  useEffect(() => {
    retryQueuedRequests();
  }, []);

  return (
    <ThemeProvider>
      <CartProviderShein>
        <CartProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
              <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
                <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
                {!appIsReady || hasSeenOnboarding === null ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#8B4B47" />
                  </View>
                ) : checking || isConnected === null ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#8B4B47" />
                  </View>
                ) : !isConnected ? (
                  <OfflineScreen onRetry={handleRetry} />
                ) : (
                  <>
                    <AppNavigation hasSeenOnboarding={hasSeenOnboarding} />
                    <Toast config={toastConfig} />
                  </>
                )}
              </SafeAreaView>
            </SafeAreaProvider>
          </GestureHandlerRootView>
        </CartProvider>
      </CartProviderShein>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

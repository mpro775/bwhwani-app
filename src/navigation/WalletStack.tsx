// navigation/WalletStack.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import WalletTopTabs from "./WalletTopTabs";
import TopupScreen from "screens/wallet/Topup/TopupScreen";
import TransactionDetailsScreen from "screens/wallet/TransactionDetailsScreen";
// حذفنا استيراد AnalyticsScreen لأنَّه داخل WalletTopTabs بالفعل

export type WalletStackParamList = {
  WalletHome: undefined;
  Topup: undefined;
  TransactionDetails: { transaction: any };
  Analytics: undefined; // إذا أردت فتح التحليلات بشكل مستقل
};

const Stack = createStackNavigator<WalletStackParamList>();

const WalletStack = () => (
  <Stack.Navigator initialRouteName="WalletHome">
    {/* نُمرِّر المكوّن نفسه، وليس استدعاءً له */}
    <Stack.Screen
      name="WalletHome"
      component={WalletTopTabs}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Topup"
      component={TopupScreen}
      options={{ title: "شحن المحفظة" }}
    />
    <Stack.Screen
      name="TransactionDetails"
      component={TransactionDetailsScreen}
      options={{ title: "تفاصيل المعاملة" }}
    />
    {/* إذا أردت فتح التحليلات مستقلَّةً خارج التبويبات العلوية */}
    <Stack.Screen
      name="Analytics"
      component={WalletTopTabs} // يُعيد نفس التبويب الذي يحتوي شاشة التحليلات
      options={{ headerShown: false, title: "تحليلات المحفظة" }}
    />
  </Stack.Navigator>
);

export default WalletStack;

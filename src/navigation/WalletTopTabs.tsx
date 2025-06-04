// navigation/WalletTabNavigation.tsx
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { Text } from "react-native";

import WalletScreen from "../screens/wallet/WalletScreen";
import WithdrawScreen from "../screens/wallet/WithdrawScreen";
import LoyaltyScreen from "../screens/wallet/LoyaltyScreen";
import CouponListScreen from "../screens/wallet/CouponListScreen";
import AnalyticsScreen from "../screens/wallet/analytics";

const Tab = createMaterialTopTabNavigator();

const WalletTabNavigation = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      screenOptions={{
        swipeEnabled: true,
        tabBarShowIcon: true,
        tabBarActiveTintColor: "#D84315",
        tabBarInactiveTintColor: "#B0BEC5",
        tabBarIndicatorStyle: { backgroundColor: "#3E2723" },
        tabBarStyle: {
          backgroundColor: "#fff",
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          borderTopWidth: 1,
          borderTopColor: "#eee",
        },
        tabBarLabelStyle: {
          fontFamily: "Cairo-SemiBold",
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen
        name="WalletHome"
        component={WalletScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontFamily: "Cairo-SemiBold", fontSize: 12 }}>
              الرصيد
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <Ionicons name="wallet-outline" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Withdraw"
        component={WithdrawScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontFamily: "Cairo-SemiBold", fontSize: 12 }}>
              السحب
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="account-balance-wallet" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Loyalty"
        component={LoyaltyScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontFamily: "Cairo-SemiBold", fontSize: 12 }}>
              النقاط
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <FontAwesome name="star" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Coupons"
        component={CouponListScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontFamily: "Cairo-SemiBold", fontSize: 12 }}>
              الكوبونات
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <Ionicons name="pricetags-outline" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontFamily: "Cairo-SemiBold", fontSize: 12 }}>
              تحليلات
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <Ionicons name="pie-chart-outline" size={20} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default WalletTabNavigation;

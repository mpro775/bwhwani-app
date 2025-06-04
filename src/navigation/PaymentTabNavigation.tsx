// navigation/PaymentTabNavigation.tsx
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { Text } from "react-native";

import TopupScreen from "../screens/wallet/Topup/TopupScreen";
import PayBillScreen from "screens/wallet/Topup/PayBillScreen";
import MyTransactionsScreen from "screens/wallet/Topup/MyTransactionsScreen";
import LogsScreen from "screens/wallet/Topup/LogsScreen";
import GamePackagesScreen from "screens/wallet/Topup/GamePackagesScreen";

const Tab = createMaterialTopTabNavigator();

const PaymentTabNavigation = () => {
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
        name="Topup"
        component={TopupScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontFamily: "Cairo-SemiBold", fontSize: 12 }}>
              شحن الرصيد
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <Ionicons name="card-outline" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="PayBill"
        component={PayBillScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontFamily: "Cairo-SemiBold", fontSize: 12 }}>
              تسديد فاتورة
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="receipt" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MyTransactions"
        component={MyTransactionsScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontFamily: "Cairo-SemiBold", fontSize: 12 }}>
              عمليّاتي
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <Ionicons name="list-outline" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Logs"
        component={LogsScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontFamily: "Cairo-SemiBold", fontSize: 12 }}>
              السجلات
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="clipboard-list" size={18} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="GamePackages"
        component={GamePackagesScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontFamily: "Cairo-SemiBold", fontSize: 12 }}>
              باقات الألعاب
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="gamepad" size={18} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default PaymentTabNavigation;

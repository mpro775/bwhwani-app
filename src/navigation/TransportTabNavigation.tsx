// navigation/TransportTabNavigation.tsx
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Text } from "react-native";

import TransportScreen from "../screens/transport/TransportScreen";
import MyTransportOrdersScreen from "../screens/transport/MyTransportOrdersScreen";

const Tab = createMaterialTopTabNavigator();

const TransportTabNavigation = () => {
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
        name="NewBooking"
        component={TransportScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontFamily: "Cairo-SemiBold", fontSize: 12 }}>
              حجز جديد
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <Ionicons name="car-outline" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MyOrders"
        component={MyTransportOrdersScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontFamily: "Cairo-SemiBold", fontSize: 12 }}>
              طلباتي
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="local-shipping" size={20} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TransportTabNavigation;

// navigation/AbsherTopTabs.tsx
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { Text } from "react-native";

import AbsherCategoryScreen from "../screens/absher/AbsherCategoryScreen";
import AbsherMyRequestsScreen from "../screens/absher/AbsherMyRequestsScreen";
import AbsherProviderScreen from "../screens/absher/AbsherProviderScreen";
import AbsherWithdrawScreen from "../screens/absher/AbsherWithdrawScreen";

const Tab = createMaterialTopTabNavigator();

const AbsherTopTabs = () => {
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
        name="AbsherCategory"
        component={AbsherCategoryScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontFamily: "Cairo-SemiBold", fontSize: 12 }}>
              التصنيفات
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <Ionicons name="list-circle-outline" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MyRequests"
        component={AbsherMyRequestsScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontFamily: "Cairo-SemiBold", fontSize: 12 }}>
              طلباتي
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="archive" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Provider"
        component={AbsherProviderScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontFamily: "Cairo-SemiBold", fontSize: 12 }}>
              مزود
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user-tie" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Withdraw"
        component={AbsherWithdrawScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontFamily: "Cairo-SemiBold", fontSize: 12 }}>
              السحب
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="dollar-sign" size={20} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AbsherTopTabs;

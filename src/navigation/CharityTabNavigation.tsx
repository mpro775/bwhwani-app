// navigation/CharityTopTabs.tsx
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Text } from "react-native";
import COLORS from "constants/colors";

import CharityFormScreen from "../screens/Charity/CharityFormScreen";
import CharityMyPostsScreen from "../screens/Charity/CharityMyPostsScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

const ICON_SIZE = 20; // حجم ثابت للأيقونات

const CharityTopTabs = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // ⬅️ هذا يخفي الهيدر العلوي

        tabBarActiveTintColor: "#D84315",
        tabBarInactiveTintColor: "#B0BEC5",
        tabBarStyle: {
          backgroundColor: "#FFF",
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 6,
          borderTopColor: "#eee",
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontFamily: "Cairo-SemiBold",
          fontSize: 12,
          textTransform: "none",
        },
        tabBarIcon: ({ color, focused }) => {
          switch (route.name) {
            case "CharityForm":
              return (
                <Ionicons name="heart-outline" size={ICON_SIZE} color={color} />
              );
            case "CharityMyPosts":
              return (
                <MaterialIcons name="post-add" size={ICON_SIZE} color={color} />
              );
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen
        name="CharityMyPosts"
        component={CharityMyPostsScreen}
        options={{ tabBarLabel: "منشوراتي" }}
      />
      <Tab.Screen
        name="CharityForm"
        component={CharityFormScreen}
        options={{ tabBarLabel: "تبرع الآن" }}
      />
    </Tab.Navigator>
  );
};

export default CharityTopTabs;

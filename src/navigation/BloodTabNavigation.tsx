import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// الشاشات
import BloodTypesScreen from "../screens/blood/BloodTypesScreen";
import BecomeDonorScreen from "../screens/blood/BecomeDonorScreen";
import BloodChatScreen from "../screens/blood/BloodChatScreen";
import DonorProfileScreen from "../screens/blood/DonorProfileScreen"; // ✅ شاشة ملف المتبرع
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();

const BloodTabNavigation = () => {
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
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case "المتبرعين":
              return <Ionicons name="water" size={size} color={color} />;
            case "سجّل كمتبرع":
              return (
                <Ionicons name="add-circle-outline" size={size} color={color} />
              );
         
            case "ملف المتبرع":
              return (
                <Ionicons
                  name="person-circle-outline"
                  size={size}
                  color={color}
                />
              );
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen name="المتبرعين" component={BloodTypesScreen} />
      <Tab.Screen name="سجّل كمتبرع" component={BecomeDonorScreen} />
      <Tab.Screen name="ملف المتبرع" component={DonorProfileScreen} />
    </Tab.Navigator>
  );
};

export default BloodTabNavigation;

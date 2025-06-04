import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import LostItemsScreen from "../screens/LostAndFound/LostItemsScreen";
import FoundItemsScreen from "../screens/LostAndFound/FoundItemsScreen";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();

const LostAndFoundTabNavigation = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
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
          if (route.name === "المفقودات")
            return <Ionicons name="alert-circle" size={size} color={color} />;
          if (route.name === "الموجودات")
            return <Ionicons name="cube" size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="المفقودات" component={LostItemsScreen} />
      <Tab.Screen name="الموجودات" component={FoundItemsScreen} />
    </Tab.Navigator>
  );
};

export default LostAndFoundTabNavigation;

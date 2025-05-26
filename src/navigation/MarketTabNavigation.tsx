// MarketTabNavigation.tsx
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons, Feather, Entypo } from "@expo/vector-icons";

import MarketHomeScreen from "../screens/market/MarketHomeScreen";
import AllProductsScreen from "../screens/market/AllProductsScreen";
import MarketCategoriesScreen from "../screens/market/MarketMyProductsScreen";
import ProductDetailsScreen from "../screens/market/ProductDetailsScreen";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

const ProductsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AllProducts" component={AllProductsScreen} />
    <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
  </Stack.Navigator>
);

const MarketTabNavigation = () => {
    const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      screenOptions={{
        swipeEnabled: true, // ✅ انقلها هنا
        tabBarShowIcon: true,
   tabBarActiveTintColor: "#D84315",
        tabBarInactiveTintColor: "#B0BEC5",
        tabBarIndicatorStyle: { backgroundColor: "#3E2723" },
        tabBarStyle: {
          backgroundColor: "#fff",
           height: 70 + insets.bottom,
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
        name="السوق"
        component={MarketHomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Entypo name="shop" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="المنتجات"
        component={AllProductsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="list" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="الفئات"
        component={MarketCategoriesScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="grid" size={20} color={color} />
          ),
        }}
      />

    </Tab.Navigator>
  );
};

export default MarketTabNavigation;

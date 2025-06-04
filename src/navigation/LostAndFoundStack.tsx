// navigation/LostAndFoundStack.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// هنا نستورد الـ Tab Navigator
import LostAndFoundTabNavigation from "./LostAndFoundTabNavigation";

// باقي الشاشات غير الـ Tab:
import LostAndFoundDetailsScreen from "../screens/LostAndFound/LostAndFoundDetailsScreen";
import LostChatScreen from "../screens/LostAndFound/LostChatScreen";
import FoundChatScreen from "../screens/LostAndFound/FoundChatScreen";
import AddLostItemScreen from "../screens/LostAndFound/AddLostItemScreen";
import AddFoundItemScreen from "../screens/LostAndFound/AddFoundItemScreen";

const Stack = createNativeStackNavigator();

const LostAndFoundStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    {/* هذه الشاشة تعرض التبويبات (المفقودات/الموجودات) */}
    <Stack.Screen
      name="LostAndFoundTabs"
      component={LostAndFoundTabNavigation}
    />

    {/* باقي شاشات التنقل من داخل القسم */}
    <Stack.Screen
      name="LostAndFoundDetails"
      component={LostAndFoundDetailsScreen}
      options={{ headerShown: true, title: "تفاصيل الطلب" }}
    />
    <Stack.Screen
      name="AddLostItem"
      component={AddLostItemScreen}
      options={{ headerShown: true, title: "إضافة مفقود" }}
    />
    <Stack.Screen
      name="AddFoundItem"
      component={AddFoundItemScreen}
      options={{ headerShown: true, title: "إضافة موجود" }}
    />
    <Stack.Screen
      name="LostChat"
      component={LostChatScreen}
      options={{ headerShown: true, title: "محادثة حول المفقود" }}
    />
    <Stack.Screen
      name="FoundChat"
      component={FoundChatScreen}
      options={{ headerShown: true, title: "محادثة حول الموجودات" }}
    />
  </Stack.Navigator>
);

export default LostAndFoundStack;

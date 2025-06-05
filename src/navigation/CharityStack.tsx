// navigation/CharityStack.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CharityFormScreen from "../screens/Charity/CharityFormScreen"; // للتأكيد على وجود النوع
import CharityMyPostsScreen from "../screens/Charity/CharityMyPostsScreen";
import CharityTopTabs from "./CharityTabNavigation";

export type CharityStackParamList = {
  CharityTabs: undefined;
  // لا حاجة لتعريف شاشات أخرى منفصلة، لأننا نتنقل داخل الـ TopTabs
};

const Stack = createStackNavigator<CharityStackParamList>();

const CharityStack = () => (
  <Stack.Navigator initialRouteName="CharityTabs">
    <Stack.Screen
      name="CharityTabs"
      component={CharityTopTabs}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default CharityStack;

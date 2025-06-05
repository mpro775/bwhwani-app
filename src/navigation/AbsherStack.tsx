// navigation/AbsherStack.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AbsherTopTabs from "./AbsherTopTabs";
import AbsherFormScreen from "../screens/absher/AbsherFormScreen";

export type AbsherStackParamList = {
  AbsherTabs: undefined;
  AbsherForm: { category: string };
};

const Stack = createStackNavigator<AbsherStackParamList>();

const AbsherStack = () => (
  <Stack.Navigator initialRouteName="AbsherTabs">
    <Stack.Screen
      name="AbsherTabs"
      component={AbsherTopTabs}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="AbsherForm"
      component={AbsherFormScreen}
      options={{ title: "طلب خدمة أبشر" }}
    />
  </Stack.Navigator>
);

export default AbsherStack;

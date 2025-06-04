// navigation/AbsherStack.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AbsherCategoryScreen from "screens/absher/AbsherCategoryScreen";
import AbsherFormScreen from "screens/absher/AbsherFormScreen";
import AbsherMyRequestsScreen from "screens/absher/AbsherMyRequestsScreen";
import AbsherProviderScreen from "screens/absher/AbsherProviderScreen";
import AbsherWithdrawScreen from "screens/absher/AbsherWithdrawScreen";


export type AbsherStackParamList = {
  AbsherCategory: undefined;
  AbsherForm: { categoryId: string } | undefined;
  AbsherMyRequests: undefined;
  AbsherProvider: { providerId: string } | undefined;
  AbsherWithdraw: undefined;
};

const Stack = createStackNavigator<AbsherStackParamList>();

const AbsherStack = () => (
  <Stack.Navigator initialRouteName="AbsherCategory">
    <Stack.Screen
      name="AbsherCategory"
      component={AbsherCategoryScreen}
      options={{ title: "أبشر - الأقسام" }}
    />
    <Stack.Screen
      name="AbsherForm"
      component={AbsherFormScreen}
      options={{ title: "نموذج أبشر" }}
    />
    <Stack.Screen
      name="AbsherMyRequests"
      component={AbsherMyRequestsScreen}
      options={{ title: "طلباتي في أبشر" }}
    />
    <Stack.Screen
      name="AbsherProvider"
      component={AbsherProviderScreen}
      options={{ title: "مقدم خدمة أبشر" }}
    />
    <Stack.Screen
      name="AbsherWithdraw"
      component={AbsherWithdrawScreen}
      options={{ title: "سحب أبشر" }}
    />
  </Stack.Navigator>
);

export default AbsherStack;

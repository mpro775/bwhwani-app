// navigation/PaymentStack.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import PaymentTabNavigation from "./PaymentTabNavigation";

export type PaymentStackParamList = {
  PaymentTabs: undefined;
  PaymentSummary: { amount: number; /* أو أي بيانات إضافية */ };
};

const Stack = createStackNavigator<PaymentStackParamList>();

const PaymentStack = () => (
  <Stack.Navigator initialRouteName="PaymentTabs">
    {/* نعرض التبويبات أولاً بدون هيدر */}
    <Stack.Screen
      name="PaymentTabs"
      component={PaymentTabNavigation}
      options={{ headerShown: false }}
    />

    {/* شاشة ملخص الدفع تظهر عند انتهاء أي عملية شحن أو تسديد */}
  
  </Stack.Navigator>
);

export default PaymentStack;

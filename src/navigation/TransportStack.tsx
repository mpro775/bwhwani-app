// navigation/TransportStack.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import TransportTabNavigation from "./TransportTabNavigation";
import TransportBookingScreen from "../screens/transport/TransportBookingScreen";
import RateDriverScreen from "../screens/transport/RateDriverScreen";

export type TransportStackParamList = {
  TransportTabs: undefined;
  TransportBooking: { category: "waslni" | "heavy" };
  RateDriver: { id: string };
};

const Stack = createStackNavigator<TransportStackParamList>();

const TransportStack = () => (
  <Stack.Navigator initialRouteName="TransportTabs">
    <Stack.Screen
      name="TransportTabs"
      component={TransportTabNavigation}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="TransportBooking"
      component={TransportBookingScreen}
      options={{ title: "تفاصيل الحجز" }}
    />
    <Stack.Screen
      name="RateDriver"
      component={RateDriverScreen}
      options={{ title: "تقييم السائق" }}
    />
  </Stack.Navigator>
);

export default TransportStack;

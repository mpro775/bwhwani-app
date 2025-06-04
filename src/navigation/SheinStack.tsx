// SheinStack.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SHEINScreen from "screens/delivery/SHEINScreen";
import SheinCheckoutScreen from "screens/delivery/SheinCheckoutScreen";

const SheinStack = createStackNavigator();

const SheinStackNavigation = () => (
  <SheinStack.Navigator initialRouteName="SHEINHome">
    <SheinStack.Screen
      name="SHEINHome"
      component={SHEINScreen}
      options={{ title: "شي إن" }}
    />
    <SheinStack.Screen
      name="SheinCheckout"
      component={SheinCheckoutScreen}
      options={{ title: "إتمام الطلب" }}
    />
  </SheinStack.Navigator>
);

export default SheinStackNavigation;

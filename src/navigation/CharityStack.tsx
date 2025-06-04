// navigation/CharityStack.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CharityFormScreen from "screens/Charity/CharityFormScreen";
import CharityMyPostsScreen from "screens/Charity/CharityMyPostsScreen";


export type CharityStackParamList = {
  CharityForm: undefined;
  CharityMyPosts: undefined;
};

const Stack = createStackNavigator<CharityStackParamList>();

const CharityStack = () => (
  <Stack.Navigator initialRouteName="CharityForm">
    <Stack.Screen
      name="CharityForm"
      component={CharityFormScreen}
      options={{ title: "نموذج التبرع" }}
    />
    <Stack.Screen
      name="CharityMyPosts"
      component={CharityMyPostsScreen}
      options={{ title: "منشوراتي في التبرع" }}
    />
  </Stack.Navigator>
);

export default CharityStack;

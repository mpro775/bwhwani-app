import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CharityFormScreen from "screens/Charity/CharityFormScreen";
import CharityMyPostsScreen from "screens/Charity/CharityMyPostsScreen";

const CharityStack = createStackNavigator();

const CharityTabNavigation = () => (
  <CharityStack.Navigator>
    <CharityStack.Screen 
      name="CharityForm" 
      component={CharityFormScreen} 
      options={{ title: "نموذج التبرع" }} 
    />
    <CharityStack.Screen 
      name="CharityMyPosts" 
      component={CharityMyPostsScreen} 
      options={{ title: "منشوراتي في التبرع" }} 
    />
  </CharityStack.Navigator>
);

export default CharityTabNavigation;

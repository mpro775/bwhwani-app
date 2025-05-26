import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


import LostAndFoundDetailsScreen from "../screens/LostAndFound/LostAndFoundDetailsScreen";
import LostChatScreen from "../screens/LostAndFound/LostChatScreen";
import FoundChatScreen from "../screens/LostAndFound/FoundChatScreen";
import LostItemsScreen from "../screens/LostAndFound/LostItemsScreen";
import FoundItemsScreen from "../screens/LostAndFound/FoundItemsScreen";
import AddLostItemScreen from "../screens/LostAndFound/AddLostItemScreen";
import AddFoundItemScreen from "../screens/LostAndFound/AddFoundItemScreen";

const Stack = createNativeStackNavigator();

const LostAndFoundStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="LostItemsScreen" component={LostItemsScreen} />

    <Stack.Screen
      name="LostChat"
      component={LostChatScreen}
      options={{ title: "محادثة حول المفقود" }}
    />
    <Stack.Screen
      name="FoundChat"
      component={FoundChatScreen}
      options={{ title: "محادثة حول الموجودات" }}
    />
    <Stack.Screen name="FoundItemsScreen" component={FoundItemsScreen} />

    <Stack.Screen name="AddLostItemScreen" component={AddLostItemScreen} />
    <Stack.Screen name="AddFoundItemScreen" component={AddFoundItemScreen} />
    <Stack.Screen
      name="LostAndFoundDetailsScreen"
      component={LostAndFoundDetailsScreen}
    />
  </Stack.Navigator>
);

export default LostAndFoundStack;

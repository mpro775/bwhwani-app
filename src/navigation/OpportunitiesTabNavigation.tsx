import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Platform,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, Feather } from "@expo/vector-icons";
import OpportunitiesListScreen from "../screens/opportunities/OpportunitiesListScreen";
import FreelancersListScreen from "../screens/opportunities/FreelancersListScreen";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();

const OpportunitiesTabNavigation = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState("Opportunities");
  const insets = useSafeAreaInsets();

  const handleAdd = () => {
    if (activeTab === "Opportunities") {
      navigation.navigate("AddOpportunity");
    } else if (activeTab === "Freelancers") {
      navigation.navigate("AddFreelancer");
    }
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: true,
          tabBarActiveTintColor: "#D84315",
          tabBarInactiveTintColor: "#B0BEC5",
          tabBarStyle: {
            backgroundColor: "#FFF",
             height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
            paddingTop: 6,
            borderTopColor: "#EEE",
            elevation: 8,
          },
          tabBarIcon: ({ color, size }) => {
            if (route.name === "Opportunities")
              return <Feather name="briefcase" size={size} color={color} />;
            if (route.name === "Freelancers")
              return <Feather name="users" size={size} color={color} />;
          },
        })}
        screenListeners={{
          state: (e) => {
            const index = e.data.state.index;
            const tabName = e.data.state.routeNames[index];
            setActiveTab(tabName);
          },
        }}
      >
        <Tab.Screen
          name="Opportunities"
          component={OpportunitiesListScreen}
          options={{ title: "الفرص" }}
        />
        <Tab.Screen
          name="Freelancers"
          component={FreelancersListScreen}
          options={{ title: "الفريلانسر" }}
        />
      </Tab.Navigator>


    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 30,
    left: 30,
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#D84315",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Cairo-Bold",
    marginLeft: 8,
  },
});

export default OpportunitiesTabNavigation;

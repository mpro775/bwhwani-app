// navigation/OpportunitiesStack.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import OpportunitiesListScreen from "../screens/opportunities/OpportunitiesListScreen";
import OpportunityDetailsScreen from "../screens/opportunities/OpportunityDetailsScreen";
import AddOpportunityScreen from "../screens/opportunities/AddOpportunityScreen";
import FreelancersListScreen from "../screens/opportunities/FreelancersListScreen";
import FreelancerDetailsScreen from "../screens/opportunities/FreelancerDetailsScreen";
import AddFreelancerScreen from "../screens/opportunities/AddFreelancerScreen";
import OpportunitiesTabNavigation from "./OpportunitiesTabNavigation";

const Stack = createNativeStackNavigator();

const OpportunitiesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="OpportunitiesHome"
      component={OpportunitiesTabNavigation}
    />

    <Stack.Screen
      name="OpportunitiesList"
      component={OpportunitiesListScreen}
    />
    <Stack.Screen
      name="OpportunityDetails"
      component={OpportunityDetailsScreen}
    />
    <Stack.Screen name="AddOpportunity" component={AddOpportunityScreen} />
    <Stack.Screen name="FreelancersList" component={FreelancersListScreen} />
    <Stack.Screen
      name="FreelancerDetails"
      component={FreelancerDetailsScreen}
    />
    <Stack.Screen name="AddFreelancer" component={AddFreelancerScreen} />
  </Stack.Navigator>
);

export default OpportunitiesStack;

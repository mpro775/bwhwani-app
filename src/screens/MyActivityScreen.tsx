import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MyLostAndFound from './tabs/MyLostAndFound';
import MyBloodRequests from './tabs/MyBloodRequests';
import MyOpportunities from './tabs/MyOpportunities';
import MyInteractions from './tabs/MyInteractions';
import MyOrdersScreen from './delivery/MyOrdersScreen';
import { MyFavoritesScreen } from './FavoritesScreen';
import MarketMyProductsScreen from './market/MarketMyProductsScreen';
import MyBookingsScreen from './Escrow/MyBookingsScreen';

const Tab = createMaterialTopTabNavigator();

const MyActivityScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarLabelStyle: {
          fontSize: 14,
          fontFamily: "Cairo-Bold",
          color: "#5D4037",
        },
        tabBarItemStyle: {
          width: 120,
        },
        tabBarStyle: {
          backgroundColor: "#FFF8F0",
          elevation: 4,
          borderBottomWidth: 1,
          borderColor: "#EEE",
        },
        tabBarIndicatorStyle: {
          backgroundColor: "#8B4B47",
          height: 3,
          borderRadius: 2,
        },
      }}
    >
      <Tab.Screen name="تفاعلاتي" component={MyInteractions} />
      <Tab.Screen name="المفضلة" component={MyFavoritesScreen} />
      <Tab.Screen name="منتجاتي" component={MarketMyProductsScreen} />
      <Tab.Screen name="طلباتي" component={MyOrdersScreen} />
      <Tab.Screen name="المفقودات" component={MyLostAndFound} />
      <Tab.Screen name="بنك الدم" component={MyBloodRequests} />
      <Tab.Screen name="فرص العمل" component={MyOpportunities} />
      <Tab.Screen name=" الحجوزات" component={MyBookingsScreen} />
    </Tab.Navigator>
  );
};

export default MyActivityScreen;

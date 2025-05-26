import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// الشاشات الخاصة بالحجوزات
import BookingsListScreen from "../screens/Escrow/BookingsListScreen";
import AddBookingScreen from "../screens/Escrow/AddBookingScreen";
import MyBookingsScreen from "../screens/Escrow/MyBookingsScreen"; // شاشة الحجوزات الخاصة بي (اختياري لاحقًا)

const Tab = createBottomTabNavigator();

const BookingTabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarActiveTintColor: "#D84315",
        tabBarInactiveTintColor: "#B0BEC5",
        tabBarStyle: {
          backgroundColor: "#FFF",
          height: 65,
          paddingBottom: 8,
          paddingTop: 6,
          borderTopColor: "#eee",
          elevation: 8,
        },
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case "الاماكن ":
              return <Ionicons name="business-outline" size={size} color={color} />;
          
            case "حجوزاتي":
              return <Ionicons name="clipboard-outline" size={size} color={color} />;
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen name="الحجوزات المتاحة" component={BookingsListScreen} />
      <Tab.Screen name="حجوزاتي" component={MyBookingsScreen} />
    </Tab.Navigator>
  );
};

export default BookingTabNavigation;

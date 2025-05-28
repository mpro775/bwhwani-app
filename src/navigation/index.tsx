// AppNavigation.tsx
import React from "react";
import {
  NavigationContainer,
  NavigatorScreenParams,
} from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerItemList,
} from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { Ionicons, Feather, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { View, Text, Image, TouchableOpacity } from "react-native";
import ProductDetailsScreen from "../screens/market/ProductDetailsScreen";
import DeliveryTabNavigation from "../navigation/DeliveryTabNavigation";

// الشاشات
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/profile/UserProfileScreen";
import SettingsScreen from "../screens/system/SettingsScreen";
import MarketTabNavigation from "./MarketTabNavigation";
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";

import BloodTypesScreen from "../screens/blood/BloodTypesScreen";
import BecomeDonorScreen from "../screens/blood/BecomeDonorScreen";
import OpportunitiesStack from "./OpportunitiesStack";
import LostAndFoundStack from "./LostAndFoundStack";
import AllProductsScreen from "../screens/market/AllProductsScreen";
import BloodTabNavigation from "./BloodTabNavigation";
import BloodChatScreen from "../screens/blood/BloodChatScreen";
import DonorProfileScreen from "../screens/blood/DonorProfileScreen";

import CommonProductDetailsScreen from "../screens/delivery/ProductDetailsScreen";
import CartScreen from "../screens/delivery/CartScreen";
import InvoiceScreen from "../screens/delivery/InvoiceScreen";
import MyOrdersScreen from "../screens/delivery/MyOrdersScreen";
import OrderDetailsScreen from "../screens/delivery/OrderDetailsScreen";
import FavoritesScreen from "../screens/delivery/FavoritesScreen";
import EditProfileScreen from "../screens/profile/EditProfileScreen";
import DeliveryAddressesScreen from "../screens/profile/DeliveryAddressesScreen";
import SelectLocationScreen from "../screens/map/SelectLocationScreen";
import MyFreelancerProfileScreen from "../screens/opportunities/MyFreelancerProfileScreen";
import CategoryDetailsScreen from "../screens/delivery/CategoryDetailsScreen";
import BusinessDetailsScreen from "../screens/delivery/BusinessDetailsScreen";
import GroceryDetailsScreen from "../screens/delivery/GroceryDetailsScreen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { getUserProfile } from "../storage/userStorage"; // أو المسار الصحيح
import { MyFavoritesScreen } from "../screens/FavoritesScreen";
import MyActivityScreen from "../screens/MyActivityScreen";
import AddLostItemScreen from "../screens/LostAndFound/AddLostItemScreen";
import AddFoundItemScreen from "../screens/LostAndFound/AddFoundItemScreen";
import BookingTabNavigation from "./BookingTabNavigation";
import BookingDetailsScreen from "../screens/Escrow/BookingDetailsScreen";
import BookingChatScreen from "../screens/Escrow/BookingChatScreen";
import BookingFormScreen from "../screens/Escrow/BookingFormScreen";
import MyBookingsScreen from "../screens/Escrow/MyBookingsScreen";
import ManageBookingAvailabilityScreen from "../screens/Escrow/ManageBookingAvailabilityScreen";
import AddBookingScreen from "../screens/Escrow/AddBookingScreen";
import ForgotPasswordScreen from "screens/Auth/ForgotPasswordScreen";
import OnboardingScreen from "screens/OnboardingScreen";
import { ScrollView } from "react-native-gesture-handler";




// أنواع التنقل

type RootStackParamList = {
  MainApp: undefined;
  Login: undefined;
  Register: undefined;
  MarketStack: NavigatorScreenParams<MarketStackParamList>;
  UniversalProductDetails: { product: any };
  CartScreen: undefined;
  InvoiceScreen: { items: any[] };
    AddBookingScreen:undefined;
ForgotPassword:undefined;
  MyOrdersScreen: undefined;
  OrderDetailsScreen: { order: any };
  FavoritesScreen: undefined;
  Onboarding:undefined;
  EditProfile: undefined;
AddLostItemScreen:undefined;
BookingsStack: undefined;
BecomeDonor:undefined;
MyBookingsScreen:undefined;
  ManageBookingAvailability: { bookingId: string };

BookingFormScreen: {
  bookingId: string;
  title: string;
  price: number;
  availableHours: string[];
};
AddFoundItemScreen:undefined;
  DeliveryAddresses: {
    selectedLocation?: { latitude: number; longitude: number };
  };
  SelectLocation: undefined;
  GroceryDetails: undefined;
  MyFreelancerProfile: undefined;
  DeliveryTab: undefined;
    BookingTabs: undefined; 
    BookingDetailsScreen: undefined;
    BookingChatScreen: undefined;

  CategoryDetails: undefined;
  BusinessDetails: { business: any };
};

type DrawerParamList = {
  HomeStack: undefined;
  BloodBankStack: undefined;
  Opportunities: undefined;
  MarketStack: NavigatorScreenParams<MarketStackParamList>;

  LostAndFound: undefined;
  Settings: undefined;
  BookingsStack: undefined;
  
};

type BloodStackParamList = {
  BloodTypes: undefined;
  BloodChatScreen: undefined;
  BecomeDonor: undefined;
  DonorProfile: undefined;
};
type MarketStackParamList = {
  MarketTabs: undefined;
  AllProducts: { selectedCategoryId?: string };
  ProductDetails: { product: any };
};
const MarketStack = createNativeStackNavigator<MarketStackParamList>();

const MarketStackNavigator = () => (
  <MarketStack.Navigator screenOptions={{ headerShown: false }}>

  <MarketStack.Screen name="MarketTabs" component={MarketTabNavigation} />

<MarketStack.Screen name="AllProducts" component={AllProductsScreen} />
  <MarketStack.Screen name="ProductDetails" component={ProductDetailsScreen} />
  </MarketStack.Navigator>
);
const RootStack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();
const TopTab = createMaterialTopTabNavigator();
const BloodStack = createNativeStackNavigator<BloodStackParamList>();
const BloodBankStackNavigator = () => (
  <BloodStack.Navigator screenOptions={{ headerShown: true }}>
    <BloodStack.Screen
      name="BloodTypes"
      component={BloodTypesScreen}
      options={{ title: "فصائل الدم المتاحة" }}
    />

    <BloodStack.Screen
      name="BloodChatScreen"
      component={BloodChatScreen}
      options={{ title: " المحادثات" }}
    />
    <BloodStack.Screen
      name="BecomeDonor"
      component={BecomeDonorScreen}
      options={{ title: "تعديل بيانات التبرع" }}
    />
    <BloodStack.Screen
      name="DonorProfile"
      component={DonorProfileScreen}
      options={{ title: "ملف المتبرع" }}
    />
  </BloodStack.Navigator>
);

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const { navigation } = props;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
  const checkLogin = async () => {
    try {
      const user = await getUserProfile();
      if (user && user.fullName) {
        setIsLoggedIn(true);
        setUserName(user.fullName);
      } else {
        // لا تفعل أي شيء، فقط لا تعرض الزر
      }
    } catch (error) {
      console.warn("لم يتم استرجاع المستخدم:", error);
    }
  };
  checkLogin();
}, []);


  return (
    <ScrollView contentContainerStyle={{ paddingTop: 40, paddingBottom: 20 }}>
      <View style={{ alignItems: "center", paddingVertical: 24 }}>
        <Image
          source={require("../../assets/profile_placeholder.png")}
          style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 8 }}
        />
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Cairo-SemiBold",
            color: "#3E2723",
          }}
        >
          {isLoggedIn ? `مرحبًا ${userName}` : "أنت غير مسجل الدخول"}
        </Text>
        {!isLoggedIn && (
          <TouchableOpacity
            style={{
              marginTop: 8,
              backgroundColor: "#D84315",
              paddingVertical: 6,
              paddingHorizontal: 16,
              borderRadius: 20,
            }}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={{ color: "#fff", fontFamily: "Cairo-Bold" }}>
              تسجيل الدخول
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <DrawerItemList {...props} />
    </ScrollView>
  );
};

const MainTabs = () => {
  const insets = useSafeAreaInsets();

  return (
    <TopTab.Navigator
      tabBarPosition="bottom"
      screenOptions={{
        tabBarShowIcon: true,
        tabBarActiveTintColor: "#D84315",
        tabBarInactiveTintColor: "#B0BEC5",
        tabBarStyle: {
          backgroundColor: "#FFF",
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarLabelStyle: {
          fontFamily: "Cairo-SemiBold",
          fontSize: 12,
        },
      }}
    >
      <TopTab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: "الرئيسية", // ✅ سيُستخدم كـ headerTitle تلقائي
          tabBarLabel: "الرئيسية",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={20} color={color} />
          ),
        }}
      />
      <TopTab.Screen
        name="ActivityTab"
        component={MyActivityScreen}
        options={{
          title: "أنشطتي",
          tabBarLabel: "أنشطتي",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="dashboard" size={20} color={color} />
          ),
        }}
      />
      <TopTab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: "حسابي",
          tabBarLabel: "حسابي",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={20} color={color} />
          ),
        }}
      />
    </TopTab.Navigator>
  );
};

const AppDrawer = () => (
  <Drawer.Navigator
    initialRouteName="HomeStack"

  screenOptions={({ navigation }) => ({
      headerShown: true,
      drawerActiveTintColor: "#D84315",
      drawerPosition: "right",
      drawerInactiveTintColor: "#B0BEC5",
          headerRight: () => null, // إلغاء الزر من اليسار
 headerLeft: () => (
      <TouchableOpacity
        style={{ marginLeft: 16 }}
        onPress={() => navigation.toggleDrawer()}
      >
        <Ionicons name="menu" size={24} color="#3E2723" />
      </TouchableOpacity>
    ),
      drawerLabelStyle: {
        fontFamily: "Cairo-SemiBold",
        fontSize: 16,
        writingDirection: "rtl",
        paddingHorizontal:50,
      },
      drawerStyle: {
        backgroundColor: "#FFFFFF",
  width: "85%",
      },
      headerStyle: {
        backgroundColor: "#FFFFFF",
      },
      headerTitleStyle: {
        fontFamily: "Cairo-Bold",
        fontSize: 20,
        color: "#3E2723",
        textAlign: "center",
        writingDirection: "rtl",
      },
     })}

    drawerContent={(props) => <CustomDrawerContent {...props} />}
  >
    <Drawer.Screen
      name="HomeStack"
      component={MainTabs}
      options={{
        drawerLabel: "الرئيسية",
        headerTitle: "الصفحة الرئيسية",
        headerTitleAlign: "center",
        drawerIcon: ({ color, size }) => (
          <Ionicons name="home" size={size} color={color} />
        ),
      }}
    />
       <Drawer.Screen
      name="MarketStack"
      component={MarketStackNavigator}
      options={{
        drawerLabel: "حراج يثواني",
        headerTitle: "حراج بثواني ",
        headerTitleAlign: "center",
        drawerIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="shopping" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen
      name="BloodBankStack"
      component={BloodTabNavigation}
      options={{
        drawerLabel: "بنك الدم",
        headerTitle: "بنك الدم",
        drawerIcon: ({ color, size }) => (
          <Ionicons name="medkit" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen
      name="Opportunities"
      component={OpportunitiesStack}
      options={{
        drawerLabel: "فرص وخدمات",
        headerTitle: "فرص وخدمات",
        headerTitleAlign: "center",
        drawerIcon: ({ color, size }) => (
          <Feather name="briefcase" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen
  name="BookingsStack"
  component={BookingTabNavigation}
  options={{
    drawerLabel: "الحجوزات",
    headerTitle: "إدارة الحجوزات",
    headerTitleAlign: "center",
    drawerIcon: ({ color, size }) => (
      <Ionicons name="calendar" size={size} color={color} />
    ),
  }}
/>

    <Drawer.Screen
      name="LostAndFound"
      component={LostAndFoundStack}
      options={{
        drawerLabel: "المفقودات",
        headerTitle: "المفقودات",
        headerTitleAlign: "center",
        drawerIcon: ({ color, size }) => (
          <Ionicons name="alert-circle-outline" size={size} color={color} />
        ),
      }}
    />

    <Drawer.Screen
      name="Settings"
      component={SettingsScreen}
      options={{
        drawerLabel: "الإعدادات",
        headerTitle: "الإعدادات",
        headerTitleAlign: "center",
        drawerIcon: ({ color, size }) => (
          <Ionicons name="settings" size={size} color={color} />
        ),
      }}
    />
  </Drawer.Navigator>
);

const AppNavigation = ({ hasSeenOnboarding }: { hasSeenOnboarding: boolean }) => (
  <NavigationContainer>
  <RootStack.Navigator
    initialRouteName={hasSeenOnboarding ? "MainApp" : "Onboarding"}
    screenOptions={{ headerShown: false }}
  >
    <RootStack.Screen name="Onboarding" component={OnboardingScreen} />
    <RootStack.Screen name="MainApp" component={AppDrawer} />

      <RootStack.Screen name="Login" component={LoginScreen} />
      <RootStack.Screen name="Register" component={RegisterScreen} />
      <RootStack.Screen name="MarketStack" component={MarketStackNavigator} />



      <RootStack.Screen name="DeliveryTab" component={DeliveryTabNavigation} />
      <RootStack.Screen
        name="BusinessDetails"
        component={BusinessDetailsScreen}
      />
      <RootStack.Screen name="CartScreen" component={CartScreen} />
      <RootStack.Screen name="InvoiceScreen" component={InvoiceScreen} />
      <RootStack.Screen name="MyOrdersScreen" component={MyOrdersScreen} />
      <RootStack.Screen
        name="UniversalProductDetails"
        component={CommonProductDetailsScreen}
      />
      <RootStack.Screen name="FavoritesScreen" component={FavoritesScreen} />
     <RootStack.Screen
  name="BookingFormScreen"
  component={BookingFormScreen}
/>
<RootStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

     <RootStack.Screen
  name="ManageBookingAvailability"
  component={ManageBookingAvailabilityScreen}
/>
     <RootStack.Screen
  name="AddBookingScreen"
  component={AddBookingScreen}
/>

     <RootStack.Screen
  name="MyBookingsScreen"
  component={MyBookingsScreen}
/>

      <RootStack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: "تعديل الملف الشخصي" }}
      />
      <RootStack.Screen
  name="BookingTabs"
  component={BookingTabNavigation}
/>
      <RootStack.Screen
  name="BookingChatScreen"
  component={BookingChatScreen}
/>
          <RootStack.Screen
        name="AddLostItemScreen"
        component={AddLostItemScreen}
      />
<RootStack.Screen
  name="BookingDetailsScreen"
  component={BookingDetailsScreen}
/>

           <RootStack.Screen
        name="AddFoundItemScreen"
        component={AddFoundItemScreen}
      />
         <RootStack.Screen
      name="BecomeDonor"
      component={BecomeDonorScreen}
      options={{ title: "تعديل بيانات التبرع" }}
    />
      <RootStack.Screen
        name="CategoryDetails"
        component={CategoryDetailsScreen}
      />
      <RootStack.Screen
        name="DeliveryAddresses"
        component={DeliveryAddressesScreen}
        options={{ title: "عناويني" }}
      />
 

      <RootStack.Screen
        name="SelectLocation"
        component={SelectLocationScreen}
        options={{ title: "اختر موقعك على الخريطة" }}
      />
      <RootStack.Screen
        name="MyFreelancerProfile"
        component={MyFreelancerProfileScreen}
        options={{ title: "بيانات الفريلانسر" }}
      />
      
      <RootStack.Screen
        name="GroceryDetails"
        component={GroceryDetailsScreen}
      />
      
      <RootStack.Screen
        name="OrderDetailsScreen"
        component={OrderDetailsScreen}
      />
    </RootStack.Navigator>
  </NavigationContainer>
);

export default AppNavigation;

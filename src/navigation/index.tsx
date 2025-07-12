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

import {
  Ionicons,
  Feather,
  MaterialIcons,
  MaterialCommunityIcons,
  Entypo,
} from "@expo/vector-icons";
import { View, Text, Image, TouchableOpacity } from "react-native";
import DeliveryTabNavigation from "../navigation/DeliveryTabNavigation";

// الشاشات
import ProfileScreen from "../screens/profile/UserProfileScreen";
import SettingsScreen from "../screens/system/SettingsScreen";
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";

import CommonProductDetailsScreen from "../screens/delivery/ProductDetailsScreen";
import CartScreen from "../screens/delivery/CartScreen";
import InvoiceScreen from "../screens/delivery/InvoiceScreen";
import MyOrdersScreen from "../screens/delivery/MyOrdersScreen";
import OrderDetailsScreen from "../screens/delivery/OrderDetailsScreen";
import FavoritesScreen from "../screens/delivery/FavoritesScreen";
import EditProfileScreen from "../screens/profile/EditProfileScreen";
import DeliveryAddressesScreen from "../screens/profile/DeliveryAddressesScreen";
import SelectLocationScreen from "../screens/map/SelectLocationScreen";
import CategoryDetailsScreen from "../screens/delivery/CategoryDetailsScreen";
import BusinessDetailsScreen from "../screens/delivery/BusinessDetailsScreen";
import GroceryDetailsScreen from "../screens/delivery/GroceryDetailsScreen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { getUserProfile } from "../storage/userStorage"; // أو المسار الصحيح
import { MyFavoritesScreen } from "../screens/FavoritesScreen";

import ForgotPasswordScreen from "screens/Auth/ForgotPasswordScreen";
import OnboardingScreen from "screens/OnboardingScreen";
import { ScrollView } from "react-native-gesture-handler";
import OTPVerificationScreen from "screens/Auth/OTPVerificationScreen";
import SheinStackNavigation from "./SheinStack";
import PaymentStack from "./PaymentStack";

import WalletStack from "./WalletStack";

import DeliveryHomeScreen from "screens/delivery/DeliveryHomeScreen";
import { DefaultTheme } from "@react-navigation/native";
import DeliverySearch from "screens/delivery/DeliverySearch";
import SHEINScreen from "screens/delivery/SHEINScreen";

// أنواع التنقل
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "transparent", // خلفية شفافة حتى يظهر الهيدر الملون
  },
};
type RootStackParamList = {
  MainApp: undefined;
  Login: undefined;
  SheinScreen: undefined;
  WasliScreen: undefined;
  FazaaScreen: undefined;
  Register: undefined;
  UniversalProductDetails: { product: any };
  CartScreen: undefined;
  InvoiceScreen: { items: any[] };
  OTPVerification: { email: string };
  ForgotPassword: undefined;
  MyOrdersScreen: undefined;
  OrderDetailsScreen: { order: any };
  FavoritesScreen: undefined;
  Onboarding: undefined;
  PaymentStack: undefined;
  WalletStack: undefined;
  EditProfile: undefined;
  SheinStack: undefined;
  DeliverySearch: undefined;
  DeliveryAddresses: {
    selectedLocation?: { latitude: number; longitude: number };
  };

  SelectLocation: undefined;
  GroceryDetails: undefined;
  DeliveryTab: undefined;

  CategoryDetails: undefined;
  BusinessDetails: { business: any };
};

type DrawerParamList = {
  HomeStack: undefined;

  Settings: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();
const TopTab = createMaterialTopTabNavigator();

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
      {/* Tab للتوصيل */}
      <TopTab.Screen
        name="DeliveryHome"
        component={DeliveryHomeScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontFamily: "Cairo-SemiBold", fontSize: 12 }}>
              الرئيسية
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <Entypo name="shop" size={20} color={color} />
          ),
        }}
      />
      <TopTab.Screen
        name="MyOrders"
        component={MyOrdersScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontFamily: "Cairo-SemiBold", fontSize: 12 }}>
              طلباتي
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <Ionicons name="list-outline" size={20} color={color} />
          ),
        }}
      />
      <TopTab.Screen
        name="MyFaveorites"
        component={MyFavoritesScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontFamily: "Cairo-SemiBold", fontSize: 12 }}>
              المفضلة
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <Ionicons name="heart" size={20} color={color} />
          ),
        }}
      />
      {/* Tab لحساب المستخدم */}
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
      headerShown: false,
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
        paddingHorizontal: 50,
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

const AppNavigation = ({
  hasSeenOnboarding,
}: {
  hasSeenOnboarding: boolean;
}) => (
  <NavigationContainer theme={MyTheme}>
    <RootStack.Navigator
      initialRouteName={hasSeenOnboarding ? "MainApp" : "Onboarding"}
      screenOptions={{ headerShown: false }}
    >
      <RootStack.Screen name="Onboarding" component={OnboardingScreen} />
      <RootStack.Screen name="MainApp" component={AppDrawer} />
      <RootStack.Screen
        name="DeliverySearch"
        component={DeliverySearch}
        options={{ headerShown: false }}
      />
      <RootStack.Screen name="Login" component={LoginScreen} />
      <RootStack.Screen name="Register" component={RegisterScreen} />
      <RootStack.Screen
        name="SheinStack"
        component={SheinStackNavigation}
        options={{ title: "شي إن" }}
      />
      <RootStack.Screen
        name="PaymentStack"
        component={PaymentStack}
        options={{ title: "التسديد والشحن" }}
      />

      <RootStack.Screen
        name="WalletStack"
        component={WalletStack}
        options={{ title: "المعاملات المالية" }}
      />
      <RootStack.Screen name="DeliveryTab" component={DeliveryTabNavigation} />
      <RootStack.Screen
        name="BusinessDetails"
        component={BusinessDetailsScreen}
      />
      <RootStack.Screen name="CartScreen" component={CartScreen} />
      <RootStack.Screen name="InvoiceScreen" component={InvoiceScreen} />
      <RootStack.Screen name="MyOrdersScreen" component={MyOrdersScreen} />
      <RootStack.Screen
        name="OTPVerification"
        component={OTPVerificationScreen}
      />
      <RootStack.Screen
        name="UniversalProductDetails"
        component={CommonProductDetailsScreen}
      />
      <RootStack.Screen name="FavoritesScreen" component={FavoritesScreen} />

      <RootStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />

      <RootStack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: "تعديل الملف الشخصي" }}
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

      <RootStack.Screen name="SheinScreen" component={SHEINScreen} />

      <RootStack.Screen
        name="OrderDetailsScreen"
        component={OrderDetailsScreen}
      />
    </RootStack.Navigator>
  </NavigationContainer>
);

export default AppNavigation;

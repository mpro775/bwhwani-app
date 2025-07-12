import { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  // الحساب والموقع
  UserProfile: undefined;
  MainApp: undefined;
  EditProfile: undefined;
  WalletStack: undefined;
  AbsherForm:{category:string};
  SheinScreen: undefined;
  WasliScreen: undefined;
  FazaaScreen: undefined;
  AbsherCategory:undefined;
  ReviewScreen: { freelancerId: string };
  SelectLocation: undefined;
  RateDriver: { id: string };
  DeliveryAddresses: {
    selectedLocation?: { latitude: number; longitude: number };
  };
  SelectLocation: undefined;


  // التوصيل
  CartScreen: undefined;
  MyOrdersScreen: undefined;
  OrderDetailsScreen: { order: any };
  CategoryDetails: { categoryName: string ,categoryId:string };
  BusinessDetails: { business: any };


  // أخرى
  Login: undefined;
  Register: undefined;
  Settings: undefined;
  Notifications: undefined;
  InvoiceScreen: { items: any[] };

  // التنقل العام
  MainApp: undefined;
};



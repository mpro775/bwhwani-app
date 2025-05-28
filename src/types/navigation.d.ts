import { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  // الحساب والموقع
  UserProfile: undefined;
  MainApp: undefined;
  EditProfile: undefined;
  AddBookingScreen:undefined;
  DeliveryAddresses: {
    selectedLocation?: { latitude: number; longitude: number };
  };
  SelectLocation: undefined;


  BookingDetailsScreen: { bookingId: string };
  ManageBookingAvailability: { bookingId: string };
BookingChatScreen: { bookingId: string };
BookingFormScreen: {
  bookingId: string;
  title: string;
  price: number;
  availableHours: string[];
    image: string; // ✅
    unavailableHours: string[]; // ✅
};
MyBookingsScreen:undefined;

  // الفريلانسر والفرص
  AddFreelancer: undefined;
  MyFreelancerProfile: undefined;
    OpportunityDetailsScreen: { opportunityId: string };
  OpportunityChatScreen: { opportunityId: string };
    AddOpportunityScreen: undefined;

  // بنك الدم
  BloodProfile: undefined;
  BecomeDonor: undefined;
  DonorProfile: undefined;
  BloodChatScreen: { donorId: string };

  // المفقودات والموجودات
  AddLostItemScreen: undefined;
  AddFoundItemScreen:undefined;
  AddFoundItem: undefined;
  LostAndFoundProfile: undefined;
  LostChatScreen: { itemId: string };
  FoundChatScreen: { itemId: string };
LostAndFoundDetails:{ itemId: string };
  // السوق المفتوح
  MarketStack: NavigatorScreenParams<MarketStackParamList>;
  UniversalProductDetails: { product: any };

  // التوصيل
  CartScreen: undefined;
  MyOrdersScreen: undefined;
  OrderDetailsScreen: { order: any };
  CategoryDetails: { categoryName: string ,categoryId:string };
  BusinessDetails: { business: any };
  GroceryDetails: { storeId: string };

  // أخرى
  Login: undefined;
  Register: undefined;
  Settings: undefined;
  Notifications: undefined;
  InvoiceScreen: { items: any[] };

  // التنقل العام
  MainApp: undefined;
};

export type MarketStackParamList = {
  MarketTabs: undefined;
  AllProducts: { selectedCategoryId?: string };
  ProductDetails: { product: any };
};

// ✅ أنواع البيانات المركزية للمشروع

export type Address = {
  id:string;
  label: string;
  city: string;
  street: string;
  location?: {
    latitude: number;
    longitude: number;
  };
};

export type Booking = {
  id: string;
  title: string;
  description: string;
  type: "صالة" | "فندق" | "ملعب" | "أخرى";
  location: string;
  governorate: string;
  bookedSlots: {
  date: string;         // "2025-05-20"
  hours: string[];      // ["4:00 م", "6:00 م"]
  bookedBy: string;     // "userId" أو "owner"
}[];
  allowMultipleBookings: boolean;  // ✅ هل يمكن لأكثر من شخص الحجز؟
  unavailableDates: { from: string; to: string }[];
  price: number;
  availableHours: string[]; // ["10:00", "12:00", "14:00"]
  media: { uri: string; type: "image" | "video" }[];
  createdAt: string;
  user: {
    name: string;
    phone: string;
    profileImage?: string;
  };
};

export type Transaction = {
  id: string;
  type: "recharge" | "payment" | "refund";
  amount: number;
  date: string;
  note?: string;
};

export type BloodData = {
  name: string;
  age: string;
  gender: string;
  bloodType: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  governorate: string;
  address: string;
  availableTime: string;
  lastDonation?: string;
  phone: string;
  showPhone: boolean;
  status: "متاح" | "غير متاح";
};

export type FreelanceData = {
  bio: string;
  skills: string[];
  serviceCategory: string;
  city: string;
  portfolioImages: string[];
};

export type OpportunityData = {
  specialization: string;
  experienceYears?: number;
  description: string;
  city: string;
};

export type LostAndFoundStats = {
  lostCount: number;
  foundCount: number;
};
export type FavoriteType = "restaurant" | "product" | "service" | "haraj";

export type FavoriteItem = {
  _id?: string;
  itemId: string;
  itemType: 'product' | 'store' | 'freelancer' | 'opportunity' | 'blood' | 'lostItem' | 'foundItem';
  userId: string;
  createdAt?: string;
};

export type CommentType = {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  text: string;
  createdAt: string;
};

export type UserProfile = {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  aliasName?:string;
  profileImage?: string;
  gender?: "male" | "female";
  dateOfBirth?: string;
  addresses: Address[];
username?: string; // ← الاسم المستعار
  displayFullName?: boolean; // ← هل يتم عرض الاسم الكامل
  wallet: {
    balance: number;
    lastRecharge?: string;
    transactions?: Transaction[];
  };
  bloodData?: BloodData;
  freelanceData?: FreelanceData;
  opportunityData?: OpportunityData;
  lostAndFoundPosts?: LostAndFoundStats;
  deliveryPreferences?: {
    preferredAddresses?: string[];
    defaultInstructions?: string;
  };
  settings?: {
    notificationsEnabled: boolean;
    language: "ar" | "en";
    darkMode: boolean;
  };
  createdAt: string;
  updatedAt: string;
};
export interface DeliveryStore {
  _id: string;
  name: string;
  address?: string;
  category?: string | {
    _id: string;
    name: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  image?: string;
  logo?: string;
  tags?: string[];
  rating?: number;
  isActive?: boolean;

  // إضافات محلية للحساب
  distance?: string; // مثال: "2.4 كم"
  time?: string;     // مثال: "6 دقيقة تقريباً"
}

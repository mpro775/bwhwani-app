// types/product.ts
import { RouteProp } from "@react-navigation/native";

export type ProductMedia = {
  type: "image" | "video";
  uri: string;
};

export type ProductUser = {
  name: string;
  phone: string;
  profileImage: string;
    firebaseUID: string; // ✅ أضف هذا

};
export type outProduct = {
  _id?: string; // Optional for new products, present for existing
  name: string;
    id?: string;

  description: string;
  price: string;
  hasOffer: boolean;
  offerPrice: string;
  media: ProductMedia[];
  category: string;
  categoryId: string;
  location: string;
  user: {
    name: string;
    phone: string;
    profileImage: string;
  };
  condition: "new" | "used";
  warranty: boolean;
  delivery: boolean;
  specs: {
    brand: string;
    model: string;
    year?: number;
    material: string;
    color: string;
  };
  rating: number;
  socialShares: {
    whatsapp: number;
    facebook: number;
  };
  remainingTime?: string; // For existing product offer time
};
export type ProductComment = {
  id: string;
  content: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
};


export type ProductSpecs = {
  brand?: string;
  model?: string;
  year?: number;
  material?: string;
  color?: string;
};

export type ProductSocialShares = {
  whatsapp: number;
  facebook: number;
};

export type Product = {
  id: string;
  _id?: string;
  name: string;
  price: number;
  offerPrice?: number;
  hasOffer: boolean;
  media: ProductMedia[];
  description: string;
  category: string;
  categoryId: string;
  user: ProductUser;
  createdAt: string;
  viewsCount: number;
  location: string;
  comments: ProductComment[];
  condition: "new" | "used";
  warranty: boolean;
  delivery: boolean;
  specs: ProductSpecs;
  rating: number;
  remainingTime?: string;
  socialShares: ProductSocialShares;
};

// Define the navigation stack parameter list
export type MarketStackParamList = {
  AllProducts: undefined;
  ProductDetails: { product: Product };
};

// Define the route prop type for ProductDetailsScreen
export type ProductDetailsRouteProp = RouteProp<MarketStackParamList, "ProductDetails">;
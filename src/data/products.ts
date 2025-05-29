// products.ts

export type Product = {
  _id: string;
    id: string; // ✅ أضف هذا

  name: string;
  price: number;
  offerPrice?: number | null;
  hasOffer: boolean;
  category: string;
  categoryId: string;
  images: string[];
  user: {
    name: string;
    phone: string;
    profileImage: string;
  };
  description: string;
  createdAt: string;
  viewsCount: number;
  location: string;
  comments: { user: string; text: string }[];
  condition: "new" | "used";
  warranty: boolean;
  delivery: boolean;
  specs: {
    brand?: string;
    model?: string;
    year?: number;
    material?: string;
    color?: string;
  };
  rating: number;
  remainingTime?: string;
  socialShares: {
    whatsapp: number;
    facebook: number;
  };
};


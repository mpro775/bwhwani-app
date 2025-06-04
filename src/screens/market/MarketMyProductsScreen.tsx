import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

// Local imports
import COLORS from "../../constants/colors";
import { outProduct, ProductMedia } from "../../types/product";

// Components

// Utility functions (assuming these paths are correct in your project)
import { uploadFileToBunny } from "utils/api/uploadFileToBunny";
import { getToken } from "utils/api/token";
import { API_URL } from "utils/api/config";
import ProductHeader from "components/market/MarketMyProductsScreen/ProductHeader";
import ProductCard from "components/market/MarketMyProductsScreen/ProductCard";
import EmptyState from "components/market/MarketMyProductsScreen/EmptyState";
import ProductFormModal from "components/market/MarketMyProductsScreen/ProductFormModal";
import axiosInstance from "utils/api/axiosInstance";
import axios from "axios";
import { getAuthHeaders } from "api/userApi";

// Initial empty product structure
const initialEmptyProduct: outProduct = {
  name: "",
  description: "",
  price: 0,
  hasOffer: false,
  offerPrice: 0,
  media: [],
  category: "",
  categoryId: "",
  governorate: "",
  user: {
    name: "",
    phone: "",
    profileImage: "",
  },
  condition: "new",
  warranty: false,
  delivery: false,
  specs: {
    brand: "",
    model: "",
    year: undefined,
    material: "",
    color: "",
  },
  rating: 0,
  socialShares: {
    whatsapp: 0,
    facebook: 0,
  },
};

const MarketMyProductsScreen = () => {
  const [products, setProducts] = useState<outProduct[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newProduct, setNewProduct] = useState<outProduct>(initialEmptyProduct);
  const [token, setToken] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isError, setIsError] = useState(false); // Consider what this is used for
  const [originalProduct, setOriginalProduct] = useState<outProduct | null>(
    null
  );

  // Load user profile from AsyncStorage
  const loadUserProfile = useCallback(async () => {
    let user: any = { name: "", phone: "", profileImage: "" };

    const stored = await AsyncStorage.getItem("user-profile");
    if (stored) {
      user = JSON.parse(stored);
    }

    // مزامنة صامتة من الباك إند
    try {
      const headers = await getAuthHeaders();
      const { data: freshUser } = await axiosInstance.get("/users/me", {
        headers,
      });
      await AsyncStorage.setItem("user-profile", JSON.stringify(freshUser));

      user = {
        name: freshUser.fullName || freshUser.name || "",
        phone: freshUser.phone || "",
        profileImage: freshUser.profileImage || "",
      };
    } catch (err) {
      console.warn("⚠️ فشل تحديث بيانات المستخدم من الباك إند", err);
    }

    return user;
  }, []);

  // Handle editing a product
  const handleEdit = useCallback((product: outProduct) => {
    const parsedMedia = Array.isArray(product.media)
      ? product.media
      : JSON.parse(product.media as unknown as string);

    setOriginalProduct({ ...product, media: parsedMedia });
    setNewProduct({ ...product, media: parsedMedia });
    setEditingProductId(product._id || null);
    setModalVisible(true);
  }, []);
  // Handle deleting a product
  const handleDelete = useCallback(
    async (id: string) => {
      try {
        if (!token) {
          Alert.alert("تنبيه", "يرجى تسجيل الدخول أولاً للحذف");
          return;
        }
        await axiosInstance.delete(`/haraj/products/${id}`);
        setProducts((prev) => prev.filter((p) => p._id !== id));
        Alert.alert("نجاح", "تم حذف المنتج بنجاح");
      } catch (err: any) {
        Alert.alert("خطأ", err.message || "فشل في حذف المنتج");
      }
    },
    [token]
  );

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/haraj/categories");
        const data = res.data;
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        } else {
          setIsError(true);
        }
      } catch (err) {
        console.warn("⚠️ فشل في تحميل الفئات:", err);
        setIsError(true);
      }
    };
    fetchCategories();
  }, []);

  // Get auth token on component mount
  useEffect(() => {
    getToken().then(setToken);
  }, []);

  // Fetch products on component mount or when token changes
const fetchProducts = useCallback(async () => {
  try {
    const res = await axiosInstance.get("/haraj/products/my-products");
    const data = res.data;

    const parsedProducts = data.map((p: any) => ({
      ...p,
      media: typeof p.media === "string" ? JSON.parse(p.media) : p.media,
    }));

    setProducts(parsedProducts);
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("❌ Axios Error:", {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
      });
    } else {
      console.error("❌ Unknown Error:", error);
    }
  }
}, []);


  // Handle adding or updating a product
  const handleSaveProduct = async () => {
    if (!token) {
      Alert.alert("تنبيه", "يرجى تسجيل الدخول أولاً");
      return;
    }

    const payload: Partial<outProduct> = {} as Partial<outProduct>;
    const keysToCompare = Object.keys(newProduct) as (keyof outProduct)[];

    keysToCompare.forEach((key) => {
      const newVal = newProduct[key];
      const oldVal = originalProduct?.[key];

      if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        (payload as any)[key] = newVal;
      }
    });

    // رفع الوسائط إذا لزم
    const uploadedMediaUrls: ProductMedia[] = [];
    for (const item of newProduct.media) {
      if (item.uri.startsWith("file://") || item.uri.startsWith("content://")) {
        const response = await fetch(item.uri);
        const blob = await response.blob();
        const url = await uploadFileToBunny(blob);
        uploadedMediaUrls.push({ type: item.type, uri: url });
      } else {
        uploadedMediaUrls.push(item);
      }
    }

    if (
      JSON.stringify(uploadedMediaUrls) !==
      JSON.stringify(originalProduct?.media)
    ) {
      payload.media = uploadedMediaUrls;
    }

    payload.price = Number(payload.price as any);
    payload.offerPrice = Number(payload.offerPrice as any);

    // ✅ إزالة بيانات المستخدم قبل الإرسال
    delete (payload as any).user;

    const method = editingProductId ? "PATCH" : "POST";
    const url = editingProductId
      ? `${API_URL}/haraj/products/${editingProductId}`
      : `${API_URL}/haraj/products`;

const finalPayload = editingProductId ? {
  name: newProduct.name,
  description: newProduct.description,
  price: newProduct.price,
  offerPrice: newProduct.offerPrice,
  hasOffer: newProduct.hasOffer,
  governorate: newProduct.governorate,
  condition: newProduct.condition,
  warranty: newProduct.warranty,
  delivery: newProduct.delivery,
  categoryId: newProduct.categoryId,
  media: uploadedMediaUrls,
  specs: newProduct.specs,
} : payload;

const res = await axiosInstance({ method, url, data: finalPayload });
await fetchProducts(); // ⬅️ التحديث بعد الحفظ

    // إعادة التهيئة بعد النجاح
    setOriginalProduct(null);
    setNewProduct(initialEmptyProduct);
    setModalVisible(false);
  };

  // Pick media (images/videos) from device library
  const pickMedia = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selected = result.assets.map((asset) => ({
        uri: asset.uri,
        type: asset.type === "video" ? "video" : "image",
      }));
      if (!result.assets.every((a) => a.uri)) {
        Alert.alert("خطأ", "حدث خطأ أثناء تحديد الملفات");
        return;
      }

      setNewProduct((prev) => ({
        ...prev,
        media: [...prev.media, ...(selected as ProductMedia[])],
      }));
      await fetchProducts(); // ⬅️ التحديث بعد الحفظ

    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ProductHeader productCount={products.length} />

     <FlatList
  data={products}
  renderItem={({ item }) => (
    <ProductCard item={item} onEdit={handleEdit} onDelete={handleDelete} />
  )}
  keyExtractor={(item) => item._id || item.name + Math.random().toString()}
  contentContainerStyle={styles.listContent}
  ListEmptyComponent={<EmptyState />}
  refreshing={refreshing}
  onRefresh={async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  }}
/>

      <TouchableOpacity
        style={styles.addButton}
        onPress={async () => {
          const user = await loadUserProfile();
          setNewProduct({
            ...initialEmptyProduct,
            user,
          });
          setEditingProductId(null);
          setModalVisible(true);
        }}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      <ProductFormModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setNewProduct(initialEmptyProduct); // Reset form on close
          setEditingProductId(null);
        }}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        onSave={handleSaveProduct}
        editingProductId={editingProductId}
        categories={categories}
        pickMedia={pickMedia}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    left: 30,
    backgroundColor: COLORS.accent,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
});

export default MarketMyProductsScreen;

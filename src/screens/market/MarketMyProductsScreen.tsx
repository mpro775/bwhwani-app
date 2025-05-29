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

// Initial empty product structure
const initialEmptyProduct: outProduct = {
  name: "",
  description: "",
  price: "",
  hasOffer: false,
  offerPrice: "",
  media: [],
  category: "",
  categoryId: "",
  location: "",
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
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isError, setIsError] = useState(false); // Consider what this is used for

  // Load user profile from AsyncStorage
  const loadUserProfile = useCallback(async () => {
    const stored = await AsyncStorage.getItem("user-profile");
    if (stored) {
      const user = JSON.parse(stored);
      return {
        name: user.name || "",
        phone: user.phone || "",
        profileImage: user.profileImage || "",
      };
    }
    return { name: "", phone: "", profileImage: "" };
  }, []);

  // Handle editing a product
  const handleEdit = useCallback((product: outProduct) => {
    setNewProduct({
      ...product, // Spread existing product data
      // Ensure media is correctly typed if it comes from backend as stringified JSON
      media: Array.isArray(product.media) ? product.media : JSON.parse(product.media as unknown as string),
    });
    setEditingProductId(product._id || null);
    setModalVisible(true);
  }, []);

  // Handle deleting a product
  const handleDelete = useCallback(async (id: string) => {
    // Implement API call for deletion here
    try {
      if (!token) {
        Alert.alert("تنبيه", "يرجى تسجيل الدخول أولاً للحذف");
        return;
      }

      const res = await fetch(`${API_URL}/market/products/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "فشل في حذف المنتج");
      }

      setProducts((prev) => prev.filter((p) => p._id !== id));
      Alert.alert("نجاح", "تم حذف المنتج بنجاح");
    } catch (err: any) {
      Alert.alert("خطأ", err.message || "فشل في حذف المنتج");
    }
  }, [token]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/market/categories`);
        const data = await res.json();

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
  useEffect(() => {
    const fetchProducts = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/market/products/my-products`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await res.json();
        // Ensure media is parsed if it's stored as a string
        const parsedProducts = data.map((p: any) => ({
            ...p,
            media: typeof p.media === 'string' ? JSON.parse(p.media) : p.media
        }));
        setProducts(parsedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        Alert.alert("خطأ", "فشل في تحميل منتجاتك");
      }
    };
    fetchProducts();
  }, [token]);


  // Handle adding or updating a product
  const handleSaveProduct = async () => {
    if (!token) {
      Alert.alert("تنبيه", "يرجى تسجيل الدخول أولاً");
      return;
    }
    if (!newProduct.name || !newProduct.price) {
  Alert.alert("تنبيه", "يرجى تعبئة جميع الحقول المطلوبة");
  return;
}

    try {
      const uploadedMediaUrls: ProductMedia[] = [];
      for (const item of newProduct.media) {
        // Only upload if it's a local URI (starts with 'file://' or similar)
        // If it's already a full URL (from BunnyCDN), assume it's already uploaded
        if (item.uri.startsWith("file://") || item.uri.startsWith("content://") || item.uri.startsWith("ph://")) {
            const response = await fetch(item.uri);
            const blob = await response.blob();
            const url = await uploadFileToBunny(blob); // This should return the full URL
            uploadedMediaUrls.push({ type: item.type, uri: url });
        } else {
            uploadedMediaUrls.push(item); // Keep existing BunnyCDN URL
        }
      }

      const payload = {
        ...newProduct,
        media: JSON.stringify(uploadedMediaUrls), // Send as stringified JSON
        mainCategory: newProduct.categoryId,
      };

      const method = editingProductId ? "PUT" : "POST";
      const url = editingProductId
        ? `${API_URL}/market/products/${editingProductId}`
        : `${API_URL}/market/products`;

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("❌ API error:", error);
        throw new Error(error.message || "فشل في حفظ المنتج");
      }

      const savedProduct = await res.json();
      // Ensure media is parsed for the saved product
      const parsedSavedProduct = {
          ...savedProduct,
          media: typeof savedProduct.media === 'string' ? JSON.parse(savedProduct.media) : savedProduct.media
      };


      if (editingProductId) {
        setProducts((prev) =>
          prev.map((p) =>
            p._id === editingProductId ? parsedSavedProduct : p
          )
        );
        Alert.alert("نجاح", "تم تعديل المنتج بنجاح");
      } else {
        setProducts((prev) => [...prev, parsedSavedProduct]);
        Alert.alert("نجاح", "تم إضافة المنتج بنجاح");
      }
      setModalVisible(false);
      setNewProduct(initialEmptyProduct);
      setEditingProductId(null);
    } catch (err: any) {
      Alert.alert("خطأ", err.message || "فشل في حفظ المنتج");
    }
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
        media: [...prev.media, ...selected as ProductMedia[]],
      }));
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
        keyExtractor={(item) => item._id || item.name + Math.random().toString()} // Fallback key if _id is missing
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<EmptyState />}
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
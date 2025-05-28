import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import Checkbox from "expo-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { Video } from "expo-av";
import { ResizeMode } from "expo-av";
import { Picker } from '@react-native-picker/picker';
import { uploadFileToBunny } from "utils/api/uploadFileToBunny";
import { getToken } from "utils/api/token";

const API_URL = "http://192.168.1.105:3000";

const COLORS = {
  primary: "#D84315",
  secondary: "#5D4037",
  background: "#FFFFFF",
  text: "#D84315",
  accent: "#D84315",
};
type MediaItem = {
  type: "image" | "video";
  uri: string;
};

const initialEmptyProduct = {
  name: "",
  description: "",
  price: "",
  hasOffer: false,
  offerPrice: "",
  media: [] as MediaItem[],
  category: "",
  categoryId: "",
  location: "",
  user: {
    name: "",
    phone: "",
    profileImage: "",
  },
  condition: "new" as "new" | "used",
  warranty: false,
  delivery: false,
  specs: {
    brand: "",
    model: "",
    year: undefined as number | undefined,
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
  const [products, setProducts] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newProduct, setNewProduct] = useState(initialEmptyProduct);
  const [token, setToken] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
const [editingProductId, setEditingProductId] = useState<string | null>(null);

const loadUserProfile = async () => {
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
};

const handleEdit = (product: any) => {
  setNewProduct({
    name: product.name,
    description: product.description,
    price: product.price,
    hasOffer: product.hasOffer,
    offerPrice: product.offerPrice,
    media: product.media || [],
    category: product.category,
    categoryId: product.categoryId,
    location: product.location,
    user: {
      name: product.user.name,
      phone: product.user.phone,
      profileImage: product.user.profileImage,
    },
    condition: product.condition,
    warranty: product.warranty,
    delivery: product.delivery,
    specs: {
      brand: product.specs.brand,
      model: product.specs.model,
      year: product.specs.year,
      material: product.specs.material,
      color: product.specs.color,
    },
    rating: product.rating,
    socialShares: {
      whatsapp: product.socialShares.whatsapp,
      facebook: product.socialShares.facebook,
    },
  });

  setEditingProductId(product._id); // تأكد أن المفتاح الصحيح هو _id
  setModalVisible(true);
};

const handleDelete = async (id: string) => {
  const updatedProducts = products.filter((p) => p._id !== id);
  await setProducts(updatedProducts);
  setProducts(updatedProducts);
};

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/market/categories`);
        const data = await res.json();
        if (Array.isArray(data)) setCategories(data);
      } catch (err) {
        console.error("فشل في تحميل الفئات:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    getToken().then(setToken);
  }, []);

  const handleAddProduct = async () => {
    if (!token) {
      Alert.alert("تنبيه", "يرجى تسجيل الدخول أولاً");
      return;
    }

    try {
      const uploadedMediaUrls: MediaItem[] = [];
      for (const item of newProduct.media) {
        const response = await fetch(item.uri);
        const blob = await response.blob();
        const url = await uploadFileToBunny(blob);
        uploadedMediaUrls.push({ type: item.type, uri: url });
      }

      const payload = {
        ...newProduct,
  media: JSON.stringify(uploadedMediaUrls), // ← مهم جداً
          mainCategory: newProduct.categoryId,

      };

      const res = await fetch(`${API_URL}/market/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("❌ Upload error:", error);
        throw new Error(error.message || "فشل في رفع المنتج");
      }

      const saved = await res.json();
      setProducts(prev => [...prev, saved]);
      setModalVisible(false);
      setNewProduct(initialEmptyProduct);
    } catch (err: any) {
      Alert.alert("خطأ", err.message || "فشل في رفع المنتج");
    }
  };

  const pickMedia = async () => {
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
setNewProduct((prev) => ({
  ...prev,
  media: [...prev.media, ...selected as MediaItem[]],
}));
    }
  };


  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        {item.hasOffer && (
          <View style={styles.offerTag}>
            <Text style={styles.offerTagText}>عرض خاص</Text>
          </View>
        )}
        <Image
    source={{ uri: item.media[0]?.uri }}
         style={styles.cardImage} />
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>

        <View style={styles.priceContainer}>
          {item.hasOffer ? (
            <>
              <Text style={styles.originalPrice}>{item.price} ر.ي</Text>
              <Text style={styles.finalPrice}>{item.offerPrice} ر.ي</Text>
            </>
          ) : (
            <Text style={styles.finalPrice}>{item.price} ر.ي</Text>
          )}
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEdit(item)}
          >
            <Ionicons name="create-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDelete(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color="#D32F2F" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>إدارة المنتجات</Text>
        <Text style={styles.productCount}>({products.length}) منتج</Text>
      </View>

      <FlatList
        data={products}
        renderItem={renderItem}
  keyExtractor={(item, index) => item._id || index.toString()} // الأفضل أن تستخدم item._id إن وجد
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="cube-outline" size={80} color="#ddd" />
            <Text style={styles.emptyText}>لا توجد منتجات مضافة</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
onPress={async () => {
  const user = await loadUserProfile();
  setNewProduct((prev) => ({
    ...prev,
    user,
  }));
  setEditingProductId(null);
  setModalVisible(true);
}}      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      {/* Modal Design */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingProductId ? "تعديل المنتج" : "إضافة منتج جديد"}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* داخل المودال */}
            <ScrollView contentContainerStyle={styles.modalContent}>
           
            
              <TextInput
                placeholder="اسم المنتج"
                value={newProduct.name}
                onChangeText={(text) =>
                  setNewProduct({ ...newProduct, name: text })
                }
                style={styles.input}
                placeholderTextColor="#999"
              />

              <TextInput
                placeholder="الوصف"
                value={newProduct.description}
                onChangeText={(text) =>
                  setNewProduct({ ...newProduct, description: text })
                }
                style={[styles.input, { height: 100 }]}
                multiline
                placeholderTextColor="#999"
              />

              <TextInput
                placeholder="السعر الأساسي"
                keyboardType="numeric"
                value={newProduct.price}
                onChangeText={(text) =>
                  setNewProduct({ ...newProduct, price: text })
                }
                style={styles.input}
                placeholderTextColor="#999"
              />

              <View style={styles.checkboxRow}>
                <Text style={styles.checkboxLabel}>هل يوجد عرض خاص؟</Text>
                <Checkbox
                  value={newProduct.hasOffer}
                  onValueChange={(val: boolean) =>
                    setNewProduct({ ...newProduct, hasOffer: val })
                  }
                  color={newProduct.hasOffer ? COLORS.primary : undefined}
                />
              </View>

              {newProduct.hasOffer && (
                <TextInput
                  placeholder="سعر العرض"
                  keyboardType="numeric"
                  value={newProduct.offerPrice}
                  onChangeText={(text) =>
                    setNewProduct({ ...newProduct, offerPrice: text })
                  }
                  style={styles.input}
                  placeholderTextColor="#999"
                />
              )}
              <Picker
  selectedValue={newProduct.categoryId}
  onValueChange={(itemValue) =>
    setNewProduct({ ...newProduct, categoryId: itemValue })
  }>
  <Picker.Item label="اختر فئة" value="" />
  {categories.map((cat) => (
    <Picker.Item key={cat._id} label={cat.name} value={cat._id} />
  ))}
</Picker>

              <TextInput
                placeholder="الموقع"
                value={newProduct.location}
                onChangeText={(text) =>
                  setNewProduct({ ...newProduct, location: text })
                }
                style={styles.input}
              />

              <View style={styles.checkboxRow}>
                <Text style={styles.checkboxLabel}>حالة المنتج</Text>
                <TouchableOpacity
                  onPress={() =>
                    setNewProduct({
                      ...newProduct,
                      condition:
                        newProduct.condition === "new" ? "used" : "new",
                    })
                  }
                >
                  <Text style={{ color: COLORS.primary }}>
                    {newProduct.condition === "new" ? "جديد" : "مستعمل"}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.checkboxRow}>
                <Text style={styles.checkboxLabel}>هل يوجد ضمان؟</Text>
                <Checkbox
                  value={newProduct.warranty}
                  onValueChange={(val) =>
                    setNewProduct({ ...newProduct, warranty: val })
                  }
                />
              </View>

              <View style={styles.checkboxRow}>
                <Text style={styles.checkboxLabel}>هل يوجد توصيل؟</Text>
                <Checkbox
                  value={newProduct.delivery}
                  onValueChange={(val) =>
                    setNewProduct({ ...newProduct, delivery: val })
                  }
                />
              </View>

              <TextInput
                placeholder="الماركة"
                value={newProduct.specs.brand}
                onChangeText={(text) =>
                  setNewProduct({
                    ...newProduct,
                    specs: { ...newProduct.specs, brand: text },
                  })
                }
                style={styles.input}
              />

              <TextInput
                placeholder="الموديل"
                value={newProduct.specs.model}
                onChangeText={(text) =>
                  setNewProduct({
                    ...newProduct,
                    specs: { ...newProduct.specs, model: text },
                  })
                }
                style={styles.input}
              />

              <TextInput
                placeholder="السنة"
                keyboardType="numeric"
                value={newProduct.specs.year?.toString() || ""}
                onChangeText={(text) =>
                  setNewProduct({
                    ...newProduct,
                    specs: { ...newProduct.specs, year: parseInt(text) },
                  })
                }
                style={styles.input}
              />

              <TextInput
                placeholder="اللون"
                value={newProduct.specs.color}
                onChangeText={(text) =>
                  setNewProduct({
                    ...newProduct,
                    specs: { ...newProduct.specs, color: text },
                  })
                }
                style={styles.input}
              />

              <TextInput
                placeholder="المادة"
                value={newProduct.specs.material}
                onChangeText={(text) =>
                  setNewProduct({
                    ...newProduct,
                    specs: { ...newProduct.specs, material: text },
                  })
                }
                style={styles.input}
              />
              <TouchableOpacity style={styles.imageButton} onPress={pickMedia}>
                <Text style={styles.imageButtonText}>
                  {newProduct.media.length > 0
                    ? "إضافة وسائط أخرى"
                    : "اختيار وسائط"}
                </Text>
              </TouchableOpacity>
              
              {newProduct.media?.map((item, index) =>
                item.type === "image" ? (
                  <Image
                    key={index}
source={{ uri: `http://192.168.1.102:3000${item.uri}` }}
                    style={styles.previewImage}
                  />
                ) : (
                  <Video
                    key={index}
source={{ uri: `http://192.168.1.102:3000${item.uri}` }}
                    style={styles.previewImage}
                    useNativeControls
                    resizeMode={ResizeMode.COVER}
                    isLooping
                  />
                )
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.footerButton, styles.saveButton]}
                onPress={handleAddProduct}
              >
                <Text style={styles.footerButtonText}>حفظ التغييرات</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.footerButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.footerButtonText}>إلغاء</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontFamily: "Cairo-Bold",
    fontSize: 22,
    color: COLORS.text,
  },
  productCount: {
    fontFamily: "Cairo-SemiBold",
    color: "#666",
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardHeader: {
    position: "relative",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
  },
  checkboxRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  checkboxLabel: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 14,
    color: COLORS.text,
  },
  imageButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 8,
  },
  imageButtonText: {
    color: "white",
    fontFamily: "Cairo-SemiBold",
    fontSize: 14,
  },
  previewImage: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardImage: {
    width: "100%",
    height: 180,
  },
  offerTag: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: COLORS.accent,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    zIndex: 1,
  },
  offerTagText: {
    color: "white",
    fontFamily: "Cairo-SemiBold",
    fontSize: 12,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontFamily: "Cairo-Bold",
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
  },
  originalPrice: {
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    color: "#999",
    textDecorationLine: "line-through",
  },
  finalPrice: {
    fontFamily: "Cairo-Bold",
    fontSize: 18,
    color: COLORS.primary,
  },
  cardActions: {
    flexDirection: "row-reverse",
    justifyContent: "flex-start",
    gap: 16,
    marginTop: 12,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
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
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontFamily: "Cairo-SemiBold",
    color: "#999",
    fontSize: 16,
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontFamily: "Cairo-Bold",
    fontSize: 20,
    color: COLORS.text,
  },
  modalContent: {
    padding: 16,
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    fontFamily: "Cairo-Regular",
    fontSize: 16,
    textAlign: "right",
  },
  modalFooter: {
    flexDirection: "row-reverse",
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  footerButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButton: {
    backgroundColor: "#D84315",
  },
  footerButtonText: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 16,
    color: "white",
  },
  closeButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
  },
});

export default MarketMyProductsScreen;

import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { Picker } from '@react-native-picker/picker';
import COLORS from "../../../constants/colors";
import { outProduct, ProductMedia } from "../../../types/product";
import MediaPickerSection from "./MediaPickerSection";

interface ProductFormModalProps {
  visible: boolean;
  onClose: () => void;
  newProduct: outProduct;
  setNewProduct: React.Dispatch<React.SetStateAction<outProduct>>;
  onSave: () => Promise<void>;
  editingProductId: string | null;
  categories: any[];
  pickMedia: () => Promise<void>;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  visible,
  onClose,
  newProduct,
  setNewProduct,
  onSave,
  editingProductId,
  categories,
  pickMedia,
}) => {
  const handleYearChange = (text: string) => {
    const year = parseInt(text, 10);
    setNewProduct((prev) => ({
      ...prev,
      specs: { ...prev.specs, year: isNaN(year) ? undefined : year },
    }));
  };
const [showAdvancedFields, setShowAdvancedFields] = React.useState(false);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingProductId ? "تعديل المنتج" : "إضافة منتج جديد"}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalContent}>
            <TextInput
              placeholder="اسم المنتج"
              value={newProduct.name}
              onChangeText={(text) => setNewProduct({ ...newProduct, name: text })}
              style={styles.input}
              placeholderTextColor="#999"
            />

            <TextInput
              placeholder="الوصف"
              value={newProduct.description}
              onChangeText={(text) => setNewProduct({ ...newProduct, description: text })}
              style={[styles.input, { height: 100 }]}
              multiline
              placeholderTextColor="#999"
            />

            <TextInput
              placeholder="السعر الأساسي"
              keyboardType="numeric"
              value={newProduct.price}
              onChangeText={(text) => setNewProduct({ ...newProduct, price: text })}
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
                onChangeText={(text) => setNewProduct({ ...newProduct, offerPrice: text })}
                style={styles.input}
                placeholderTextColor="#999"
              />
            )}

            <Picker
              selectedValue={newProduct.categoryId}
              onValueChange={(itemValue) =>
                setNewProduct({ ...newProduct, categoryId: itemValue as string })
              }
              style={styles.picker}
            >
              <Picker.Item label="اختر فئة" value="" />
              {categories.map((cat) => (
                <Picker.Item key={cat._id} label={cat.name} value={cat._id} />
              ))}
            </Picker>

            <TextInput
              placeholder="الموقع"
              value={newProduct.location}
              onChangeText={(text) => setNewProduct({ ...newProduct, location: text })}
              style={styles.input}
            />

            <View style={styles.checkboxRow}>
              <Text style={styles.checkboxLabel}>حالة المنتج</Text>
              <TouchableOpacity
                onPress={() =>
                  setNewProduct({
                    ...newProduct,
                    condition: newProduct.condition === "new" ? "used" : "new",
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

           <TouchableOpacity
  onPress={() => setShowAdvancedFields(!showAdvancedFields)}
  style={{ marginVertical: 12, alignSelf: "center" }}
>
  <Text style={{ color: COLORS.primary, fontFamily: "Cairo-Bold", fontSize: 16 }}>
    {showAdvancedFields ? "إخفاء التفاصيل الإضافية" : "عرض المزيد من التفاصيل"}
  </Text>
</TouchableOpacity>
{showAdvancedFields && (
  <>
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
      onChangeText={handleYearChange}
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
  </>
)}

            <MediaPickerSection media={newProduct.media} onPickMedia={pickMedia} />
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.footerButton, styles.saveButton]}
              onPress={onSave}
            >
              <Text style={styles.footerButtonText}>حفظ التغييرات</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.footerButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.footerButtonText}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  closeButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
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
  picker: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    marginBottom: 16,
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
});

export default ProductFormModal;
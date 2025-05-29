// components/UserModal.tsx
import React from "react";
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import COLORS from "../../../constants/colors";
import { ProductUser } from "../../../types/product"; // Import the type
import { Product } from "data/products";

interface UserModalProps {
  visible: boolean;
  user: ProductUser | undefined; // user can be undefined if product is not yet loaded
  onClose: () => void;
    userProducts?: Product[]; // ← أضف هذا

}

const UserModal: React.FC<UserModalProps> = ({ visible, user, onClose ,userProducts}) => {
  if (!user) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>👤 بيانات البائع</Text>
          <View style={styles.userInfo}>
<Image
  source={{ uri: user.profileImage || "https://placehold.co/80x80" }}
  style={styles.userAvatar}
/>            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userPhone}>📞 {user.phone}</Text>
          </View>

          <Text style={styles.otherProductsTitle}>📦 منتجات أخرى:</Text>
          {/* Example of dummy products - replace with actual data if available */}
         {userProducts?.length ? (
  userProducts.map((p, i) => (
    <Text key={p.id || i} style={styles.otherProductText}>
      • {p.name}
    </Text>
  ))
) : (
  <Text style={styles.otherProductText}>لا توجد منتجات أخرى</Text>
)}


          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>إغلاق</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    maxHeight: "80%",
    width: "100%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontFamily: "Cairo-Bold",
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
    color: COLORS.text,
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginBottom: 8,
  },
  userName: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 16,
    color: COLORS.text,
  },
  userPhone: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Cairo-Regular",
  },
  otherProductsTitle: {
    fontFamily: "Cairo-Bold",
    fontSize: 16,
    marginBottom: 8,
    textAlign: "right",
    color: COLORS.text,
  },
  otherProductText: {
    fontSize: 14,
    marginBottom: 6,
    textAlign: "right",
    fontFamily: "Cairo-Regular",
    color: "#666",
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.background,
    borderRadius: 10,
  },
  closeButtonText: {
    textAlign: "center",
    color: COLORS.primary,
    fontFamily: "Cairo-Bold",
    fontSize: 16,
  },
});

export default UserModal;
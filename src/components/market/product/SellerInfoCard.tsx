// components/SellerInfoCard.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../../constants/colors";
import { outProduct, Product, ProductUser } from "../../../types/product";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "utils/api/axiosInstance";

interface SellerInfoCardProps {
  product: Product;
  location: string;
  currentUID: string | null;
  onShowUserModal: () => void;
}

const SellerInfoCard: React.FC<SellerInfoCardProps> = ({
  product,
  location,
  currentUID,
  onShowUserModal,
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    if (product?.firebaseUID) {
      fetchFollowData();
    }
  }, [product]);

  const fetchFollowData = async () => {
    try {
      if (!product?.firebaseUID) {
        console.warn("⚠️ لا يوجد firebaseUID للمستخدم");
        return;
      }

      const res = await axiosInstance.get(
        `/users/${product.firebaseUID}/follow-stats`
      );
      setFollowersCount(res.data.followersCount || 0);

      // يمكنك أيضًا التحقق من حالة المتابعة هنا إذا كان لديك endpoint لذلك
      // setIsFollowing(res.data.isFollowing || false);
    } catch (err) {
      console.error("❌ خطأ أثناء جلب المتابعين:", err);
    }
  };
  const handleFollow = async () => {
    if (!currentUID) {
      Alert.alert("عذرًا", "يجب تسجيل الدخول للمتابعة.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("firebase-token");
      if (!token) return;

      await axiosInstance.post(
        `/users/follow/${product.firebaseUID}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsFollowing(true);
      setFollowersCount((prev) => prev + 1);
    } catch (err) {
      console.error("❌ خطأ في متابعة المستخدم:", err);
    }
  };

  const handleReport = () => {
    if (!currentUID) {
      Alert.alert("عذرًا", "يجب تسجيل الدخول للإبلاغ.");
      return;
    }
    Alert.alert("🚨 تم إرسال البلاغ", "سيتم مراجعته من الإدارة ✅");
  };

  return (
    <>
      <TouchableOpacity style={styles.sellerCard} onPress={onShowUserModal}>
        <Image source={{ uri: product.user.profileImage }} style={styles.avatar} />
        <View style={styles.sellerInfo}>
          <Text style={styles.sellerName}>{product.user.name}</Text>
          <Text style={styles.sellerLocation}>
            <Ionicons name="location" size={14} /> {location}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleFollow}
        disabled={isFollowing}
        style={{
          backgroundColor: isFollowing ? "#ccc" : COLORS.primary,
          paddingVertical: 6,
          paddingHorizontal: 14,
          borderRadius: 20,
        }}
      >
        <Text style={{ color: "#FFF", fontFamily: "Cairo-Bold", fontSize: 14 }}>
          {isFollowing ? "تمت المتابعة" : "متابعة"}
        </Text>
      </TouchableOpacity>

      <Text
        style={{
          fontFamily: "Cairo-Regular",
          fontSize: 13,
          color: "#666",
          marginTop: 6,
        }}
      >
        المتابعين: {followersCount}
      </Text>

      <TouchableOpacity onPress={handleReport} style={{ marginTop: 20 }}>
        <Text
          style={{
            color: "#E53935",
            textAlign: "right",
            fontFamily: "Cairo-Bold",
          }}
        >
          🚨 الإبلاغ عن المستخدم
        </Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  sellerCard: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 12,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 16,
    color: COLORS.text,
  },
  sellerLocation: {
    fontFamily: "Cairo-Regular",
    color: "#666",
    fontSize: 14,
    marginTop: 4,
  },
});

export default SellerInfoCard;

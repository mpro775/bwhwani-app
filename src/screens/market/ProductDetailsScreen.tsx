// ProductDetailsScreen.tsx (نسخة محدثة)
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
  Share,
} from "react-native";
import {  useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import * as Clipboard from "expo-clipboard";
import { ProductComment, ProductDetailsRouteProp } from "types/product";
import ProductImageSlider from "components/market/product/ProductImageSlider";
import SellerInfoCard from "components/market/product/SellerInfoCard";
import ProductPriceSection from "components/market/product/ProductPriceSection";
import ProductSpecs from "components/market/product/ProductSpecs";
import ProductActions from "components/market/product/ProductActions";
import ProductComments from "components/market/product/ProductComments";
import UserModal from "components/market/product/UserModal";
import COLORS from "constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "utils/api/axiosInstance";

dayjs.extend(relativeTime);

const ProductDetailsScreen: React.FC = () => {
  const route = useRoute<ProductDetailsRouteProp>();
  const { product } = route.params;
  const [comments, setComments] = useState<ProductComment[]>([]);
  const [currentUID, setCurrentUID] = useState<string | null>(null);


  const [showDollar, setShowDollar] = useState<boolean>(false);
  const [negotiationPrice, setNegotiationPrice] = useState<string>("");
  const [showUserModal, setShowUserModal] = useState<boolean>(false);
  useEffect(() => {
    fetchComments();
  }, []);
  useEffect(() => {
    AsyncStorage.getItem("userId").then(setCurrentUID);
  }, []);

  const fetchComments = async () => {
    try {
      const res = await axiosInstance.get(
        `/haraj/products/${product.id}/comments`
      );
      const data = res.data;

      const transformed: ProductComment[] = data.map((comment: any) => ({
        id: comment.id,
        content: comment.text,
        createdAt: comment.createdAt,
        user: {
          id: comment.user.id,
          name: comment.user.name,
          avatar: comment.user.avatar,
        },
      }));

      setComments(transformed);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

 


 

  const handleWhatsApp = (): void => {
    const phone = product.user.phone.startsWith("0")
      ? "967" + product.user.phone.slice(1)
      : product.user.phone;
    if (!phone) {
      Alert.alert("خطأ", "رقم الهاتف غير متوفر لهذا المستخدم.");
      return;
    }
    const message = `مرحبا، أنا مهتم بالمنتج: ${product.name}`;
    const url = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(
      message
    )}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert("الرجاء تثبيت واتساب");
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error("Error opening WhatsApp:", err));
  };

  const handleNegotiate = async (): Promise<void> => {
    if (!currentUID) {
      Alert.alert("عذرًا", "يجب تسجيل الدخول لإرسال عرض تفاوض");
      return;
    }

    const proposed = parseInt(negotiationPrice);
    const current = product.offerPrice || product.price;

    if (isNaN(proposed) || proposed >= current) {
      Alert.alert("تنبيه", "يجب أن يكون السعر المقترح أقل من السعر الحالي.");
      return;
    }

    try {
      await axiosInstance.post(`/haraj/products/${product.id}/negotiate`, {
        price: proposed,
      });

      Alert.alert(
        "تم الإرسال",
        `تم إرسال عرضك: ${proposed.toLocaleString()} ر.ي`
      );
    } catch (err) {
      console.error("Negotiate error:", err);
    }
  };

  const handleShare = async (): Promise<void> => {
    const productUrl = `https://example.com/products/${product.id}`;
    const message = `📦 منتج: ${product.name}\n📍 الموقع: ${product.location}\n🔗 الرابط: ${productUrl}`;

    try {
      await Share.share({
        message,
        title: product.name,
        url: productUrl,
      });
    } catch (error: any) {
      Alert.alert("خطأ", `حدث خطأ أثناء محاولة المشاركة: ${error.message}`);
    }
  };

  const handleCopyLink = (): void => {
    const productUrl = `https://example.com/products/${product.id}`;
    Clipboard.setStringAsync(productUrl);
    Alert.alert("تم النسخ", "تم نسخ رابط المنتج إلى الحافظة");
  };

  const handleCall = (): void => {
    const phone = `tel:${product.user.phone}`;
    Linking.openURL(phone);
  };

  const handleReportUser = async () => {
    if (!currentUID) {
      Alert.alert("عذرًا", "يجب تسجيل الدخول للإبلاغ عن مستخدم");
      return;
    }

    try {
      await axiosInstance.post(`/users/${product.user.firebaseUID}/report`);
      Alert.alert("تم الإبلاغ", "شكراً لإبلاغك، سيتم مراجعة المستخدم.");
    } catch (err) {
      console.error("Report error:", err);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProductImageSlider media={product.media} hasOffer={product.hasOffer} />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.timeText}>
              {dayjs(product.createdAt).fromNow()}
            </Text>
          </View>
          <SellerInfoCard
            product={product}
            location={product.location}
            onShowUserModal={() => setShowUserModal(true)}
            currentUID={currentUID}
          />
          <ProductPriceSection
            product={product}
            showDollar={showDollar}
            onToggleDollar={() => setShowDollar((prev) => !prev)}
            negotiationPrice={negotiationPrice}
            onNegotiationPriceChange={setNegotiationPrice}
            onNegotiate={handleNegotiate}
            currentUID={currentUID}
          />
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>
          <ProductSpecs product={product} />
          <ProductActions
            product={product}
            handleWhatsApp={handleWhatsApp}
            handleShare={handleShare}
            handleCopyLink={handleCopyLink}
            handleCall={handleCall}
          />
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>تفاصيل المنتج</Text>
            <Text style={styles.description}>
              {product.description || "لا يوجد وصف متاح لهذا المنتج."}
            </Text>
          </View>
          <ProductComments currentUID={currentUID} comments={comments} />
        </View>
      </ScrollView>
      <UserModal
        visible={showUserModal}
        user={product.user}
        onClose={() => setShowUserModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontFamily: "Cairo-Bold",
    fontSize: 26,
    color: COLORS.text,
    textAlign: "right",
    lineHeight: 34,
  },
  timeText: {
    fontFamily: "Cairo-Regular",
    color: "#666",
    fontSize: 14,
    textAlign: "right",
    marginTop: 8,
  },
  categoryBadge: {
    backgroundColor: "#E3F2FD",
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 24,
  },
  categoryText: {
    fontFamily: "Cairo-SemiBold",
    color: COLORS.secondary,
    fontSize: 14,
  },
  section: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontFamily: "Cairo-Bold",
    fontSize: 20,
    color: COLORS.text,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
    paddingBottom: 12,
    marginBottom: 16,
    textAlign: "right",
  },
  description: {
    fontFamily: "Cairo-Regular",
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    textAlign: "right",
  },
});

export default ProductDetailsScreen;

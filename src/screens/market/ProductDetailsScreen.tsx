import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Modal,
} from "react-native";
import { ResizeMode } from "expo-av";

import { RouteProp, useRoute } from "@react-navigation/native";
import Swiper from "react-native-swiper";
import dayjs from "dayjs";
import { Ionicons } from "@expo/vector-icons";
import { Linking, Alert } from "react-native";
import { Share } from "react-native";
import * as Clipboard from "expo-clipboard";
import relativeTime from "dayjs/plugin/relativeTime";
import { Video } from "expo-av";

dayjs.extend(relativeTime);

const { width } = Dimensions.get("window");
const COLORS = {
  primary: "#D84315",
  secondary: "#5D4037",
  background: "#FFF8F0",
  text: "#4E342E",
  accent: "#8B4B47",
};

type Product = {
  id: string;
  name: string;
  price: number;
  offerPrice?: number;
  hasOffer: boolean;
  media: Array<{ type: "image" | "video"; uri: string }>;
  description: string;
  category: string;
  categoryId: string;
  user: {
    name: string;
    phone: string;
    profileImage: string;
  };
  createdAt: string;
  viewsCount: number;
  location: string;
  comments: { user: string; text: string }[];
  condition: "new" | "used"; // حالة المنتج
  warranty: boolean; // وجود ضمان
  delivery: boolean; // إمكانية التوصيل
  specs: {
    // المواصفات الفنية
    brand?: string;
    model?: string;
    year?: number;
    material?: string;
    color?: string;
  };
  rating: number; // التقييم من 5
  remainingTime?: string; // الوقت المتبقي للعرض
  socialShares: {
    // المشاركات الاجتماعية
    whatsapp: number;
    facebook: number;
  };
};

type MarketStackParamList = {
  AllProducts: undefined;
  ProductDetails: { product: Product };
};


const ProductDetailsScreen = () => {
  const route = useRoute<RouteProp<MarketStackParamList, "ProductDetails">>();
  const [followersCount, setFollowersCount] = React.useState(120); // مثال وهمي
  const [isFollowing, setIsFollowing] = React.useState(false);
  const [showDollar, setShowDollar] = React.useState(false);
const [negotiationPrice, setNegotiationPrice] = React.useState("");
const [showUserModal, setShowUserModal] = React.useState(false);

  const { product } = route.params;
const fixedMedia = product.media.map((item) => ({
  ...item,
  uri: item.uri.startsWith("http") ? item.uri : `http://192.168.1.102:3000${item.uri}`,
}));
  const handleFollowUser = () => {
    setIsFollowing(true);
    setFollowersCount((prev) => prev + 1);
    Alert.alert("تمت المتابعة", "✨ ستصلك تحديثات هذا المستخدم، خلك قريب!");
  };

  const handleWhatsApp = () => {
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

 console.log(phone)
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert("الرجاء تثبيت واتساب");
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error("Error:", err));
  };
  const handleNegotiate = () => {
  const proposed = parseInt(negotiationPrice);
  const current = product.offerPrice || product.price;

  if (isNaN(proposed) || proposed >= current) {
    Alert.alert("تنبيه", "يجب أن يكون السعر المقترح أقل من السعر الحالي.");
    return;
  }

  Alert.alert("تم الإرسال", `تم إرسال عرضك: ${proposed.toLocaleString()} ر.ي`);
  // يمكنك إرسال السعر إلى الباكيند هنا
};
  const handleShare = async () => {
    const productUrl = `https://example.com/products/${product.id}`; // ✨ رابط المنتج الفعلي (غيّره حسب نظامك)
    const message = `📦 منتج: ${product.name}\n📍 الموقع: ${product.location}\n🔗 الرابط: ${productUrl}`;

    try {
      await Share.share({
        message,
        title: product.name,
        url: productUrl,
      });
    } catch (error) {
      Alert.alert("خطأ", "حدث خطأ أثناء محاولة المشاركة.");
    }
  };

  const handleCopyLink = () => {
    const productUrl = `https://example.com/products/${product.id}`;
    Clipboard.setStringAsync(productUrl);
    Alert.alert("تم النسخ", "تم نسخ رابط المنتج إلى الحافظة");
  };
  
  const handleCall = () => {
    const phone = `tel:${product.user.phone}`;
    Linking.openURL(phone);
  };
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* سلايدر الصور */}
        <View style={styles.swiperContainer}>
          <Swiper
            loop
            showsPagination
            paginationStyle={styles.pagination}
            dotStyle={styles.dot}
            activeDotStyle={styles.activeDot}
          >
           {fixedMedia.map((item, index) =>
  item.type === "image" ? (
    <Image
      key={index}
      source={{ uri: item.uri }}
      style={styles.swiperImage}
      resizeMode="cover"
    />
  ) : (
    <Video
      key={index}
      source={{ uri: item.uri }}
      style={styles.swiperImage}
      useNativeControls
      resizeMode={ResizeMode.COVER}
      shouldPlay={false}
      isLooping
    />
  )
)}

          </Swiper>
          {product.hasOffer && (
            <View style={styles.offerTag}>
              <Ionicons name="pricetag" size={20} color="white" />
              <Text style={styles.offerText}>خصم مميز</Text>
            </View>
          )}
        </View>

        {/* محتوى الصفحة */}
        <View style={styles.content}>
          {/* العنوان والتاريخ */}
          <View style={styles.header}>
            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.timeText}>
              {dayjs(product.createdAt).fromNow()}
            </Text>
          </View>

          {/* معلومات البائع */}
<TouchableOpacity style={styles.sellerCard} onPress={() => setShowUserModal(true)}>
            <Image
              source={{ uri: product.user.profileImage }}
              style={styles.avatar}
            />
            <View style={styles.sellerInfo}>
              <Text style={styles.sellerName}>{product.user.name}</Text>
              <Text style={styles.sellerLocation}>
                <Ionicons name="location" size={14} /> {product.location}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleFollowUser}
            disabled={isFollowing}
            style={{
              backgroundColor: isFollowing ? "#ccc" : COLORS.primary,
              paddingVertical: 6,
              paddingHorizontal: 14,
              borderRadius: 20,
            }}
          >
            <Text
              style={{ color: "#FFF", fontFamily: "Cairo-Bold", fontSize: 14 }}
            >
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
<TouchableOpacity
  onPress={() => Alert.alert("تم الإبلاغ", "شكراً لإبلاغك، سيتم مراجعة المستخدم.")}
  style={{ marginTop: 20 }}
>
  <Text style={{ color: "#E53935", textAlign: "right", fontFamily: "Cairo-Bold" }}>
    🚨 الإبلاغ عن المستخدم
  </Text>
</TouchableOpacity>

          {/* الأسعار */}
          <View style={styles.priceSection}>
            <View style={styles.priceWrapper}>
              {product.hasOffer && (
                <View style={styles.offerTime}>
                  <Ionicons name="time" size={16} color="#FFF" />
                  <Text style={styles.offerTimeText}>متبقي 2 أيام</Text>
                </View>
              )}

              <View style={styles.priceContainer}>
                {product.hasOffer && (
                  <Text style={styles.originalPrice}>
                    {product.price.toLocaleString()} ر.ي
                  </Text>
                )}
                <TouchableOpacity
                  onPress={() => setShowDollar((prev) => !prev)}
                >
                  <Text style={styles.currentPrice}>
                    {showDollar
                      ? ((product.offerPrice || product.price) / 530).toFixed(
                          2
                        ) + " $"
                      : (product.offerPrice || product.price).toLocaleString() +
                        " ر.ي"}
                  </Text>
                </TouchableOpacity>
              </View>
<View style={{ marginTop: 16 }}>
  <Text style={{ fontFamily: "Cairo-Bold", fontSize: 16, textAlign: "right", marginBottom: 8 }}>
    🎯 تفاوض على السعر
  </Text>
  <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 8 }}>
    <TextInput
      placeholder="سعرك المقترح"
      keyboardType="numeric"
      value={negotiationPrice}
      onChangeText={setNegotiationPrice}
      style={{
        flex: 1,
        backgroundColor: "#F3F3F3",
        borderRadius: 10,
        padding: 12,
        textAlign: "right",
        fontFamily: "Cairo-Regular",
      }}
    />
    <TouchableOpacity
      onPress={handleNegotiate}
      style={{
        backgroundColor: COLORS.primary,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
      }}
    >
      <Text style={{ color: "#fff", fontFamily: "Cairo-Bold" }}>إرسال</Text>
    </TouchableOpacity>
  </View>
</View>

              <View style={styles.metaContainer}>
                <View style={styles.metaItem}>
                  <Ionicons name="eye" size={18} color="#4B86B4" />
                  <Text style={styles.metaText}>{product.viewsCount}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="chatbubbles" size={18} color="#4B86B4" />
                  <Text style={styles.metaText}>{product.comments.length}</Text>
                </View>
              </View>
            </View>

          </View>

          {/* التصنيف */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>
          {/* داخل قسم المواصفات */}
          {/* قسم المواصفات الفنية */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>المواصفات الفنية</Text>
            <View style={styles.specsGrid}>
              {/* حالة المنتج */}
              <View style={styles.specCard}>
                <Ionicons name="cube" size={20} color={COLORS.primary} />
                <View style={styles.specContent}>
                  <Text style={styles.specLabel}>الحالة</Text>
                  <Text style={styles.specValue}>
                    {product.condition === "new" ? "جديد" : "مستعمل"}
                  </Text>
                </View>
              </View>

              {/* الضمان */}
              <View style={styles.specCard}>
                <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
                <View style={styles.specContent}>
                  <Text style={styles.specLabel}>الضمان</Text>
                  <Text style={styles.specValue}>
                    {product.warranty ? "مُتاح" : "غير متاح"}
                  </Text>
                </View>
              </View>

              {/* الماركة */}
              <View style={styles.specCard}>
                <Ionicons name="pricetag" size={20} color={COLORS.primary} />
                <View style={styles.specContent}>
                  <Text style={styles.specLabel}>العلامة التجارية</Text>
                  <Text style={styles.specValue}>
                    {product.specs.brand || "غير محدد"}
                  </Text>
                </View>
              </View>

              {/* الوقت المتبقي للعرض */}
              {product.hasOffer && (
                <View style={[styles.specCard, styles.offerCard]}>
                  <Ionicons name="alarm" size={20} color="#FFF" />
                  <View style={styles.specContent}>
                    <Text style={[styles.specLabel, styles.offerText]}>
                      الوقت المتبقي
                    </Text>
                    <Text style={[styles.specValue, styles.offerText]}>
                      {product.remainingTime}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* قسم التقييم */}
          <View style={styles.ratingContainer}>
            <View style={styles.ratingStars}>
              {[...Array(5)].map((_, i) => (
                <Ionicons
                  key={i}
                  name={i < Math.floor(product.rating) ? "star" : "star-half"}
                  size={20}
                  color="#FFA000"
                />
              ))}
            </View>
            <Text style={styles.ratingText}>{product.rating}/5</Text>
          </View>

          {/* المشاركات الاجتماعية */}
          <View style={styles.socialShares}>
            <View style={styles.shareItem}>
              <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
              <Text style={styles.shareCount}>
                {product.socialShares.whatsapp}
              </Text>
            </View>
            <View style={styles.shareItem}>
              <Ionicons name="logo-facebook" size={20} color="#1877F2" />
              <Text style={styles.shareCount}>
                {product.socialShares.facebook}
              </Text>
            </View>
          </View>
          <View style={styles.floatingActions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
              <Ionicons name="call" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.whatsappButton]}
              onPress={handleWhatsApp}
            >
              <Ionicons name="logo-whatsapp" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#3E2723" }]}
              onPress={handleShare}
            >
              <Ionicons name="share-social" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* الوصف */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>تفاصيل المنتج</Text>
            <Text style={styles.description}>
              {product.description || "لا يوجد وصف متاح لهذا المنتج."}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleCopyLink}
            style={{ alignSelf: "center", marginTop: 10 }}
          >
            <Text
              style={{ color: COLORS.accent, fontFamily: "Cairo-SemiBold" }}
            >
              نسخ رابط المنتج
            </Text>
          </TouchableOpacity>

          {/* التعليقات */}
          <View style={styles.section}>
            <View style={styles.commentsHeader}>
              <Text style={styles.sectionTitle}>
                التعليقات ({product.comments.length})
              </Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>عرض الكل</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.commentInputContainer}>
              <TextInput
                placeholder="أضف تعليقك..."
                placeholderTextColor="#999"
                style={styles.commentInput}
                multiline
                textAlign="right"
              />
              <TouchableOpacity style={styles.sendButton}>
                <Ionicons name="send" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            {product.comments.slice(0, 2).map((comment, index) => (
              <View key={index} style={styles.commentItem}>
                <Text style={styles.commentUser}>{comment.user}</Text>
                <Text style={styles.commentText}>{comment.text}</Text>
              </View>
            ))}
          </View>
        </View>
        <Modal visible={showUserModal} animationType="slide" transparent>
  <View style={{
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20
  }}>
    <View style={{
      backgroundColor: "#FFF",
      borderRadius: 16,
      padding: 20,
      maxHeight: "80%",
    }}>
      <Text style={{ fontFamily: "Cairo-Bold", fontSize: 18, marginBottom: 10, textAlign: "center" }}>
        👤 بيانات البائع
      </Text>
      <View style={{ alignItems: "center", marginBottom: 12 }}>
        <Image source={{ uri: product.user.profileImage }} style={{ width: 80, height: 80, borderRadius: 40 }} />
        <Text style={{ fontFamily: "Cairo-SemiBold", fontSize: 16, marginTop: 8 }}>
          {product.user.name}
        </Text>
        <Text style={{ fontSize: 14, color: "#666" }}>📞 {product.user.phone}</Text>
      </View>

      <Text style={{ fontFamily: "Cairo-Bold", fontSize: 16, marginBottom: 8 }}>📦 منتجات أخرى:</Text>
      {/* منتجات وهمية */}
      {[1, 2, 3].map((_, i) => (
        <Text key={i} style={{ fontSize: 14, marginBottom: 6 }}>• منتج رقم {i + 1}</Text>
      ))}

      <TouchableOpacity onPress={() => setShowUserModal(false)} style={{ marginTop: 20 }}>
        <Text style={{ textAlign: "center", color: COLORS.primary, fontFamily: "Cairo-Bold" }}>إغلاق</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
      </ScrollView>

      <View style={styles.floatingActions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
          <Ionicons name="call" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.whatsappButton]}
          onPress={handleWhatsApp}
        >
          <Ionicons name="logo-whatsapp" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.shareButton]}
          onPress={handleShare}
        >
          <Ionicons name="share-social" size={24} color="white" />
        </TouchableOpacity>
      </View>
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
  shareButton: {
    backgroundColor: "#3E2723", // بني داكن أو اختر لون يناسب هويتك
  },
  swiperContainer: {
    height: width * 0.9,
    backgroundColor: "#FFF",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },

  swiperImage: {
    width: "100%",
    height: "100%",
  },
  pagination: {
    bottom: 20,
  },
  dot: {
    backgroundColor: "rgba(255,255,255,0.5)",
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 20,
    height: 8,
    borderRadius: 4,
  },
  offerTag: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "#E53935",
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 8,
    zIndex: 1,
  },
  offerText: {
    color: "#FFF",
    fontFamily: "Cairo-SemiBold",
    fontSize: 14,
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
  sellerCard: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
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
  specContent: {
    flex: 1,
  },
  sellerLocation: {
    fontFamily: "Cairo-Regular",
    color: "#666",
    fontSize: 14,
    marginTop: 4,
  },
  priceSection: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  priceWrapper: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  offerTime: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#FF6B6B",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  offerTimeText: {
    color: "#FFF",
    fontFamily: "Cairo-SemiBold",
    fontSize: 12,
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  metaContainer: {
    flexDirection: "row-reverse",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontFamily: "Cairo-SemiBold",
    color: "#2A4D69",
    fontSize: 14,
  },

  originalPrice: {
    fontFamily: "Cairo-Regular",
    fontSize: 16,
    color: "#999",
    textDecorationLine: "line-through",
  },
  currentPrice: {
    fontFamily: "Cairo-Bold",
    fontSize: 24,
    color: COLORS.primary,
  },
  viewsContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
    marginLeft: "auto",
  },
  viewsText: {
    fontFamily: "Cairo-Regular",
    color: "#666",
    fontSize: 14,
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
  },
  sectionTitle: {
    fontFamily: "Cairo-Bold",
    fontSize: 20,
    color: COLORS.text,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
    paddingBottom: 12,
    marginBottom: 16,
  },
  description: {
    fontFamily: "Cairo-Regular",
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    textAlign: "right",
  },
  commentsHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seeAll: {
    fontFamily: "Cairo-SemiBold",
    color: COLORS.secondary,
    fontSize: 14,
  },
  offerCard: {
    backgroundColor: COLORS.primary,
  },
  commentInputContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 14,
    textAlign: "right",
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    minHeight: 50,
  },
  sendButton: {
    padding: 10,
  },
  commentItem: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  commentUser: {
    fontFamily: "Cairo-SemiBold",
    color: COLORS.text,
    fontSize: 14,
    marginBottom: 4,
  },
  commentText: {
    fontFamily: "Cairo-Regular",
    color: "#666",
    fontSize: 14,
    lineHeight: 20,
  },
  floatingActions: {
    position: "absolute",
    bottom: 30,
    left: 20,
    gap: 12,
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    elevation: 4,
  },
  whatsappButton: {
    backgroundColor: "#25D366",
  },
  specsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 16,
  },
  specItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    minWidth: "48%",
    marginBottom: 8,
  },
  specLabel: {
    fontFamily: "Cairo-SemiBold",
    color: "#666",
    fontSize: 14,
    marginBottom: 4,
  },
  specValue: {
    fontFamily: "Cairo-Bold",
    color: COLORS.text,
    fontSize: 16,
  },
  specCard: {
    width: (width - 48) / 2, // عرض متجاوب مع الهوامش
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  /* أنماط التقييم */
  ratingContainer: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  ratingStars: {
    flexDirection: "row-reverse",
    gap: 4,
  },
  ratingText: {
    fontFamily: "Cairo-SemiBold",
    color: "#FFA000",
    fontSize: 14,
  },

  /* أنماط الوقت المتبقي للعرض */
  timeBadge: {
    backgroundColor: "#FF6B6B",
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    gap: 6,
    alignSelf: "flex-start",
    marginBottom: 12,
  },

  /* أنماط المشاركات الاجتماعية */
  socialShares: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row-reverse",
    justifyContent: "space-around",
    marginVertical: 8,
  },

  shareItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
  },
  shareCount: {
    fontFamily: "Cairo-SemiBold",
    color: "#2A4D69",
    fontSize: 14,
  },

  /* أنماط إضافية للضمان والحالة */
  warrantyBadge: {
    backgroundColor: "#E8F5E9",
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: 6,
    borderRadius: 8,
    gap: 6,
    marginLeft: 8,
  },
  conditionBadge: {
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
});


export default ProductDetailsScreen;

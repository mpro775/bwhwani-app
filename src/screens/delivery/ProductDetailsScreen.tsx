// src/screens/delivery/CommonProductDetailsScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  ScrollView,
  Dimensions,
  Platform
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useCart } from "../../context/CartContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from '@expo/vector-icons';

type RouteParams = {
  product: {
    id: string;
    name: string;
    image: any;
    price: number;
    originalPrice?: number;
    description?: string;
  };
  storeId: string;
  storeType: "restaurant" | "grocery" | "shop";
};

const { width } = Dimensions.get('window');
const IMAGE_HEIGHT = width * 0.8;

const CommonProductDetailsScreen = () => {
  const { product, storeId, storeType } = useRoute<any>().params as RouteParams;
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const scaleAnim = new Animated.Value(1);
  const [favorite, setFavorite] = useState(false);
const navigation = useNavigation();
  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { 
        toValue: 0.95, 
        duration: 100, 
        useNativeDriver: true 
      }),
      Animated.timing(scaleAnim, { 
        toValue: 1, 
        duration: 100, 
        useNativeDriver: true 
      }),
    ]).start();
  };

  const handleAddToCart = async () => {
    const success = await addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image,
        originalPrice: product.originalPrice,
        storeId,
        storeType,
      },
      quantity
    );
    
    if (success) {
      Alert.alert(
        "تمت الإضافة بنجاح",
        `${product.name} تمت إضافته إلى سلة التسوق`,
        [{ text: "حسناً", style: "cancel" }]
      );
    } else {
      Alert.alert(
        "حدث خطأ",
        "تعذر إضافة المنتج إلى السلة، يرجى المحاولة مرة أخرى",
        [{ text: "حسناً", style: "cancel" }]
      );
    }
  };

  const toggleFavorite = () => {
    setFavorite(!favorite);
    Animated.spring(scaleAnim, {
      toValue: favorite ? 1 : 1.2,
      useNativeDriver: true,
    }).start();
  };

  const renderPrice = () => {
    if (product.originalPrice && product.originalPrice > product.price) {
      return (
        <View style={styles.priceContainer}>
          <Text style={styles.originalPrice}>
            {product.originalPrice.toFixed(1)} ر.س
          </Text>
          <Text style={styles.discountedPrice}>
            {product.price.toFixed(1)} ر.س
          </Text>
        </View>
      );
    }
    return <Text style={styles.price}>{product.price.toFixed(1)} ر.س</Text>;
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* صورة المنتج مع تأثيرات */}
        <Animated.View style={[styles.imageContainer, { transform: [{ scale: scaleAnim }] }]}>
          <Image 
            source={product.image} 
            style={styles.image} 
            resizeMode="cover"
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.5)", "transparent"]}
            style={styles.imageGradient}
          />
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={toggleFavorite}
          >
            <MaterialIcons 
              name={favorite ? "favorite" : "favorite-border"} 
              size={28} 
              color={favorite ? "#FF5252" : "#fff"} 
            />
          </TouchableOpacity>
        </Animated.View>

        {/* تفاصيل المنتج */}
        <View style={styles.detailsCard}>
          <View style={styles.header}>
            <Text style={styles.name}>{product.name}</Text>
            {renderPrice()}
          </View>

          {product.description && (
            <Text style={styles.description}>
              {product.description}
            </Text>
          )}

          {/* عداد الكمية */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الكمية</Text>
            <View style={styles.qtyContainer}>
              <TouchableOpacity 
                style={styles.qtyButton}
                onPress={() => { 
                  setQuantity(q => Math.max(1, q - 1)); 
                  animateButton(); 
                }}
              >
                <Ionicons name="remove" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity 
                style={styles.qtyButton}
                onPress={() => { 
                  setQuantity(q => q + 1); 
                  animateButton(); 
                }}
              >
                <Ionicons name="add" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* زر الإضافة إلى السلة (ثابت في الأسفل) */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>المجموع</Text>
          <Text style={styles.totalPrice}>{(product.price * quantity).toFixed(1)} ر.س</Text>
        </View>
        <TouchableOpacity 
          onPress={handleAddToCart} 
          style={styles.addButton}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>إضافة إلى السلة</Text>
          <Ionicons name="cart" size={20} color="#fff" style={styles.cartIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8f8f8" 
  },
  scrollContainer: {
    paddingBottom: 100, // مساحة للزر الثابت في الأسفل
  },
  imageContainer: { 
    height: IMAGE_HEIGHT, 
    width: '100%', 
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: { 
    width: "100%", 
    height: "100%" 
  },
  imageGradient: { 
    ...StyleSheet.absoluteFillObject,
    top: undefined,
    height: 100,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    padding: 8,
  },
  favoriteButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    padding: 8,
  },
  detailsCard: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: { 
    fontSize: 24, 
    fontWeight: "bold", 
    color: '#333',
    flex: 1,
  },
  priceContainer: {
    alignItems: 'flex-end',
    marginLeft: 16,
  },
  price: { 
    fontSize: 22, 
    fontWeight: '700',
    color: "#4CAF50",
  },
  originalPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  discountedPrice: {
    fontSize: 22,
    fontWeight: '700',
    color: "#F44336",
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    padding: 4,
    alignSelf: 'flex-start',
  },
  qtyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  qtyText: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: '600',
    marginHorizontal: 12,
    minWidth: 24,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  totalContainer: {
    flex: 1,
  },
  totalText: {
    fontSize: 14,
    color: '#666',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'center',
    minWidth: 180,
  },
  addButtonText: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "bold",
  },
  cartIcon: {
    marginLeft: 8,
  },
});

export default CommonProductDetailsScreen;
// screens/NearbyProductsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import ProductCard from '../MarketMyProductsScreen/ProductCard';

const NearbyProductsScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  const fetchNearbyProducts = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`/market/products/nearby?lat=${lat}&lng=${lng}&maxDistance=10000`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      Alert.alert("خطأ", "فشل جلب المنتجات القريبة");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("خطأ", "يجب منح الإذن للموقع");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      fetchNearbyProducts(location.coords.latitude, location.coords.longitude);
    })();
  }, []);

  const toggleFavorite = (productId: string) => {
    setFavorites(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#D84315" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            isFavorited={favorites.includes(item._id)}
            onToggleFavorite={toggleFavorite}
            onPress={() => Alert.alert("تفاصيل المنتج", item.name)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>لا توجد منتجات قريبة حاليًا</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 16,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: 16,
    marginTop: 40,
    fontFamily: "Cairo-Regular",
  },
});

export default NearbyProductsScreen;

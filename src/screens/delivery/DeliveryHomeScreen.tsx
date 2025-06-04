import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View } from "react-native";

import DeliveryHeader from "../../components/delivery/DeliveryHeader";
import DeliverySearchBar from "../../components/delivery/DeliverySearchBar";
import DeliveryWorkingHours from "../../components/delivery/DeliveryWorkingHours";
import DeliveryBannerSlider from "../../components/delivery/DeliveryBannerSlider";
import DeliveryCategories from "../../components/delivery/DeliveryCategories";
import DeliveryTrending from "../../components/delivery/DeliveryTrending";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import axiosInstance from "utils/api/axiosInstance";
import * as Location from "expo-location";

interface Product {
  _id: string;
  name: string;
  // أضف أي خصائص أخرى تستخدمها (مثلاً price، image، etc)
}
type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CategoryDetails"
>;
interface Props {
  onSelectCategory?: (id: string, title: string) => void;
}

const DeliveryHomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
console.log("🔥 DeliveryHomeScreen loaded");
const [dailyOffers, setDailyOffers] = useState<Product[]>([]);
    const [nearbyNewProducts, setNearbyNewProducts] = useState([]);
  const [loadingNearby, setLoadingNearby] = useState(true);

  const [loading, setLoading] = useState(true);
 useEffect(() => {
    const fetchNearbyNewProducts = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.error("تم رفض إذن الموقع");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        const response = await axiosInstance.get("https://yourapi.com/products/nearby/new", {
          params: { lat: latitude, lng: longitude },
        });

        setNearbyNewProducts(response.data);
      } catch (error) {
        console.error("خطأ في جلب المنتجات الجديدة:", error);
      } finally {
        setLoadingNearby(false);
      }
    };

    fetchNearbyNewProducts();
  }, []);

 useEffect(() => {
    const fetchDailyOffers = async () => {
      try {
        const response = await axiosInstance.get("delivery/products/daily-offers");
        setDailyOffers(response.data);
      } catch (error) {
        console.error("خطأ في جلب العروض اليومية:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyOffers();
  }, []);

    if (loadingNearby) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.section}>
        <DeliveryHeader />
      </View>

      <View style={styles.section}>
        <DeliverySearchBar />
      </View>

      <View style={styles.section}>
        <DeliveryWorkingHours />
      </View>

      <View style={styles.section}>
        <DeliveryBannerSlider />
      </View>

      <View style={styles.section}>
        <DeliveryCategories
              onSelectCategory={(id: string, title: string) =>
            navigation.navigate("CategoryDetails", {
                categoryId: id,

              categoryName: title,
            })
          }
        />
      </View>

  <View>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginVertical: 10 }}>العروض اليومية</Text>
      <FlatList
        data={dailyOffers}
        keyExtractor={(item) => item._id}
        horizontal
        renderItem={({ item }) => (
          <View style={{ marginRight: 10 }}>
            <Text>{item.name}</Text>
            {/* يمكنك إضافة صورة وسعر هنا */}
          </View>
        )}
      />
    </View>

  <View>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginVertical: 10 }}>جديد في منطقتك</Text>
      <FlatList
        data={nearbyNewProducts}
keyExtractor={(item :Product) => item._id}
        horizontal
        renderItem={({ item }) => (
          <View style={{ marginRight: 10 }}>
            <Text>{item.name}</Text>
            {/* يمكنك إضافة صورة وسعر هنا */}
          </View>
        )}
      />
    </View>

      <View style={styles.section}>
        <DeliveryTrending onSelect={(id) => console.log("تم الضغط على:", id)} />
      </View>

    
    </ScrollView>
  );
};

export default DeliveryHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:30,
    backgroundColor: "#FFFFFF", // خلفية ناعمة
  },
  contentContainer: {
    paddingBottom: 40, // مسافة إضافية في نهاية الصفحة
  },
  section: {
    marginBottom: 10, // مسافة بين العناصر
  },

});

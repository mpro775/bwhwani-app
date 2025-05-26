import React from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import MarketSlider from "../../components/market/MarketSlider";
import MarketCategories from "../../components/market/MarketCategories";
import MarketBanner from "../../components/market/MarketBanner";
import LatestProducts from "../../components/market/LatestProducts";
import SpecialOffers from "../../components/market/SpecialOffers";

const MarketHomeScreen = () => {
  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={["#FFFFFF", "#FFFFFF"]} style={styles.background}>
        {/* ✅ Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>السوق المفتوح</Text>
          <TouchableOpacity>
            <Ionicons name="cart-outline" size={24} color="#D84315" />
          </TouchableOpacity>
        </View>

        {/* ✅ Content */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <MarketSlider />
          <MarketCategories />
          <MarketBanner />
          <LatestProducts />
          <SpecialOffers />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  background: { flex: 1 },

  // ✅ Header Styles
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Cairo-Bold",
    color: "#3E2723",
  },
});

export default MarketHomeScreen;

import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MarketSlider from "../components/market/MarketSlider";
import MarketCategories from "../components/market/MarketCategories";
import MarketBanner from "../components/market/MarketBanner";
import LatestProducts from "../components/market/LatestProducts";
import SpecialOffers from "../components/market/SpecialOffers";
import { LinearGradient } from "expo-linear-gradient";

const MarketScreen = () => {
  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={["#FFFFFF", "#FFFFFF"]} style={styles.background}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
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
  scrollContent: { paddingBottom: 40 },
});
export default MarketScreen;

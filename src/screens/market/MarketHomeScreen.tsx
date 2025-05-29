import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import MarketSlider from "../../components/market/MarketSlider";
import MarketCategories from "../../components/market/MarketCategories";
import MarketBanner from "../../components/market/MarketBanner";
import LatestProducts from "../../components/market/LatestProducts";
import SpecialOffers from "../../components/market/SpecialOffers";

const MarketHomeScreen = () => {
  return (
    <SafeAreaView style={styles.safe} edges={['right', 'left']}>
      <LinearGradient colors={["#FFFFFF", "#FFFFFF"]} style={styles.gradient}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
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
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
});

export default MarketHomeScreen;

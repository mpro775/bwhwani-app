import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import DeliveryHeader from "../../components/delivery/DeliveryHeader";
import DeliverySearchBar from "../../components/delivery/DeliverySearchBar";
import DeliveryWorkingHours from "../../components/delivery/DeliveryWorkingHours";
import DeliveryBannerSlider from "../../components/delivery/DeliveryBannerSlider";
import DeliveryCategories from "../../components/delivery/DeliveryCategories";
import DeliveryTrending from "../../components/delivery/DeliveryTrending";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";

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

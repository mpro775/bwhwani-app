import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import DeliveryHeader from "../../components/delivery/DeliveryHeader";
import DeliveryBannerSlider from "../../components/delivery/DeliveryBannerSlider";
import DeliveryCategories from "../../components/delivery/DeliveryCategories";
import DeliveryTrending from "../../components/delivery/DeliveryTrending";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "types/navigation";


type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "BusinessDetails"
>;
const DeliveryHomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  
  return (
    <View style={styles.container}>
      {/* الهيدر ثابت */}
      <View style={styles.stickyHeader}>
        <DeliveryHeader />
      </View>

      {/* باقي المحتوى قابل للتمرير */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <DeliveryBannerSlider />
        </View>

        <View style={styles.section}>
         <DeliveryCategories />

        </View>

        <View style={styles.section}>
         <DeliveryTrending
  onSelect={(store) =>
    navigation.navigate("BusinessDetails", { business: store })
  }/>

        </View>
      </ScrollView>
    </View>
  );
};

export default DeliveryHomeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  stickyHeader: {
    zIndex: 10, // تأكد أنه فوق
    backgroundColor: "#FFFFFF",
    paddingBottom: 6,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingTop: 6, // مساحة تعويضية أسفل الهيدر
  },
  section: {
    marginBottom: 10,
  },
});

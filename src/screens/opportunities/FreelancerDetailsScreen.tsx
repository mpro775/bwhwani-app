// screens/opportunities/FreelancerDetailsScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
  SafeAreaView,
  FlatList,
  Dimensions,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

type Freelancer = {
  id: string;
  name: string;
  service: string;
  governorate: string;
  phone: string;
  description: string;
  portfolio: string[];
  experience: string;
  rating: number;
};

type RouteParams = {
  FreelancerDetails: { freelancer: Freelancer };
};

const { width } = Dimensions.get("window");

const FreelancerDetailsScreen = () => {
  const route = useRoute<RouteProp<RouteParams, "FreelancerDetails">>();
  const { freelancer } = route.params;

  const handleContact = (type: "call" | "whatsapp") => {
    if (type === "call") {
      Linking.openURL(`tel:${freelancer.phone}`);
    } else {
      Linking.openURL(`whatsapp://send?phone=${freelancer.phone}`);
    }
  };

  const renderPortfolioItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.portfolioItem}
      onPress={() => {
        /* Add image preview logic */
      }}
    >
      <Image source={{ uri: item }} style={styles.portfolioImage} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              /* Add navigation go back */
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#D84315" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>تفاصيل المزود</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Profile Section */}
        <LinearGradient colors={["#FFF", "#FFF8F6"]} style={styles.profileCard}>
          <Text style={styles.name}>{freelancer.name}</Text>

          <View style={styles.metaContainer}>
            <View style={styles.chip}>
              <Ionicons name="briefcase" size={14} color="#D84315" />
              <Text style={styles.chipText}>{freelancer.service}</Text>
            </View>
            <View style={styles.chip}>
              <Ionicons name="location" size={14} color="#D84315" />
              <Text style={styles.chipText}>{freelancer.governorate}</Text>
            </View>
          </View>

          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFC107" />
            <Text style={styles.ratingText}>{freelancer.rating}</Text>
            <Text style={styles.experienceText}>
              {freelancer.experience} خبرة
            </Text>
          </View>

          <Text style={styles.description}>{freelancer.description}</Text>
        </LinearGradient>

        {/* Portfolio Section */}
        {freelancer.portfolio?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>معرض الأعمال</Text>
            <FlatList
              horizontal
              data={freelancer.portfolio}
              renderItem={renderPortfolioItem}
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.portfolioList}
            />
          </View>
        )}

        {/* Contact Buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, styles.whatsappButton]}
            onPress={() => handleContact("whatsapp")}
          >
            <Ionicons name="logo-whatsapp" size={24} color="#FFF" />
            <Text style={styles.buttonText}>واتساب</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.callButton]}
            onPress={() => handleContact("call")}
          >
            <Ionicons name="call" size={24} color="#FFF" />
            <Text style={styles.buttonText}>اتصال مباشر</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  container: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 20,
    color: "#333",
  },
  headerRight: {
    width: 40,
  },
  profileCard: {
    padding: 24,
    margin: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  name: {
    fontFamily: "Cairo-Bold",
    fontSize: 24,
    color: "#2C3E50",
    textAlign: "right",
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: "row-reverse",
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#FBE9E7",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 4,
  },
  chipText: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 14,
    color: "#D84315",
  },
  ratingContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  ratingText: {
    fontFamily: "Cairo-Bold",
    fontSize: 16,
    color: "#2C3E50",
  },
  experienceText: {
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  description: {
    fontFamily: "Cairo-Regular",
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    textAlign: "right",
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontFamily: "Cairo-Bold",
    fontSize: 20,
    color: "#2C3E50",
    marginBottom: 16,
    textAlign: "right",
  },
  portfolioList: {
    paddingLeft: 16,
  },
  portfolioItem: {
    marginRight: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  portfolioImage: {
    width: width * 0.6,
    height: 200,
    borderRadius: 12,
  },
  buttonGroup: {
    flexDirection: "row-reverse",
    gap: 16,
    paddingHorizontal: 16,
    marginTop: 32,
  },
  button: {
    flex: 1,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
    elevation: 2,
  },
  whatsappButton: {
    backgroundColor: "#25D366",
  },
  callButton: {
    backgroundColor: "#D84315",
  },
  buttonText: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 16,
    color: "#FFF",
  },
});

export default FreelancerDetailsScreen;

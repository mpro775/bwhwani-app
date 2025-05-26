// screens/LostAndFound/LostAndFoundDetailsScreen.tsx
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types/navigation";

const LostAndFoundDetailsScreen = () => {
  const route =
    useRoute<RouteProp<RootStackParamList, "LostAndFoundDetails">>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { item } = route.params;

  const handleChat = () => {
    navigation.navigate("LostChatScreen", {
      itemId: item.id,
    });
  };

  return (
    <LinearGradient colors={["#FFF", "#FFF8F6"]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#D84315" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>تفاصيل العنصر</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image" size={48} color="#D84315" />
          </View>
        )}

        <View style={styles.detailsCard}>
          <Text style={styles.title}>{item.title}</Text>

          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar" size={18} color="#D84315" />
              <Text style={styles.metaText}>{item.date}</Text>
            </View>

            <View style={styles.metaItem}>
              <Ionicons name="location" size={18} color="#D84315" />
              <Text style={styles.metaText}>{item.location}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>وصف العنصر</Text>
          <Text style={styles.description}>{item.description}</Text>

          <View style={styles.userCard}>
            <Text style={styles.userTitle}>المعلن:</Text>
            <View style={styles.userInfo}>
              <Ionicons name="person" size={20} color="#D84315" />
              <Text style={styles.userName}>
                {item.user?.fullName || "غير معروف"}
              </Text>
              <Text style={styles.userPhone}>
                {item.user?.phoneNumber || "778032532"}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.chatButton}
          onPress={handleChat}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={["#D84315", "#BF360C"]}
            style={styles.gradient}
          >
            <Ionicons name="text" size={24} color="#FFF" />
            <Text style={styles.chatText}>بدء المحادثة</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  headerTitle: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 20,
    color: "#2C3E50",
  },
  content: {
    paddingBottom: 32,
  },
  image: {
    width: "100%",
    height: 280,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  imagePlaceholder: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    margin: 16,
    borderRadius: 16,
  },
  detailsCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  title: {
    fontFamily: "Cairo-Bold",
    fontSize: 24,
    color: "#2C3E50",
    marginBottom: 16,
    textAlign: "right",
  },
  metaContainer: {
    gap: 12,
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
  },
  metaText: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 16,
    color: "#666",
  },
  sectionTitle: {
    fontFamily: "Cairo-Bold",
    fontSize: 18,
    color: "#3E2723",
    marginBottom: 12,
    textAlign: "right",
  },
  description: {
    fontFamily: "Cairo-Regular",
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    textAlign: "right",
    marginBottom: 24,
  },
  userCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  userTitle: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
    textAlign: "right",
  },
  userInfo: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
  },
  userName: {
    fontFamily: "Cairo-Bold",
    fontSize: 16,
    color: "#3E2723",
  },
  userPhone: {
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    color: "#D84315",
  },
  chatButton: {
    borderRadius: 14,
    overflow: "hidden",
    marginHorizontal: 16,
  },
  gradient: {
    flexDirection: "row-reverse",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    gap: 12,
  },
  chatText: {
    fontFamily: "Cairo-Bold",
    fontSize: 18,
    color: "#FFF",
  },
});

export default LostAndFoundDetailsScreen;

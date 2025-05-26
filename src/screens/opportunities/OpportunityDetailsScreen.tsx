import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";

type Opportunity = {
  id: string;
  type: "توظيف" | "خدمة";
  title: string;
  category: string;
  governorate: string;
  requester: string;
  phone: string;
  createdAt: string;
  contractType: string;
  workType: string;
  description: string;
};

type RouteParams = {
  OpportunityDetails: { opportunity: Opportunity };
};

const OpportunityDetailsScreen = () => {
  const route = useRoute<RouteProp<RouteParams, "OpportunityDetails">>();
  const { opportunity } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{opportunity.title}</Text>
        <Text style={styles.item}>نوع: {opportunity.type}</Text>
        <Text style={styles.item}>التصنيف: {opportunity.category}</Text>
        <Text style={styles.item}>المحافظة: {opportunity.governorate}</Text>
        <Text style={styles.item}>نوع العمل: {opportunity.workType}</Text>
        <Text style={styles.item}>نوع العقد: {opportunity.contractType}</Text>
        <Text style={styles.item}>مقدم الطلب: {opportunity.requester}</Text>
        <Text style={styles.item}>
          تاريخ النشر:{" "}
          {new Date(opportunity.createdAt).toLocaleDateString("ar-EG")}
        </Text>

        <Text style={styles.sectionTitle}>تفاصيل إضافية</Text>
        <Text style={styles.description}>{opportunity.description}</Text>

        <TouchableOpacity
          style={styles.phoneButton}
          onPress={() => Linking.openURL(`tel:${opportunity.phone}`)}
        >
          <Text style={styles.phoneText}>📞 التواصل: {opportunity.phone}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: {
    backgroundColor: "#FFF3E0",
    borderRadius: 16,
    padding: 20,
    elevation: 2,
  },
  title: {
    fontFamily: "Cairo-Bold",
    fontSize: 22,
    color: "#3E2723",
    marginBottom: 12,
  },
  item: {
    fontFamily: "Cairo-Regular",
    fontSize: 16,
    marginBottom: 8,
    color: "#555",
  },
  sectionTitle: {
    fontFamily: "Cairo-Bold",
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
    color: "#D84315",
  },
  description: {
    fontFamily: "Cairo-Regular",
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
  },
  phoneButton: {
    backgroundColor: "#D84315",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  phoneText: {
    fontFamily: "Cairo-Bold",
    fontSize: 16,
    color: "#FFF",
  },
});

export default OpportunityDetailsScreen;

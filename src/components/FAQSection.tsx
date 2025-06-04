// components/FAQSection.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

type FAQ = {
  question: string;
  answer: string;
};

const FAQSection: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const res = await axios.get("/api/faqs");
        setFaqs(res.data);
      } catch {
        setFaqs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  if (loading) {
    return <ActivityIndicator style={{ marginVertical: 20 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>الأسئلة الشائعة</Text>
      {faqs.map((faq, index) => (
        <View key={index} style={styles.faqItem}>
          <TouchableOpacity
            style={styles.questionRow}
            onPress={() => toggleExpand(index)}
          >
            <Text style={styles.question}>{faq.question}</Text>
            <Ionicons
              name={expandedIndex === index ? "chevron-up" : "chevron-down"}
              size={20}
              color="#333"
            />
          </TouchableOpacity>
          {expandedIndex === index && (
            <Text style={styles.answer}>{faq.answer}</Text>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  title: {
    fontFamily: "Cairo-Bold",
    fontSize: 20,
    marginBottom: 16,
    color: "#2C3E50",
    textAlign: "right",
  },
  faqItem: {
    backgroundColor: "#FAFAFA",
    borderRadius: 10,
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  questionRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  question: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 16,
    color: "#333",
  },
  answer: {
    fontFamily: "Cairo-Regular",
    fontSize: 15,
    color: "#666",
    marginTop: 10,
    lineHeight: 22,
    textAlign: "right",
  },
});

export default FAQSection;

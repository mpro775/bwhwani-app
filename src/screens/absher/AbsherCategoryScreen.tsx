// screens/AbsherCategoryScreen.tsx
import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "types/navigation";

const categories = [
  { key: "tech", label: "التقنية والبرمجيات" },
  { key: "construction", label: "البناء والتشييد" },
  { key: "hospitality", label: "التموين والضيافة" },
  { key: "legal", label: "القانون والاستشارات" },
  { key: "media", label: "الفنون والإعلام" },
  { key: "cleaning", label: "التنظيف والنقل" },
];

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "AbsherCategory">;

export default function AbsherCategoryScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>اختر مجال الخدمة</Text>
      {categories.map((item) => (
        <TouchableOpacity
          key={item.key}
          style={{ padding: 16, backgroundColor: "#fff", borderRadius: 16, elevation: 2, marginBottom: 12 }}
          onPress={() => navigation.navigate("AbsherForm", { category: item.label })}
        >
          <Text style={{ fontSize: 16, color: "#333" }}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

import React, { useState } from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from "react-native";

const COLORS = {
  primary: "#D84315",
  secondary: "#5D4037",
  background: "#FFF5F2",
  text: "#4E342E",
  accent: "#8B4B47",
};
interface Props {
  // تعريف واجهة Props هنا
  onChange?: (value: string) => void;
}
interface FilterOption {
  id: string;
  label: string;
}

const filters: FilterOption[] = [
  { id: "all", label: "الكل" },
  { id: "favorite", label: "المفضلة" },
  {id: "topRated", label: "الأعلى تقييمًا" },
  { id: "freeDelivery", label: "توصيل مجاني" },
];

const CategoryFiltersBar: React.FC<Props> = ({ onChange }) => {
  const [selected, setSelected] = useState("all");

  const handleSelect = (id: string) => {
    setSelected(id);
    onChange?.(id);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.id}
          onPress={() => handleSelect(filter.id)}
          style={[
            styles.filterButton,
            selected === filter.id && styles.activeFilter,
          ]}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.filterText,
            selected === filter.id && styles.activeText
          ]}>
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 6,
  },
  filterButton: {
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: "#EEE",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  activeFilter: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.accent,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  filterText: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 14,
    color: "#666",
    letterSpacing: 0.2,
  },
  activeText: {
    color: "#FFF",
    fontFamily: "Cairo-Bold",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default CategoryFiltersBar;
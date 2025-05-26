import React, { useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from "react-native";

const COLORS = {
  primary: "#D84315",
  secondary: "#5D4037",
  background: "#FFF5F2",
  text: "#4E342E",
  accent: "#8B4B47",
};

interface Props {
  // تعريف واجهة Props هنا
  subCategories: string[];
  onSelect?: (value: string) => void;
}

const SubCategoriesSlider: React.FC<Props> = ({ subCategories, onSelect }) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    setSelected(value === selected ? null : value);
    onSelect?.(value);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {subCategories.map((title) => (
        <TouchableOpacity
          key={title}
          onPress={() => handleSelect(title)}
          style={[
            styles.item,
            selected === title && styles.itemSelected,
            { transform: [{ scale: selected === title ? 1.05 : 1 }] },
          ]}
          activeOpacity={0.8}
        >
          <Text
            style={[styles.text, selected === title && styles.textSelected]}
          >
            {title}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  item: {
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: "#EEE",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  itemSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.accent,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  text: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 14,
    color: "#666",
    letterSpacing: 0.2,
  },
  textSelected: {
    color: "#FFF",
    fontFamily: "Cairo-Bold",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default SubCategoriesSlider;

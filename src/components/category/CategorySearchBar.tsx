import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

const CategorySearchBar: React.FC<Props> = ({
  placeholder = "...ابحث",
  value,
  onChangeText,
}) => {
  return (
    <View style={styles.container}>
      <Ionicons
        name="search-outline"
        size={20}
        color="#888"
        style={styles.icon}
      />
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
        placeholderTextColor="#aaa"
      />
    </View>
  );
};

export default CategorySearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2, // ظل للأندرويد
  },
  icon: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    textAlign: "right",
    fontFamily: "Cairo-Regular",
  },
});

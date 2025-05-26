import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  primary: "#D84315",
  secondary: "#5D4037",
  text: "#4E342E",
};

const DeliverySearchBar = () => {
  return (
    <View style={styles.container}>
      <Ionicons
        name="search"
        size={18}
        color="#888"
        style={styles.searchIcon}
      />
      <TextInput
        placeholder="البحث..."
        placeholderTextColor="#999"
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#EEE",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2, // ظل للأندرويد
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    color: COLORS.text,
    paddingVertical: 0,
    includeFontPadding: false,
  },
});

export default DeliverySearchBar;

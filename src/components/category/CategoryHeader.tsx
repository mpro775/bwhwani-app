import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  primary: "#D84315",
  secondary: "#5D4037",
  background: "#FFF5F2",
  text: "#4E342E",
  accent: "#8B4B47",
};

interface Props {
  location: string;
  onSharePress?: () => void;
  onLocationPress?: () => void;
}

const CategoryHeader: React.FC<Props> = ({
  location,
  onSharePress,
  onLocationPress,
}) => {
  return (
    <View style={styles.container}>
      {/* زر الموقع */}
      <TouchableOpacity
        onPress={onLocationPress}
        style={styles.locationContainer}
        activeOpacity={0.8}
      >
        <Ionicons
          name="location-sharp"
          size={20}
          color={COLORS.primary}
          style={styles.locationIcon}
        />
        <View style={styles.textContainer}>
          <Text style={styles.deliveryLabel}>التوصيل إلى</Text>
          <Text style={styles.locationText}>{location}</Text>
        </View>
      </TouchableOpacity>

      {/* زر المشاركة */}
      <TouchableOpacity
        onPress={onSharePress}
        style={styles.shareButton}
        activeOpacity={0.7}
      >
        <Ionicons name="share-social" size={24} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  locationContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    flex: 1,
    marginEnd: 12,
  },
  locationIcon: {
    marginStart: 8,
  },
  textContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  deliveryLabel: {
    fontFamily: "Cairo-Regular",
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
  },
  locationText: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 16,
    color: COLORS.primary,
    lineHeight: 24,
  },
  shareButton: {
    backgroundColor: "#FFF0EB",
    borderRadius: 12,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CategoryHeader;

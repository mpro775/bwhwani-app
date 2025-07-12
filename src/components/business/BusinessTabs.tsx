import React from "react";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import COLORS from "constants/colors";

interface Props {
  categories: string[];
  selected: string;
  onSelect: (tab: string) => void;
}

const BusinessTabs: React.FC<Props> = ({ categories, selected, onSelect }) => {
  return (
    <View style={styles.outerWrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.container}
      >
        {categories.map((cat) => {
          const isActive = cat === selected;
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => onSelect(cat)}
              activeOpacity={0.86}
              style={[styles.tab, isActive && styles.tabActive]}
            >
              {isActive ? (
                <LinearGradient
                  colors={["#FFF7F2", "#FFE0D7", "#FFD3C0"]}
                  style={styles.gradient}
                  start={{ x: 0.7, y: 0 }}
                  end={{ x: 0, y: 1 }}
                >
                  <Text style={styles.textActive}>{cat}</Text>
                </LinearGradient>
              ) : (
                <Text style={styles.text}>{cat}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerWrap: {
    paddingBottom: 8,
    paddingTop: 6,
    backgroundColor: COLORS.background,
  },
  container: {
    // لا تضع margin أفقي هنا كي لا يتقطع الشريط
  },
  scrollContent: {
    paddingHorizontal: 10,
    flexDirection: "row-reverse",
    gap: 9,
    minHeight: 53,
  },
  tab: {
    borderRadius: 23,
    overflow: "hidden",
    marginHorizontal: 0,
    backgroundColor: "#FFF",
    borderWidth: 1.2,
    borderColor: COLORS.blue,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 9,
    elevation: 2,
    minWidth: 65,
  },
  tabActive: {
    borderColor: COLORS.primary,
    elevation: 7,
    shadowOpacity: 0.15,
    shadowColor: COLORS.primary,
  },
  gradient: {
    paddingVertical: 12,
    paddingHorizontal: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 15,
    fontFamily: "Cairo-SemiBold",
    color: COLORS.text,
    paddingVertical: 12,
    paddingHorizontal: 26,
    textAlign: "center",
  },
  textActive: {
    fontSize: 15.5,
    fontFamily: "Cairo-Bold",
    color: COLORS.primary,
    textAlign: "center",
    letterSpacing: 0.2,
  },
});

export default BusinessTabs;

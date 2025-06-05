// screens/AbsherCategoryScreen.tsx
import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "types/navigation";
import { MaterialIcons } from "@expo/vector-icons";
import COLORS from "constants/colors";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 12;
const NUM_COLUMNS = 2;
const CARD_WIDTH = (width - CARD_MARGIN * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

const categories = [
  {
    key: "tech",
    label: "التقنية والبرمجيات",
    icon: "computer",
  },
  {
    key: "construction",
    label: "البناء والتشييد",
    icon: "construction",
  },
  {
    key: "hospitality",
    label: "التموين والضيافة",
    icon: "restaurant",
  },
  {
    key: "legal",
    label: "القانون والاستشارات",
    icon: "gavel",
  },
  {
    key: "media",
    label: "الفنون والإعلام",
    icon: "movie",
  },
  {
    key: "cleaning",
    label: "التنظيف والنقل",
    icon: "local-shipping",
  },
];

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "AbsherCategory"
>;

export default function AbsherCategoryScreen() {
  const navigation = useNavigation<NavigationProp>();

  // Animated values: one per item
  const animValues = useRef(categories.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Staggered fade-in animation on mount
    Animated.stagger(
      100,
      animValues.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        })
      )
    ).start();
  }, []);

  const renderItem = ({
    item,
    index,
  }: {
    item: typeof categories[0];
    index: number;
  }) => {
    const fadeAnim = animValues[index];

    return (
      <Animated.View
        style={[
          styles.cardContainer,
          { opacity: fadeAnim, transform: [{ scale: fadeAnim }] },
        ]}
      >
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate("AbsherForm", { category: item.label })
          }
        >
          <MaterialIcons
            name={item.icon as any}
            size={32}
            color={COLORS.primary}
            style={styles.icon}
          />
          <Text style={styles.cardText}>{item.label}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>اختر مجال الخدمة</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: CARD_MARGIN,
    paddingTop: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: "Cairo-Bold",
    color: COLORS.primary,
    marginBottom: 16,
    textAlign: "right",
  },
  listContainer: {
    paddingBottom: 24,
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginHorizontal: CARD_MARGIN / 2,
    marginBottom: CARD_MARGIN,
  },
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    // Android shadow
    elevation: 3,
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  icon: {
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    fontFamily: "Cairo-Regular",
    color: COLORS.text,
    textAlign: "center",
  },
});

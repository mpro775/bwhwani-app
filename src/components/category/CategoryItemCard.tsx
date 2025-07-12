import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import COLORS from "constants/colors";

// تعريف نوع العنصر
interface Item {
  id: string;
  title: string;
  subtitle: string;
  distance: string;
  time: string;
  rating: number;
  isOpen: boolean;
  isFavorite: boolean;
  tags: string[];
  image: any;
  logo: any;
}

// تعريف Props للكومبوننت
interface Props {
  item: Item;
  onPress?: (id: string) => void;
  showStatus?: boolean;
}

const CategoryItemCardSimple: React.FC<Props> = ({
  item,
  onPress,
  showStatus = true,
}) => {
  const [isFavorite, setIsFavorite] = useState(item.isFavorite);

  const handleFavoritePress = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(item.id)}
      activeOpacity={0.9}
    >
      {/* شعار المتجر */}
      <View style={styles.logoContainer}>
        <Image source={item.logo} style={styles.logo} />

        {/* التقييم */}
        <View style={styles.rating}>
          <Ionicons name="star" size={12} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
        </View>
      </View>

      {/* تفاصيل المتجر */}
      <View style={styles.detailsContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>

          <TouchableOpacity
            onPress={handleFavoritePress}
            style={styles.heartButton}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={20}
              color={isFavorite ? COLORS.danger : COLORS.gray}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle} numberOfLines={1}>
          {item.subtitle}
        </Text>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="location-outline" size={14} color={COLORS.blue} />
            <Text style={styles.infoText}>{item.distance}</Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={14} color={COLORS.blue} />
            <Text style={styles.infoText}>{item.time}</Text>
          </View>
        </View>

        {/* العلامات */}
        <View style={styles.tagsContainer}>
          {item.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* حالة المتجر */}
      {showStatus && (
        <View
          style={[
            styles.statusBadge,
            item.isOpen ? styles.openBadge : styles.closedBadge,
          ]}
        >
          <View style={styles.statusIndicator} />
          <Text style={styles.statusText}>
            {item.isOpen ? "مفتوح" : "مغلق"}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CategoryItemCardSimple;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.background,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    position: "relative",
    overflow: "hidden",
  },
  logoContainer: {
    position: "relative",
    marginRight: 16,
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  rating: {
    position: "absolute",
    bottom: -6,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    fontFamily: "Cairo-SemiBold",
    color: COLORS.lightText,
  },
  detailsContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontFamily: "Cairo-Bold",
    color: COLORS.primary,
    flex: 1,
    marginRight: 8,
  },
  heartButton: {
    padding: 4,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Cairo-Regular",
    color: COLORS.blue,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  infoText: {
    fontSize: 12,
    fontFamily: "Cairo-SemiBold",
    color: COLORS.blue,
    marginLeft: 4,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: "#00000",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 11,
    fontFamily: "Cairo-Regular",
    color: COLORS.blue,
  },
  statusBadge: {
    position: "absolute",
    top: 16,
    left: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  openBadge: {
    backgroundColor: "rgba(76, 153, 240, 0.37)",
  },
  closedBadge: {
    backgroundColor: "rgba(247, 37, 133, 0.2)",
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Cairo-SemiBold",
  },
});

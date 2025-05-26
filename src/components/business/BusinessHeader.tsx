import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
interface Props {
  image: any; // صورة الغلاف بصيغة require
  onBackPress?: () => void;
  onSharePress?: () => void;
  onFavoritePress?: () => void;
}

const COLORS = {
  primary: "#D84315",
  secondary: "#5D4037",
  accent: "#8B4B47",
  white: "#FFFFFF",
};

const BusinessHeader: React.FC<Props> = ({
  image,
  onBackPress,
  onSharePress,
  onFavoritePress,
}) => {
  return (
    <View style={styles.container}>
      {/* صورة الغلاف مع طبقة تدرج لوني */}
      <Image source={image} style={styles.coverImage} />
      <View style={styles.gradientOverlay} />

      {/* شريط التحكم العلوي */}
      <View style={styles.controlBar}>
        {/* زر العودة */}
        <TouchableOpacity
          onPress={onBackPress}
          style={styles.controlButton}
          activeOpacity={0.8}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={COLORS.white}
            style={styles.buttonIcon}
          />
        </TouchableOpacity>

        {/* أزرار الجانب الأيمن */}
        <View style={styles.rightActions}>
          <TouchableOpacity
            onPress={onFavoritePress}
            style={[styles.controlButton, styles.actionButton]}
            activeOpacity={0.7}
          >
            <Ionicons
              name="heart-outline"
              size={22}
              color={COLORS.white}
              style={styles.buttonIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onSharePress}
            style={[styles.controlButton, styles.actionButton]}
            activeOpacity={0.7}
          >
            <Ionicons
              name="share-social"
              size={22}
              color={COLORS.white}
              style={styles.buttonIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  coverImage: {
    width: "100%",
    height: 280,
    resizeMode: "cover",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.15)",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  controlBar: {
    position: "absolute",
    top: 48,
    left: 24,
    right: 24,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  controlButton: {
    backgroundColor: "rgba(255,255,255,0.15)",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  rightActions: {
    flexDirection: "row-reverse",
    gap: 16,
  },
  actionButton: {
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  buttonIcon: {
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default BusinessHeader;

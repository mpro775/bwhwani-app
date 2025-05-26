import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { addFavorite, removeFavorite, isFavorite } from "../../utils/favoratStorage";
import { getUserProfile } from "../../storage/userStorage";
import { FavoriteItem } from "../../types/types";

const { width } = Dimensions.get("window");

const COLORS = {
  primary: "#D84315",
  secondary: "#5D4037",
  background: "#FFFFFF",
  text: "#3E2723",
  accent: "#8B4B47",
  tagBg: "#F5F5F5",
  green: "#4CAF50",
};
type FavoriteType = 'restaurant' | 'product' | 'service' | 'haraj';
const type: FavoriteType = 'restaurant'; // 🔐 النوع مضبوط هنا

interface Item {
  id: string;
  title: string;
  subtitle: string;
  distance: string;
  time: string;
  rating: number;
  isOpen: boolean;
      schedule?: ScheduleItem[];

  isFavorite:boolean;
  tags: string[];
  image: any;
  logo: any;
}


interface Props {
  item: Item;
  onPress?: (id: string) => void;
}

interface ScheduleItem {
  day: string;
  open: boolean;
  from: string;
  to: string;
}

const CategoryItemCard: React.FC<Props> = ({ item, onPress }) => {
  console.log("📦 البطاقة:", item.title, item.distance, item.time);

 const [liked, setLiked] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // تحميل بيانات المستخدم والتحقق من المفضلة
  useEffect(() => {
    const load = async () => {
      const user = await getUserProfile();
      if (user?.id) {
        setUserId(user.id);
    const isFav = await isFavorite(item.id, "restaurant");

        setLiked(isFav);
      }
    };
    load();
  }, [item.id]);

  const handleFavoriteToggle = async () => {
    if (!userId) return;

const favItem: FavoriteItem = {
  id: item.id,
  type,
  title: item.title,
  userId,
  addedAt: new Date().toISOString(),
};

    if (liked) {
      await removeFavorite(favItem);
    } else {
      await addFavorite(favItem);
    }
    setLiked(!liked);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress?.(item.id)}>
      <Image source={item.image} style={styles.mainImage} />

      {/* زر المفضلة */}
   
      <TouchableOpacity style={styles.heartBtn} onPress={handleFavoriteToggle}>
        <Ionicons
          name={liked ? "heart" : "heart-outline"}
          size={20}
          color={liked ? "#D84315" : "#000"}
        />
      </TouchableOpacity>

      {/* المسافة والمدة */}
      <View style={styles.topOverlay}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>دقيقة {item.time}</Text>
          <MaterialCommunityIcons
            name="clock-outline"
            size={14}
            color="#D84315"
          />
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.distance} كم</Text>
          <MaterialCommunityIcons name="map-marker" size={14} color="#D84315" />
        </View>
      </View>

      {/* حالة المطعم + الشعار */}
      <View style={styles.statusContainer}>
        <View style={styles.openStatus}>
          <Text style={styles.openText}>{item.isOpen ? "مفتوح" : "مغلق"}</Text>
        </View>
        <Image source={item.logo} style={styles.logo} />
      </View>

      {/* التفاصيل */}
      <View style={styles.details}>
        <Text style={styles.englishTitle}>- {item.title}</Text>
        <Text style={styles.arabicTitle}>{item.subtitle}</Text>
        <View style={styles.tagsRow}>
          <Text style={styles.tagsText}>{item.tags.join("، ")}</Text>
        </View>
        <View style={styles.ratingRow}>
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Ionicons name="star" size={14} color="#FFC107" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CategoryItemCard;

const styles = StyleSheet.create({
  card: {
    width: width - 32,
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 3,
  },
  mainImage: {
    width: "100%",
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  heartBtn: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 6,
    elevation: 2,
  },
  topOverlay: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row-reverse",
    gap: 6,
  },
  badge: {
    backgroundColor: "#fff",
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    elevation: 1,
  },
  badgeText: {
    fontSize: 12,
    color: "#D84315",
    fontFamily: "Cairo-Regular",
    marginLeft: 4,
  },
  statusContainer: {
    position: "absolute",
    top: 120,
    right: 10,
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  openStatus: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 4,
  },
  openText: {
    fontSize: 12,
    color: "#fff",
    fontFamily: "Cairo-Bold",
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginLeft: 4,
  },
  details: {
    padding: 12,
  },
  englishTitle: {
    fontSize: 13,
    fontFamily: "Cairo-SemiBold",
    color: "#222",
  },
  arabicTitle: {
    fontSize: 15,
    fontFamily: "Cairo-Bold",
    color: "#000",
    marginBottom: 4,
  },
  tagsRow: {
    flexDirection: "row-reverse",
    marginBottom: 4,
  },
  tagsText: {
    fontSize: 12,
    fontFamily: "Cairo-Regular",
    color: "#777",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontFamily: "Cairo-Bold",
    color: "#000",
  },
});

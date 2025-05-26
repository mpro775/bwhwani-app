import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Animated,
  RefreshControl,
  SafeAreaView
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FavoriteItem, FavoriteType } from "../types/types";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { getUserProfile } from "../storage/userStorage";
import { Swipeable } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";

const FAVORITES_KEY = "user_favorites";

export const MyFavoritesScreen = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const loadFavorites = async () => {
    setRefreshing(true);
    try {
      const user = await getUserProfile();
      if (!user?.id) return;
      setUserId(user.id);

      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      const parsed: FavoriteItem[] = stored ? JSON.parse(stored) : [];
      const userFavorites = parsed.filter((item) => item.userId === user.id);
      
      setFavorites(userFavorites);
      
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } finally {
      setRefreshing(false);
    }
  };

  const removeFavorite = async (id: string, type: FavoriteItem["type"]) => {
    const updated = favorites.filter((item) => !(item.id === id && item.type === type));
    setFavorites(updated);
    
    const all = await AsyncStorage.getItem(FAVORITES_KEY);
    if (all) {
      const parsed: FavoriteItem[] = JSON.parse(all);
      const newStorage = parsed.filter((item) => 
        !(item.id === id && item.type === type && item.userId === userId)
      );
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newStorage));
    }
  };

const filteredByType = (type: FavoriteType) => {
  return favorites.filter((item) => item.type === type);
};

  const renderRightActions = (onDelete: () => void) => {
    return (
      <TouchableOpacity
        style={styles.deleteBox}
        onPress={onDelete}
      >
        <MaterialIcons name="delete" size={24} color="white" />
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }: { item: FavoriteItem }) => (
    <Swipeable
      renderRightActions={() => renderRightActions(() => removeFavorite(item.id, item.type))}
    >
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <View style={styles.itemContent}>
          {item.image && (
            <Image source={{ uri: item.image }} style={styles.itemImage} />
          )}
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemType}>{getTypeName(item.type)}</Text>
          </View>
        </View>
        <TouchableOpacity 
          onPress={() => removeFavorite(item.id, item.type)}
          style={styles.deleteButton}
        >
          <Ionicons name="heart" size={20} color="#FF5252" />
        </TouchableOpacity>
      </Animated.View>
    </Swipeable>
  );

  const getTypeName = (type: FavoriteItem["type"]) => {
    switch(type) {
      case 'restaurant': return 'مطعم';
      case 'product': return 'منتج';
      case 'haraj': return 'حراج';
      case 'service': return 'خدمة';
      default: return type;
    }
  };

  const renderSection = (title: string, data: FavoriteItem[]) => {
    if (data.length === 0) return null;

    return (
      <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <View style={styles.sectionCount}>
            <Text style={styles.countText}>{data.length}</Text>
          </View>
        </View>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </Animated.View>
    );
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#6A1B9A', '#9C27B0']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.headerTitle}>قائمة المفضلة</Text>
      </LinearGradient>

      <FlatList
        contentContainerStyle={styles.contentContainer}
        data={[
          { type: 'restaurant', title: 'المطاعم المفضلة' },
          { type: 'product', title: 'المنتجات المفضلة' },
          { type: 'haraj', title: 'الحراج المفضل' },
          { type: 'service', title: 'مقدمو الخدمات المفضلون' },
        ]}
        keyExtractor={(item) => item.type}
renderItem={({ item }) =>
  renderSection(item.title, filteredByType(item.type as "restaurant" | "product" | "service" | "haraj"))
}        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={loadFavorites}
            colors={['#6A1B9A']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-dislike" size={60} color="#E0E0E0" />
            <Text style={styles.emptyText}>لا توجد عناصر في المفضلة</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
    fontFamily: "Cairo-Bold",
  },
  sectionCount: {
    backgroundColor: '#6A1B9A',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    color: '#212121',
    fontFamily: "Cairo-Regular",
    marginBottom: 4,
  },
  itemType: {
    fontSize: 12,
    color: '#757575',
    fontFamily: "Cairo-Regular",
  },
  deleteButton: {
    padding: 8,
  },
  deleteBox: {
    backgroundColor: '#D32F2F',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: '80%',
    borderRadius: 10,
    marginTop: 8,
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#9E9E9E',
    marginTop: 16,
    fontFamily: "Cairo-Regular",
  },
});

export default MyFavoritesScreen;
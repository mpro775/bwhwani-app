import COLORS from "constants/colors";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  FlatList,
} from "react-native";
import { API_URL } from "utils/api/config";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "types/navigation";

interface Category {
  _id: string;
  name: string;
  image: string;
  // Optional for children, if you prefer fetching with API:
  children?: Category[];
}
interface Props {
  onSelectCategory?: (categoryId: string, title: string) => void;
  sectionTitle?: string;
}
const customRoutes = {
  "شي ان": "SheinScreen",
  "وصل لي": "WasliScreen",
  فزعة: "FazaaScreen",
} as const;
const DeliveryCategories: React.FC<Props> = ({
  onSelectCategory,
  sectionTitle = "الفئات",
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch(`${API_URL}/delivery/categories`);
      const data = await res.json();
      // فلترة الرئيسية فقط
      const main = data.filter(
        (cat: any) => !cat.parent || cat.parent === null
      );
      setCategories(main);
      setLoading(false); // ← هنا الحل
    };

    fetchCategories();
  }, []);

  const fetchSubCategories = async (parentId: string) => {
    try {
      const res = await fetch(
        `${API_URL}/delivery/categories/children/${parentId}`
      );
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("فشل في تحميل الفئات الفرعية", error);
      return [];
    }
  };
  // 1. عرف handleCategoryPress خارج المودال (للاستخدام في كل مكان)
  const handleCategoryPress = async (category: Category) => {
    const route = customRoutes[category.name as keyof typeof customRoutes];
    if (route) {
      navigation.navigate(route as any);
      setShowAll(false);
      setShowSubModal(false);
      return;
    }
    const subs = await fetchSubCategories(category._id);
    if (subs.length > 0) {
      setSubCategories(subs);
      setShowSubModal(true);
    } else {
      navigation.navigate("CategoryDetails", {
        categoryId: category._id,
        categoryName: category.name,
      });
      setShowAll(false);
      setShowSubModal(false);
    }
  };

  // تجهيز مصفوفة العناصر مع زر عرض الكل في النهاية
  const categoriesWithShowAll = [
    ...categories.slice(0, 5),
    { _id: "showAll", name: "عرض الكل", image: "", isShowAll: true },
  ];

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={categoriesWithShowAll}
        numColumns={3}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) =>
          "isShowAll" in item ? (
            <TouchableOpacity
              style={[styles.gridCard, styles.showAllSliderCard]}
              onPress={() => setShowAll(true)}
              activeOpacity={0.9}
            >
              <View style={[styles.imageCircle, styles.showAllCircle]}>
                <Text style={styles.showAllIcon}>+</Text>
              </View>
              <Text style={styles.sliderText}>عرض الكل</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.gridCard}
              onPress={() => handleCategoryPress(item)}
              activeOpacity={0.9}
            >
              <View style={styles.imageCircle}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.sliderImage}
                />
              </View>
              <Text style={styles.sliderText}>{item.name}</Text>
            </TouchableOpacity>
          )
        }
        contentContainerStyle={styles.gridContent}
        scrollEnabled={false}
      />
      <Modal visible={showSubModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>الفئات الفرعية</Text>
            <FlatList
              data={subCategories}
              numColumns={3}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalCategoryCard}
                  onPress={() => handleCategoryPress(item)}
                >
                  <Image source={{ uri: item.image }} style={styles.image} />
                  <Text style={styles.text}>{item.name}</Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={{
                paddingBottom: 16,
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
              }}
            />
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setShowSubModal(false)}
            >
              <Text style={styles.closeBtnText}>إغلاق</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* مودال عرض الكل */}
      <Modal visible={showAll} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>كل الفئات</Text>
            <FlatList
              data={categories}
              numColumns={3}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalCategoryCard}
                  onPress={() => handleCategoryPress(item)}
                >
                  <Image source={{ uri: item.image }} style={styles.image} />
                  <Text style={styles.text}>{item.name}</Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={{
                paddingBottom: 16,
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
              }}
            />

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setShowAll(false)}
            >
              <Text style={styles.closeBtnText}>إغلاق</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DeliveryCategories;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14, // زيادة البادينغ الجانبي لتقليل التداخل
    paddingVertical: 4, // زيادة طفيفة للراحة
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 12,
    color: COLORS.blue,
    fontFamily: "Cairo-Bold",
    textAlign: "right",
    marginBottom: 20,
  },
  gridContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 1,
  },
  gridCard: {
    width: 100, // كان 65
    alignItems: "center",
    justifyContent: "flex-start",
    marginHorizontal: 5, // كان 8
    marginVertical: 5, // كان 8
    backgroundColor: "#fffdfb",
    borderRadius: 20, // كان 16
    paddingVertical: 6, // كان 6
    paddingHorizontal: 4, // كان 2
    elevation: 1, // كان 0
  },
  imageCircle: {
    width: 80, // كان 48
    height: 80, // كان 48
    borderRadius: 40,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.6, // كان 1.2
    borderColor: COLORS.blue,
  },
  sliderImage: {
    width: 60, // كان 32
    height: 60, // كان 32
    borderRadius: 22,
    resizeMode: "contain",
  },
  sliderText: {
    fontSize: 14, // كان 11
    color: COLORS.blue,
    fontFamily: "Cairo-Regular",
    textAlign: "center",
  },
  showAllSliderCard: {
    backgroundColor: COLORS.primary,
  },
  showAllCircle: {
    backgroundColor: "#fff",
    borderColor: COLORS.primary,
  },
  showAllIcon: {
    color: COLORS.blue,
    fontSize: 18, // تصغير الأيقونة
    fontFamily: "Cairo-Bold",
    marginTop: -2,
  },
  image: {
    width: 35,
    height: 35,
    marginBottom: 2,
    resizeMode: "contain",
  },

  text: {
    fontSize: 12,
    color: COLORS.blue,
    fontFamily: "Cairo-Regular",
    textAlign: "center",
    marginTop: 2,
  },

  loader: {
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 14,
    width: "90%",
    maxHeight: "85%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Cairo-Bold",
    color: COLORS.primary,
    marginBottom: 12,
    alignSelf: "flex-start",
  },

  modalCategoryCard: {
    width: 85,
    alignItems: "center",
    justifyContent: "center",
    margin: 6,
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: "#fdfdfd",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: COLORS.blue,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1.5,
  },

  closeBtn: {
    marginTop: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 32,
  },
  closeBtnText: {
    color: "#fff",
    fontFamily: "Cairo-Bold",
    fontSize: 15,
  },
});

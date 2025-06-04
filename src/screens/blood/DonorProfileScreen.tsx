import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { getUserProfile } from "../../storage/userStorage";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { updateUserProfile } from "../../storage/userStorage";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { UserProfile } from "../../types/types";
import { deleteBloodData } from "api/bloodApi";

type Nav = NativeStackNavigationProp<RootStackParamList>;
const DonorProfileScreen = () => {
  const [donor, setDonor] = useState<any>(null);
  const navigation = useNavigation<Nav>();

const handleDelete = async () => {
  Alert.alert("تأكيد الحذف", "هل أنت متأكد أنك تريد حذف بياناتك كمتبرع؟", [
    { text: "إلغاء", style: "cancel" },
    {
      text: "حذف",
      style: "destructive",
      onPress: async () => {
        try {
          await deleteBloodData();
          Alert.alert("✅ تم الحذف", "تم حذف بياناتك كمتبرع بالدم.");
          navigation.goBack();
        } catch (err) {
          Alert.alert("خطأ", "حدثت مشكلة أثناء حذف البيانات.");
        }
      },
    },
  ]);
};
  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await getUserProfile();
        if (user?.bloodData) {
          setDonor(user.bloodData);
        } else {
          Alert.alert("لا توجد بيانات", "يرجى التسجيل كمتبرع أولاً.");
        }
      } catch (error) {
        Alert.alert("خطأ", "حدث خطأ أثناء تحميل البيانات.");
      }
    };

    loadData();
  }, []);

  if (!donor) return null;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>ملف المتبرع</Text>

      <Info label="الاسم الكامل" value={donor.name} />
      <Info label="العمر" value={donor.age} />
      <Info label="الجنس" value={donor.gender} />
      <Info label="فصيلة الدم" value={donor.bloodType} />
      <Info label="المحافظة" value={donor.governorate} />
      <Info label="العنوان" value={donor.address} />
      <Info label="رقم الهاتف" value={donor.showPhone ? donor.phone : "مخفي"} />
      <Info label="الجاهزية" value={donor.status} />
      <Info label="وقت التوفر" value={donor.availableTime} />
      {donor.lastDonation ? (
        <Info label="آخر تبرع" value={donor.lastDonation} />
      ) : null}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate("BecomeDonor")}
      >
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <MaterialIcons name="delete" size={20} color="#fff" />
          <Text style={styles.editText}>حذف بيانات التبرع</Text>
        </TouchableOpacity>

        <MaterialIcons name="edit" size={20} color="#fff" />
        <Text style={styles.editText}>تعديل بيانات التبرع</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const Info = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF", padding: 20 },
  title: {
    fontSize: 22,
    fontFamily: "Cairo-Bold",
    marginBottom: 20,
    color: "#D84315",
    textAlign: "center",
  },
  deleteButton: {
    backgroundColor: "#B71C1C",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  editButton: {
    backgroundColor: "#D84315",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
  },
  editText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
    fontFamily: "Cairo-Bold",
  },

  infoRow: {
    marginBottom: 12,
    backgroundColor: "#FFF3E0",
    borderRadius: 10,
    padding: 14,
  },
  label: {
    fontFamily: "Cairo-SemiBold",
    color: "#5D4037",
    marginBottom: 4,
  },
  value: {
    fontFamily: "Cairo-Regular",
    fontSize: 16,
    color: "#333",
  },
});

export default DonorProfileScreen;

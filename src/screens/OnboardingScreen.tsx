import React from "react";
import Onboarding from "react-native-onboarding-swiper";
import { Text, TouchableOpacity, StyleSheet, View, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import LottieView from "lottie-react-native"; // استيراد Lottie

// استبدل هذا النوع بنوع الملاحة لديك
import { RootStackParamList } from "types/navigation";

// ألوان التطبيق
const COLORS = {
  primary: "#D84315",
  text: "#1A3052",
  background: "#FFFFFF",
};

// زر "Done" مخصص
const Done = ({ ...props }) => (
  <TouchableOpacity style={{ marginHorizontal: 10 }} {...props}>
    <Text style={{ fontFamily: "Cairo-Bold", fontSize: 16, color: COLORS.primary }}>
      ابدأ
    </Text>
  </TouchableOpacity>
);

const { width, height } = Dimensions.get("window");

const OnboardingScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleDone = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    navigation.reset({
      index: 0,
      routes: [{ name: "MainApp" }],
    });
  };

  // دالة مساعدة لإنشاء نص عربي
  const ArabicText = (
    text: string,
    size = 18,
    weight: "bold" | "normal" = "normal"
  ) => (
    <Text
      style={{
        fontSize: size,
        fontFamily: weight === "bold" ? "Cairo-Bold" : "Cairo-Regular",
        color: COLORS.text,
        textAlign: "center",
        paddingHorizontal: 20,
      }}
    >
      {text}
    </Text>
  );

  return (
    <Onboarding
      onDone={handleDone}
      onSkip={handleDone}
      bottomBarColor={COLORS.background}
      bottomBarHeight={200}
      nextLabel={
        <Text style={{ fontFamily: "Cairo-Bold", color: COLORS.primary, marginBottom: 30 }}>
          التالي
        </Text>
      }
      skipLabel={<Text style={{ fontFamily: "Cairo-Bold", color: "#999" }}>تخطي</Text>}
      DoneButtonComponent={Done}
      titleStyles={{
        fontFamily: "Cairo-Bold",
        fontSize: 22,
        color: COLORS.primary,
      }}
      subTitleStyles={{
        fontFamily: "Cairo-Regular",
        fontSize: 16,
        color: COLORS.text,
      }}
      containerStyles={{ direction: "rtl" }} // لدعم RTL
      pages={[
        {
          backgroundColor: COLORS.background,
          image: (
            <View style={styles.lottieContainer}>
              <LottieView
                source={require("../../assets/animations/onboarding1.json")}
                autoPlay
                loop
                style={styles.lottie}
              />
            </View>
          ),
          title: ArabicText("مرحبًا بك في بثواني", 24, "bold"),
          subtitle: ArabicText("تطبيق شامل للسوق، التوصيل، المفقودات والمزيد..."),
        },
        {
          backgroundColor: COLORS.background,
          image: (
            <View style={styles.lottieContainer}>
              <LottieView
                source={require("../../assets/animations/onboarding2.json")}
                autoPlay
                loop
                style={styles.lottie}
              />
            </View>
          ),
          title: ArabicText("اطلب وتابع بثواني", 24, "bold"),
          subtitle: ArabicText("منتجات، عروض، توصيل سريع حسب موقعك."),
        },
        {
          backgroundColor: COLORS.background,
          image: (
            <View style={styles.lottieContainer}>
              <LottieView
                source={require("../../assets/animations/onboarding3.json")}
                autoPlay
                loop
                style={styles.lottie}
              />
            </View>
          ),
          title: ArabicText("جاهز لتجربتنا؟", 24, "bold"),
          subtitle: ArabicText("سجل وابدأ الآن!"),
        },
      ]}
    />
  );
};

// أنماط خاصة بمحاذاة وحجم Lottie
const styles = StyleSheet.create({
  lottieContainer: {
    width: width * 0.8,
    height: height * 0.4,
    alignSelf: "center",
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
});

export default OnboardingScreen;

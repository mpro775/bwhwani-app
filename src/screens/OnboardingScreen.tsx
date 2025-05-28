import React from "react";
import Onboarding from "react-native-onboarding-swiper";
import { Image, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// ألوان التطبيق
const COLORS = {
  primary: "#D84315",
  text: "#4E342E",
  background: "#FFFFFF",
};

const Done = ({ ...props }) => (
  <TouchableOpacity style={{ marginHorizontal: 10 }} {...props}>
    <Text style={{ fontFamily: "Cairo-Bold", fontSize: 16, color: "#D84315" }}>
      ابدأ
    </Text>
  </TouchableOpacity>
);

const OnboardingScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const handleDone = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    navigation.reset({
      index: 0,
      routes: [{ name: "MainApp" }],
    });
  };

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
      nextLabel={
        <Text style={{ fontFamily: "Cairo-Bold", color: "#D84315" }}>
          التالي
        </Text>
      }
      skipLabel={
        <Text style={{ fontFamily: "Cairo-Bold", color: "#999" }}>تخطي</Text>
      }
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
      controlStatusBar={false}
      containerStyles={{ direction: "rtl" }} // لدعم RTL
      pages={[
        {
          backgroundColor: COLORS.background,
          image: (
            <Image
              source={require("../../assets/onboarding.png")}
              style={{ width: 300, height: 300, resizeMode: "contain" }}
            />
          ),
          title: ArabicText("مرحبًا بك في بثواني", 24, "bold"),
          subtitle: ArabicText(
            "تطبيق شامل للسوق، التوصيل، المفقودات والمزيد..."
          ),
        },
        {
          backgroundColor: COLORS.background,
          image: (
            <Image
              source={require("../../assets/onboarding.png")}
              style={{ width: 300, height: 300, resizeMode: "contain" }}
            />
          ),
          title: ArabicText("اطلب وتابع بثواني", 24, "bold"),
          subtitle: ArabicText("منتجات، عروض، توصيل سريع حسب موقعك."),
        },
        {
          backgroundColor: COLORS.background,
          image: (
            <Image
              source={require("../../assets/onboarding.png")}
              style={{ width: 300, height: 300, resizeMode: "contain" }}
            />
          ),
          title: ArabicText("جاهز لتجربتنا؟", 24, "bold"),
          subtitle: ArabicText("سجل وابدأ الآن!"),
        },
      ]}
    />
  );
};

export default OnboardingScreen;

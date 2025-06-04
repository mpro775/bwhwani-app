import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import LottieView from "lottie-react-native";

const { width, height } = Dimensions.get("window");

export default function TestLottie() {
  return (
    <View style={styles.container}>
      <Text>اختبار لوتي:</Text>
      <LottieView
        source={require("../../assets/animations/onboarding1.json")}
        autoPlay
        loop
        style={{ width: width * 0.8, height: height * 0.4 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});

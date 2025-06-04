import React, { useRef, useEffect, useState } from "react";
import {
  Animated,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { getUserProfile } from "../storage/userStorage";

const DynamicFAB = () => {
  type Nav = NativeStackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<Nav>();
  const route = useRoute();
  const pan = useRef(new Animated.ValueXY({ x: 20, y: 500 })).current;
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    getUserProfile().then((profile) => {
    //   setUserRole(profile?.role || null);
    });
  }, []);

  const screenName = route.name;
  let isVisible = false;
  let icon: keyof typeof Ionicons.glyphMap = "add";
  let onPress = () => {};

  switch (screenName) {
    case "DeliveryHome":
      isVisible = true;
      icon = "cart";
      onPress = () => navigation.navigate("CartScreen");
      break;
    case "BloodTypes":
      isVisible = true;
      icon = "water";
      onPress = () => navigation.navigate("BecomeDonor");
      break;
    case "LostAndFound":
      isVisible = true;
      icon = "add-circle";
      onPress = () => navigation.navigate("AddLostItemScreen");
      break;
  }


  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.extractOffset();
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;

  return isVisible ? (
    <Animated.View
      style={[styles.buttonContainer, pan.getLayout()]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
        <Ionicons name={icon} size={24} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
  ) : null;
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    zIndex: 1000,
  },
  button: {
    backgroundColor: "#D84315",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});

export default DynamicFAB;

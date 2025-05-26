import React, { useRef } from "react";
import {
  Animated,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCart } from "../context/CartContext"; // تأكد من المسار الصحيح


const FloatingCartButton = ({ itemCount = 0 }: { itemCount?: number }) => {
  type Nav = NativeStackNavigationProp<RootStackParamList>;
  
  const navigation = useNavigation<Nav>();
    const { totalQuantity } = useCart(); // استخدام الهوك لاستلام عدد العناصر

  const pan = useRef(new Animated.ValueXY({ x: 20, y: 500 })).current;

    const handlePress = () => {
    navigation.navigate("CartScreen"); // تأكد من أن "CartScreen" مسجلة في النافيجيشن
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
       onPanResponderGrant: () => {
        pan.extractOffset(); // ✅ بديل pan.setOffset({ x: ..., y: ... })
      },
      
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;

  return (
    <Animated.View
      style={[styles.buttonContainer, pan.getLayout()]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Ionicons name="cart" size={24} color="#fff" />
        {totalQuantity > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{totalQuantity}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
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
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#FFC107",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  badgeText: {
    color: "#3E2723",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default FloatingCartButton;

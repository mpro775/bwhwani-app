import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

const FoundDetailsScreen = ({ route, navigation }: any) => {
  const { item } = route.params;

  return (
    <View style={styles.container}>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.image} />
      )}
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.meta}>
          📍 {item.governorate} • 🕒 {item.date}
        </Text>
        <Text style={styles.description}>{item.description}</Text>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => navigation.navigate("FoundChat", { item })}
        >
          <Text style={styles.chatText}>💬 التواصل بشأن هذا الشيء</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF"},
  image: { width: "100%", height: 250 },
  content: { padding: 20 },
  title: {
    fontSize: 22,
    fontFamily: "Cairo-Bold",
    color: "#3E2723",
    marginBottom: 6,
  },
  meta: {
    fontSize: 14,
    fontFamily: "Cairo-Regular",
    color: "#999",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    fontFamily: "Cairo-Regular",
    color: "#444",
    marginBottom: 20,
  },
  chatButton: {
    backgroundColor: "#D84315",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  chatText: {
    color: "#FFF",
    fontFamily: "Cairo-Bold",
    fontSize: 16,
  },
});

export default FoundDetailsScreen;

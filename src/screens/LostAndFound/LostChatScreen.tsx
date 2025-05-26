import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const LostChatScreen = ({ route }: any) => {
  const { itemId } = route.params; // رقم المفقود المرتبط بالمحادثة

  const [messages, setMessages] = useState([
    { id: "1", text: "مرحبًا، هل لا زال مفقود؟", sender: "user" },
    { id: "2", text: "نعم، لم أجد شيئًا حتى الآن", sender: "owner" },
  ]);

  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = {
      id: Date.now().toString(),
      text: input,
      sender: "user", // لاحقًا يمكن ربطها بهوية المستخدم
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  const renderMessage = ({ item }: any) => (
    <View
      style={[
        styles.message,
        item.sender === "user" ? styles.right : styles.left,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatArea}
      />

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="اكتب رسالة..."
          value={input}
          onChangeText={setInput}
          style={styles.input}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="send" size={22} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  chatArea: {
    padding: 16,
    paddingBottom: 100,
  },
  message: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  right: {
    alignSelf: "flex-end",
    backgroundColor: "#D84315",
  },
  left: {
    alignSelf: "flex-start",
    backgroundColor: "#EEE",
  },
  messageText: {
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  input: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    marginHorizontal: 8,
  },
  sendButton: {
    backgroundColor: "#D84315",
    padding: 10,
    borderRadius: 20,
  },
});

export default LostChatScreen;

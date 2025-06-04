import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import axiosInstance from "utils/api/axiosInstance";

const FoundChatScreen = ({ route }: any) => {
  const { item } = route.params;
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  const fetchMessages = async () => {
  const res = await axiosInstance.get(`/api/messages/${item._id}`);
  setMessages(res.data);
};

const sendMessage = async () => {
  if (!input.trim()) return;
  const token = await AsyncStorage.getItem("firebase-token");
  const message = {
    text: input,
    itemId: item._id,
  };

    const res = await axiosInstance.post("/api/messages", message, {
    headers: { Authorization: `Bearer ${token}` },
  });
    setMessages((prev) => [...prev, res.data]);
  setInput("");

  };
  useEffect(() => {
  fetchMessages();
}, []);
  const renderItem = ({ item }: any) => (
    <View
      style={[
        styles.messageBubble,
        item.fromUser ? styles.userBubble : styles.otherBubble,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>التواصل بشأن: {item.title}</Text>

      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={styles.chatList}
      />

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="اكتب رسالتك..."
          style={styles.input}
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendText}>إرسال</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    marginTop: 10,
    marginBottom: 70,
  },
  header: {
    fontSize: 18,
    fontFamily: "Cairo-Bold",
    color: "#D84315",
    padding: 16,
    textAlign: "center",
  },
  chatList: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 12,
    marginVertical: 6,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#D84315",
  },
  otherBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#EEE",
  },
  messageText: {
    fontFamily: "Cairo-Regular",
    color: "#FFF",
  },
  inputContainer: {
    flexDirection: "row-reverse",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    backgroundColor: "#FFF",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    marginLeft: 8,
  },
  sendButton: {
    backgroundColor: "#D84315",
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: "center",
  },
  sendText: {
    color: "#FFF",
    fontFamily: "Cairo-Bold",
  },
});

export default FoundChatScreen;

import React, { useState, useEffect, useRef } from "react";
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
import { io } from "socket.io-client";


// إعداد الاتصال بـ Socket
const socket = io("https://bthwani-backend.onrender.com", {
  transports: ["websocket"],
});
type Message = {
  id: string;
  text: string;
  sender: "user" | "owner";
  time?: string;
};

const LostChatScreen = ({ route }: any) => {
  const { itemId } = route.params; // رقم المفقود المرتبط بالمحادثة
const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
const flatListRef = useRef<FlatList<Message>>(null);

useEffect(() => {
  const fetchMessages = async () => {
    try {
      const res = await fetch(`https://bthwani-backend.onrender.com/api/messages/lost/${itemId}`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("فشل تحميل الرسائل:", err);
    }
  };

  fetchMessages();
}, [itemId]);

  useEffect(() => {
    socket.emit("join", { roomId: `lost-${itemId}` });

    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    });

    return () => {
      socket.emit("leave", { roomId: `lost-${itemId}` });
      socket.off("message");
    };
  }, [itemId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSend = () => {
    if (!input.trim()) return;
const msg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user", // يمكن ربطه بـ userId لاحقًا
      time: new Date().toISOString(),
    };

    socket.emit("message", { roomId: `lost-${itemId}`, message: msg });
    setMessages((prev) => [...prev, msg]);
    setInput("");
    scrollToBottom();
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
        ref={flatListRef}
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

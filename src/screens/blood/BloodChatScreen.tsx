// screens/blood/BloodChatScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity,
  KeyboardAvoidingView, Platform, SafeAreaView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { fetchBloodMessages, sendBloodMessage } from "../../api/bloodApi";
import { fetchUserProfile } from "../../api/userApi";

const BloodChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { requestId }: any = route.params;
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const load = async () => {
      const user = await fetchUserProfile();
      setUserId(user.id);
      const msgs = await fetchBloodMessages(requestId);
      setMessages(msgs);
    };
    load();
  }, [requestId]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    const newMessage = await sendBloodMessage(requestId, text);
    setMessages(prev => [...prev, newMessage]);
    setText("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#D84315" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>محادثة المتبرع</Text>
        <View style={styles.headerIconPlaceholder} />
      </View>

      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.messagesContainer}
          renderItem={({ item }) => (
            <View style={[styles.messageContainer, item.senderId === userId && styles.myMessageContainer]}>
              <View style={[styles.messageBubble, item.senderId === userId ? styles.myMessage : styles.theirMessage]}>
                <Text style={styles.messageText}>{item.text}</Text>
                <Text style={styles.messageTime}>{new Date(item.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
              </View>
            </View>
          )}
        />

        <View style={styles.inputContainer}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="اكتب رسالتك..."
            placeholderTextColor="#999"
            style={styles.input}
            multiline
          />
          <TouchableOpacity
            onPress={sendMessage}
            style={[styles.sendButton, !!text && styles.activeSendButton]}
            disabled={!text}
          >
            <Ionicons name="send" size={20} color={!!text ? "#FFF" : "#D84315"} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 18,
    color: "#333",
  },
  headerIconPlaceholder: {
    width: 40,
  },
  container: {
    flex: 1,
  },
  messagesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageContainer: {
    marginBottom: 16,
    flexDirection: "row-reverse",
  },
  myMessageContainer: {
    justifyContent: "flex-end",
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  myMessage: {
    backgroundColor: "#D84315",
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    backgroundColor: "#FFF",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  messageText: {
    fontFamily: "Cairo-Regular",
    fontSize: 15,
    color: "#FFF",
    lineHeight: 22,
  },
  theirMessageText: {
    color: "#333",
  },
  messageTime: {
    fontFamily: "Cairo-Regular",
    fontSize: 10,
    color: "rgba(255,255,255,0.7)",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  theirMessageTime: {
    color: "#999",
  },
  inputContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  input: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontFamily: "Cairo-Regular",
    fontSize: 15,
    color: "#333",
    maxHeight: 120,
    textAlignVertical: "top",
  },
  sendButton: {
    backgroundColor: "rgba(216, 67, 21, 0.3)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  activeSendButton: {
    backgroundColor: "#D84315",
  },
});

export default BloodChatScreen;
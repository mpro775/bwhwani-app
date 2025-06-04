import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  Animated,
  SafeAreaView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { format } from "date-fns";
import axiosInstance from "utils/api/axiosInstance";

type Message = {
  id: string;
  text: string;
  sender: "user" | "owner";
  time: Date;
  read?: boolean;
};

type BookingDetails = {
  id: string;
  title: string;
  image: string;
  ownerName: string;
  ownerAvatar: string;
};

export default function BookingChatScreen() {
  const route = useRoute();
  const { bookingId } = route.params as { bookingId: string };
  const flatListRef = useRef<FlatList>(null);
  const [inputHeight, setInputHeight] = useState(40);
  const fadeAnim = useState(new Animated.Value(0))[0];
const [userId, setUserId] = useState<string>("");

  // بيانات وهمية للحجز
  const [booking, setBooking] = useState<BookingDetails>({
    id: bookingId,
    title: "قاعة أفراح الهناء",
    image: "https://source.unsplash.com/random/600x400/?wedding",
    ownerName: "محمد أحمد",
    ownerAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "مرحبًا، هل لا يزال الحجز متاح اليوم؟",
      sender: "user",
      time: new Date(Date.now() - 3600000),
      read: true,
    },
    {
      id: "2",
      text: "مرحبًا بك، نعم متاح من الساعة 4 إلى 8 مساءً.",
      sender: "owner",
      time: new Date(Date.now() - 1800000),
    },
    {
      id: "3",
      text: "هل يمكن الحجز لمدة 3 ساعات؟ وما هي التكلفة الإضافية؟",
      sender: "user",
      time: new Date(Date.now() - 1200000),
      read: true,
    },
    {
      id: "4",
      text: "نعم، التكلفة الإضافية 10,000 ريال لكل ساعة بعد الساعتين المدرجتين في السعر الأساسي.",
      sender: "owner",
      time: new Date(Date.now() - 600000),
    },
  ]);

  const [input, setInput] = useState("");

  useEffect(() => {
  const loadMessages = async () => {
    try {
      const { data } = await axiosInstance.get(`/bookings/${booking.id}/messages`);
      const formatted = data.map((msg: any) => ({
        id: msg._id,
        text: msg.text,
        sender: msg.sender === userId ? "user" : "owner",
        time: new Date(msg.createdAt),
        read: msg.read,
      }));
      setMessages(formatted.reverse());
    } catch (err) {
      console.error("فشل تحميل الرسائل:", err);
    }
  };

  loadMessages();
}, [booking.id]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

const sendMessage = async () => {
  if (!input.trim()) return;

  const newMsg: Message = {
    id: Date.now().toString(), // مؤقتًا حتى يعود ID من السيرفر
    text: input,
    sender: "user",
    time: new Date(),
  };

  setMessages((prev) => [newMsg, ...prev]);
  setInput("");

  try {
    const { data } = await axiosInstance.post(`/bookings/${booking.id}/messages`, {
      text: input,
    });

    // تحديث ID بناءً على السيرفر إن أردت:
    // newMsg.id = data._id;
  } catch (err) {
    console.error("فشل إرسال الرسالة:", err);
  }
};


  const formatTime = (date: Date) => {
    return format(date, "h:mm a") 
  };

  const formatDateHeader = (date: Date) => {
    return format(date, "EEEE, d MMMM");
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const showDateHeader = index === messages.length - 1 || 
      formatDateHeader(item.time) !== formatDateHeader(messages[index + 1].time);

    return (
      <View>
        {showDateHeader && (
          <View style={styles.dateHeader}>
            <Text style={styles.dateHeaderText}>
              {formatDateHeader(item.time)}
            </Text>
          </View>
        )}
        
        <View
          style={[
            styles.messageBubble,
            item.sender === "user"
              ? styles.userBubble
              : styles.ownerBubble,
          ]}
        >
          {item.sender === "owner" && (
            <Image
              source={{ uri: booking.ownerAvatar }}
              style={styles.avatar}
            />
          )}
          
          <View style={styles.messageContent}>
            <Text
              style={[
                styles.messageText,
                item.sender === "user" ? styles.userText : styles.ownerText,
              ]}
            >
              {item.text}
            </Text>
            <View style={styles.messageFooter}>
              <Text
                style={[
                  styles.messageTime,
                  item.sender === "user" ? styles.userTime : styles.ownerTime,
                ]}
              >
                {formatTime(item.time)}
              </Text>
              {item.sender === "user" && (
                <Ionicons
                  name={item.read ? "checkmark-done" : "checkmark"}
                  size={14}
                  color={item.read ? "#4CAF50" : "#9E9E9E"}
                  style={styles.readIcon}
                />
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#D84315", "#5D4037"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <Image
            source={{ uri: booking.ownerAvatar }}
            style={styles.headerAvatar}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{booking.ownerName}</Text>
            <Text style={styles.headerSubtitle}>{booking.title}</Text>
          </View>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="information-circle" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesContainer}
          inverted
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToOffset({ offset: 0 })}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.inputContainer}
        >
          <TouchableOpacity style={styles.attachmentButton}>
            <Ionicons name="attach" size={24} color="#D84315" />
          </TouchableOpacity>
          
          <TextInput
            style={[styles.input, { height: Math.max(40, inputHeight) }]}
            placeholder="اكتب رسالتك..."
            placeholderTextColor="#9E9E9E"
            value={input}
            onChangeText={setInput}
            multiline
            onContentSizeChange={(e) =>
              setInputHeight(e.nativeEvent.contentSize.height)
            }
          />
          
          <TouchableOpacity
            style={styles.sendButton}
            onPress={sendMessage}
            disabled={!input.trim()}
          >
            <Ionicons
              name="send"
              size={20}
              color={input.trim() ? "white" : "#BDBDBD"}
            />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  headerInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
  },
  headerButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  messagesContainer: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  dateHeader: {
    alignSelf: "center",
    backgroundColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginVertical: 8,
  },
  dateHeaderText: {
    fontSize: 12,
    color: "#424242",
  },
  messageBubble: {
    flexDirection: "row",
    maxWidth: "80%",
    marginVertical: 4,
    alignItems: "flex-end",
  },
  userBubble: {
    alignSelf: "flex-end",
    justifyContent: "flex-end",
  },
  ownerBubble: {
    alignSelf: "flex-start",
    justifyContent: "flex-start",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageContent: {
    flex: 1,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    padding: 12,
    borderRadius: 16,
  },
  userText: {
    color: "white",
    backgroundColor: "#D84315",
    borderTopRightRadius: 0,
  },
  ownerText: {
    color: "#212121",
    backgroundColor: "#EEEEEE",
    borderTopLeftRadius: 0,
  },
  messageFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    paddingHorizontal: 8,
  },
  messageTime: {
    fontSize: 11,
  },
  userTime: {
    color: "#E0E0E0",
    textAlign: "right",
  },
  ownerTime: {
    color: "#757575",
    textAlign: "left",
  },
  readIcon: {
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "white",
  },
  attachmentButton: {
    padding: 8,
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 15,
    maxHeight: 120,
    textAlignVertical: "center",
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#D84315",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});
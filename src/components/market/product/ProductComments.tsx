// components/ProductComments.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../../constants/colors";
import { ProductComment } from "../../../types/product"; // Import the type

interface ProductCommentsProps {
  comments: ProductComment[];
    currentUID: string | null;

}

const ProductComments: React.FC<ProductCommentsProps> = ({ comments ,currentUID}) => {
  // You might want to add state for the new comment text and a function to send it
  const [newComment, setNewComment] = React.useState<string>("");

 const handleSendComment = async () => {
  if (!currentUID) {
    Alert.alert("عذرًا", "يجب تسجيل الدخول لإضافة تعليق");
    return;
  }

  if (newComment.trim()) {
    // send comment logic
    console.log("Sending comment:", newComment);
    setNewComment("");
  }
};


  return (
    <View style={styles.section}>
      <View style={styles.commentsHeader}>
        <Text style={styles.sectionTitle}>
          التعليقات ({comments.length})
        </Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>عرض الكل</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.commentInputContainer}>
        <TextInput
          placeholder="أضف تعليقك..."
          placeholderTextColor="#999"
          style={styles.commentInput}
          multiline
          textAlign="right"
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendComment}>
          <Ionicons name="send" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
{comments.slice(0, 2).map((comment, index) => (
  <View key={index} style={styles.commentItem}>
    <Text style={styles.commentUser}>{comment.user.name}</Text>
    <Text style={styles.commentText}>{comment.content}</Text>
  </View>
))} 
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontFamily: "Cairo-Bold",
    fontSize: 20,
    color: COLORS.text,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
    paddingBottom: 12,
    marginBottom: 16,
    textAlign: "right",
  },
  commentsHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seeAll: {
    fontFamily: "Cairo-SemiBold",
    color: COLORS.secondary,
    fontSize: 14,
  },
  commentInputContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 14,
    textAlign: "right",
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    minHeight: 50,
  },
  sendButton: {
    padding: 10,
  },
  commentItem: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  commentUser: {
    fontFamily: "Cairo-SemiBold",
    color: COLORS.text,
    fontSize: 14,
    marginBottom: 4,
    textAlign: "right",
  },
  commentText: {
    fontFamily: "Cairo-Regular",
    color: "#666",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "right",
  },
});

export default ProductComments;
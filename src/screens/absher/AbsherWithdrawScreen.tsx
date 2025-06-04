// screens/AbsherWithdrawScreen.tsx
import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import axios from "axios";

export default function AbsherWithdrawScreen() {
  const [requestId, setRequestId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async () => {
    setLoading(true);
    try {
      const res = await axios.post("https://yourapi.com/absher/provider/withdraw", {
        requestId,
      }, {
        headers: { Authorization: "Bearer token" },
      });
      Alert.alert("تم السحب", res.data.message);
    } catch (error) {
      Alert.alert("فشل في السحب", "تأكد من صحة المعرف وبياناتك");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>سحب الأرباح للطلب</Text>
      <TextInput
        placeholder="معرف الطلب"
        value={requestId}
        onChangeText={setRequestId}
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 8, marginBottom: 12 }}
      />
      <Button title={loading ? "...جارٍ السحب" : "سحب المبلغ"} onPress={handleWithdraw} disabled={loading} />
    </View>
  );
}

import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, Button, Alert, ActivityIndicator } from "react-native";
import axios from "axios";

export default function AbsherProviderScreen() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);
  const [responseText, setResponseText] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchAssignedRequests = async () => {
    try {
      const res = await axios.get("https://yourapi.com/absher/provider/assigned", {
        headers: { Authorization: "Bearer token" },
      });
      setRequests(res.data.requests);
    } catch (err) {
      console.log("فشل في تحميل الطلبات المعينة");
    } finally {
      setLoading(false);
    }
  };

  const submitResponse = async () => {
    if (!selectedId || !responseText) return;
    try {
      await axios.patch("https://yourapi.com/absher/provider/respond", {
        requestId: selectedId,
        response: responseText,
        fee: 100, // مثال ثابت يمكن تغييره بمدخل
      }, {
        headers: { Authorization: "Bearer token" },
      });
      Alert.alert("تم الرد بنجاح");
      setResponseText("");
      setSelectedId(null);
      fetchAssignedRequests();
    } catch (err) {
      Alert.alert("خطأ", "فشل في إرسال الرد");
    }
  };

  useEffect(() => {
    fetchAssignedRequests();
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  return (
    <FlatList
      style={{ padding: 16 }}
      data={requests}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={{ backgroundColor: "#fff", padding: 16, borderRadius: 12, marginBottom: 12 }}>
          <Text style={{ fontWeight: "bold" }}>الطلب: {item.category}</Text>
          <Text>تفاصيل: {item.details}</Text>
          <Text>الموقع: {item.location}</Text>
          <Text>الحالة: {item.status}</Text>
          {selectedId === item._id ? (
            <>
              <TextInput
                placeholder="ردك أو عرضك"
                value={responseText}
                onChangeText={setResponseText}
                style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, marginTop: 10, marginBottom: 10 }}
              />
              <Button title="إرسال الرد" onPress={submitResponse} />
            </>
          ) : (
            <Button title="الرد على الطلب" onPress={() => setSelectedId(item._id)} />
          )}
        </View>
      )}
    />
  );
}

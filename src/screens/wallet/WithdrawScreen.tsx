import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axiosInstance from 'utils/api/axiosInstance';

const WithdrawScreen = () => {
  const [amount, setAmount] = useState('');
  const [accountInfo, setAccountInfo] = useState('');

  const requestWithdrawal = async () => {
    try {
      await axiosInstance.post('/wallet/withdraw-request', {
        amount: Number(amount),
        accountInfo,
        method: "agent"
      });
      Alert.alert("تم إرسال طلبك للإدارة للمراجعة");
      setAmount('');
      setAccountInfo('');
    } catch (err:any) {
      Alert.alert("حدث خطأ", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>المبلغ المطلوب سحبه</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={amount} onChangeText={setAmount} />

      <Text style={styles.label}>تفاصيل الحساب / الوكيل</Text>
      <TextInput style={styles.input} value={accountInfo} onChangeText={setAccountInfo} />

      <Button title="طلب سحب" onPress={requestWithdrawal} />
    </View>
  );
};

export default WithdrawScreen;

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 8 },
  label: { marginBottom: 5 }
});

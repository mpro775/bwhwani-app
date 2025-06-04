import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type RootStackParamList = {
  TransactionDetails: { transaction: any }; // يمكنك لاحقًا تعريف النوع بدقة
};

type Props = {
  route: RouteProp<RootStackParamList, 'TransactionDetails'>;
  navigation: StackNavigationProp<RootStackParamList, 'TransactionDetails'>;
};
const TransactionDetailsScreen: React.FC<Props> = ({ route }) => {
  const { transaction } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>تفاصيل المعاملة</Text>
      <Text>النوع: {transaction.type}</Text>
      <Text>الطريقة: {transaction.method}</Text>
      <Text>المبلغ: {transaction.amount} YER</Text>
      <Text>الوصف: {transaction.description}</Text>
      <Text>التاريخ: {new Date(transaction.date).toLocaleString()}</Text>
      {transaction.bankRef && <Text>رقم المرجع البنكي: {transaction.bankRef}</Text>}
    </View>
  );
};

export default TransactionDetailsScreen;

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, marginBottom: 10 }
});

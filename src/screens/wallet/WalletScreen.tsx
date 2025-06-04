import { chargeViaKuraimi, getWallet } from 'api/wallet.api';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Modal, TextInput, StyleSheet } from 'react-native';

type wallet={
    balance:number,
description:string;
type:string;
amount:number;
}
const WalletScreen = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [scustId, setScustId] = useState('');
  const [pinpass, setPinpass] = useState('');

  const fetchWallet = async () => {
    const res = await getWallet();
    setBalance(res.balance);
    setTransactions(res.transactions || []);
  };

  const handleTopUp = async () => {
    await chargeViaKuraimi({ amount: Number(amount), SCustID: scustId, PINPASS: pinpass });
    setModalVisible(false);
    fetchWallet();
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.balance}>رصيدك الحالي: {balance} YER</Text>

      <Button title="شحن المحفظة" onPress={() => setModalVisible(true)} />

      <FlatList
        data={transactions}
        keyExtractor={(item:any, index) => index.toString()}
        renderItem={({ item }) => (
          <Text>{item.description} - {item.amount} - {item.type}</Text>
        )}
        // onPress={() => navigation.navigate('TransactionDetails', { transaction: item })}

      />

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modal}>
          <Text>شحن المحفظة عبر الكريمي</Text>
          <TextInput placeholder="SCustID" value={scustId} onChangeText={setScustId} style={styles.input} />
          <TextInput placeholder="PINPASS" value={pinpass} onChangeText={setPinpass} secureTextEntry style={styles.input} />
          <TextInput placeholder="المبلغ" value={amount} onChangeText={setAmount} keyboardType="numeric" style={styles.input} />
          <Button title="شحن الآن" onPress={handleTopUp} />
          <Text>📈 التوفير الذكي: {scustId} ريال</Text>

          <Button title="إلغاء" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

export default WalletScreen;

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  balance: { fontSize: 22, marginBottom: 20 },
  modal: { padding: 20, marginTop: 100 },
  input: { borderWidth: 1, marginBottom: 10, padding: 8 }
});

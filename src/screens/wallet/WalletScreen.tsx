// screens/WalletScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Modal,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { chargeViaKuraimi, getWallet } from "api/wallet.api";
import COLORS from "constants/colors";

type WalletTransaction = {
  balance: number;
  description: string;
  type: string;
  amount: number;
};

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 40; // عرض البطاقة مع حواف 20 على الجانبين

const WalletScreen = () => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState("");
  const [scustId, setScustId] = useState("");
  const [pinpass, setPinpass] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchWallet = async () => {
    try {
      setFetching(true);
      const res = await getWallet();
      setBalance(res.balance);
      setTransactions(res.transactions || []);
    } catch (err) {
      console.log("Error fetching wallet:", err);
    } finally {
      setFetching(false);
    }
  };

  const handleTopUp = async () => {
    if (!scustId.trim() || !pinpass.trim() || !amount.trim()) {
      return Alert.alert("تنبيه", "الرجاء إدخال كافة البيانات");
    }

    setLoading(true);
    try {
      await chargeViaKuraimi({
        amount: Number(amount),
        SCustID: scustId,
        PINPASS: pinpass,
      });
      setModalVisible(false);
      setScustId("");
      setPinpass("");
      setAmount("");
      fetchWallet();
    } catch (err: any) {
      Alert.alert(
        "خطأ",
        err.response?.data?.message || "فشل في شحن المحفظة"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const renderTransaction = ({ item }: { item: WalletTransaction }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionRow}>
        <Text style={styles.transactionLabel}>📌 الوصف:</Text>
        <Text style={styles.transactionValue}>{item.description}</Text>
      </View>
      <View style={styles.transactionRow}>
        <Text style={styles.transactionLabel}>💲 المبلغ:</Text>
        <Text style={styles.transactionValue}>{item.amount} YER</Text>
      </View>
      <View style={styles.transactionRow}>
        <Text style={styles.transactionLabel}>📑 النوع:</Text>
        <Text style={styles.transactionValue}>{item.type}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>محفظتي</Text>

      {fetching ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        <>
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceText}>
              رصيدك الحالي: {balance} YER
            </Text>

            <TouchableOpacity
              style={styles.topUpButton}
              onPress={() => setModalVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.topUpButtonText}>شحن المحفظة</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>سجل المعاملات</Text>
          {transactions.length === 0 ? (
            <Text style={styles.emptyText}>لا توجد معاملات بعد</Text>
          ) : (
            <FlatList
              data={transactions}
              keyExtractor={(_, index) => index.toString()}
              renderItem={renderTransaction}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>شحن المحفظة عبر الكريمي</Text>
            <TextInput
              style={styles.input}
              placeholder="SCustID"
              placeholderTextColor={COLORS.lightText}
              value={scustId}
              onChangeText={setScustId}
            />
            <TextInput
              style={styles.input}
              placeholder="PINPASS"
              placeholderTextColor={COLORS.lightText}
              value={pinpass}
              onChangeText={setPinpass}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="المبلغ"
              placeholderTextColor={COLORS.lightText}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />

            <TouchableOpacity
              onPress={handleTopUp}
              style={[styles.modalButton, loading && { opacity: 0.7 }]}
              disabled={loading}
              activeOpacity={0.7}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.modalButtonText}>شحن الآن</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={[styles.modalButton, styles.cancelButton]}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default WalletScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontFamily: "Cairo-Regular",
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  balanceContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceText: {
    fontSize: 20,
    fontFamily: "Cairo-Regular",
    color: COLORS.blue,
    marginBottom: 15,
    textAlign: "center",
  },
  topUpButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  topUpButtonText: {
    fontSize: 16,
    fontFamily: "Cairo-Regular",
    color: "#fff",
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Cairo-Regular",
    color: COLORS.text,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "Cairo-Regular",
    color: COLORS.lightText,
    textAlign: "center",
    marginTop: 20,
  },
  transactionCard: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  transactionLabel: {
    fontSize: 16,
    fontFamily: "Cairo-Regular",
    color: COLORS.text,
    width: 100,
  },
  transactionValue: {
    fontSize: 16,
    fontFamily: "Cairo-Regular",
    color: COLORS.primary,
    flex: 1,
    flexWrap: "wrap",
  },

  // مودال شحن المحفظة
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width - 40,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalHeader: {
    fontSize: 20,
    fontFamily: "Cairo-Regular",
    color: COLORS.primary,
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.lightText,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: "Cairo-Regular",
    color: COLORS.text,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 16,
    fontFamily: "Cairo-Regular",
    color: "#fff",
  },
  cancelButton: {
    backgroundColor: COLORS.lightGray,
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: "Cairo-Regular",
    color: COLORS.text,
  },
});

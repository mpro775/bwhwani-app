import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import React, { useState } from "react";
import { TextInput } from "react-native";
import { toast } from "sonner";

const MAX_ALLOWED_AMOUNT = 100000;

const PlaceBidForm = ({ productId }: { productId: string }) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBid = async () => {
    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("يرجى إدخال مبلغ صالح للمزايدة");
      return;
    }

    if (numericAmount > MAX_ALLOWED_AMOUNT) {
      toast.error(`لا يمكن أن تتجاوز المزايدة ${MAX_ALLOWED_AMOUNT.toLocaleString()} ﷼`);
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("firebase-token");

      const res = await fetch(`/market/products/${productId}/bid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: numericAmount }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "فشل تقديم المزايدة");

      toast.success("تم تقديم المزايدة بنجاح");
      setAmount("");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 items-center mt-4">
<TextInput
  keyboardType="numeric"
  placeholder="أدخل مبلغ المزايدة"
  value={amount}
  onChangeText={setAmount} // لا حاجة للتحويل النوعي هنا
  editable={!loading}
/>
      <Button onClick={handleBid} disabled={loading || !amount}>
        {loading ? "جاري التقديم..." : "قدّم مزايدة"}
      </Button>
    </div>
  );
};

export default PlaceBidForm;

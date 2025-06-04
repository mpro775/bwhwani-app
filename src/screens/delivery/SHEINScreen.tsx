import React from "react";
import { WebView } from "react-native-webview";
import { Alert } from "react-native";
import axiosInstance from "utils/api/axiosInstance";

const SHEINScreen = () => {
  const injectedJS = `
    document.addEventListener('click', function(e) {
      if (e.target && e.target.innerText.includes("Add to Bag")) {
        const name = document.querySelector(".product-intro__head-name")?.innerText;
        const price = document.querySelector(".product-intro__head-price .normal")?.innerText.replace(/[^\d]/g, '');
        const image = document.querySelector(".product-intro__cover img")?.src;
        const url = window.location.href;

        window.ReactNativeWebView.postMessage(JSON.stringify({
          name, price: Number(price), image, sheinUrl: url, quantity: 1
        }));
      }
    }, true);
  `;

  const handleMessage = async (event: any) => {
    const data = JSON.parse(event.nativeEvent.data);
    try {
      await axiosInstance.post("/shein/cart/add", data);
      Alert.alert("✅ تم الإضافة", "تم حفظ المنتج في السلة الخاصة بك.");
    } catch (err) {
      Alert.alert("❌ خطأ", "فشل في إضافة المنتج.");
    }
  };

  return (
    <WebView
      source={{ uri: "https://www.shein.com/" }}
      injectedJavaScript={injectedJS}
      onMessage={handleMessage}
    />
  );
};

export default SHEINScreen;

// screens/SHEINScreen.tsx
import { useCart } from "context/CartContextShein";
import React from "react";
import { View, Alert, StyleSheet, I18nManager } from "react-native";
import { WebView } from "react-native-webview";
import axiosInstance from "utils/api/axiosInstance";

// تمكين الاتجاه من اليمين لليسار
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const SHEINScreen = () => {
  const { addItem } = useCart(); // استخدام الدالة لإضافة العنصر للسلة

  const injectedJS = `
    (function() {
      const hideAds = () => {
        const adSelectors = [
          "[id*=ad]", 
          "[class*=ad-]", 
          "[class*=banner]", 
          "[class*=overlay]", 
          "[class*=promo]", 
          ".promo-banner"
        ];
        adSelectors.forEach(selector => {
          document.querySelectorAll(selector).forEach(el => el.style.display = "none");
        });
      };
      hideAds();
      setInterval(hideAds, 1000);

      document.addEventListener('click', function(e) {
        const targetText = e.target.innerText || "";
        const isArabicAdd = targetText.includes("أضف إلى السلة");
        const isEnglishAdd = targetText.includes("Add to Bag");
        if (isArabicAdd || isEnglishAdd) {
          const nameEl = document.querySelector(".product-intro__head-name") || document.querySelector("[data-test='product-title']");
          const name = nameEl?.innerText || "";
          const priceEl = document.querySelector(".product-intro__head-price .normal") || document.querySelector(".product-intro__price-label");
          const priceText = priceEl?.innerText || "";
          const price = priceText.replace(/[^0-9]/g, "");
          const imageEl = document.querySelector(".product-intro__cover img") || document.querySelector(".product-detail-img img");
          const image = imageEl?.src || "";
          const url = window.location.href;

          window.ReactNativeWebView.postMessage(JSON.stringify({
            id: url, // نستخدم الرابط كمعرّف فريد للعناصر
            name: name.trim(),
            price: Number(price) || 0,
            image: image || "",
            sheinUrl: url,
            quantity: 1
          }));
        }
      }, true);
    })();
  `;

  const handleMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      // 1. نضيف العنصر إلى السلة المحليّة
      addItem({
        id: data.id,
        name: data.name,
        price: data.price,
        image: data.image,
        quantity: data.quantity,
        sheinUrl: data.sheinUrl,
      });

+     // 2. (اختياري) نرسل إلى الباك-إند للحفظ في قاعدة البيانات أيضاً
+     // يمكنك التعليق على الجزء التالي إن أردت أن تعتمد فقط على السلة المحلّيّة
      await axiosInstance.post("/shein/cart/add", data);

      Alert.alert("✅ تم الإضافة", "تمّ حفظ المنتج في سلة مشترياتك.");
    } catch (err) {
      Alert.alert("❌ خطأ", "فشل في إضافة المنتج. حاول مجدّدًا.");
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: "https://ar.shein.com/" }}
        injectedJavaScript={injectedJS}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
        cacheEnabled
        startInLoadingState
        style={styles.webview}
      />
    </View>
  );
};

export default SHEINScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  webview: {
    flex: 1,
  },
});

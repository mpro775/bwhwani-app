// import React, { useState, useEffect } from "react";
// import {
//   View,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import Voice from "@react-native-voice/voice";
// import { Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";

// type Props = {
//   onSearch: (query: string, imageUri?: string) => void;
// };

// const GlobalSmartSearchBar = ({ onSearch }: Props) => {
//   const [query, setQuery] = useState("");
//   const [listening, setListening] = useState(false);

//   useEffect(() => {
//     Voice.onSpeechResults = (e) => {
//       const text = e.value?.[0] || "";
//       setQuery(text);
//       onSearch(text);
//     };

//     Voice.onSpeechError = (e) => {
//       console.error("Voice error", e);
//       Alert.alert("خطأ", "حدث خطأ أثناء التعرف على الصوت.");
//     };

//     return () => {
//       Voice.destroy().then(Voice.removeAllListeners);
//     };
//   }, []);

//   const startListening = async () => {
//     try {
//       await Voice.start("ar-YE");
//       setListening(true);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const stopListening = async () => {
//     try {
//       await Voice.stop();
//       setListening(false);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const pickImageFromGallery = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 0.7,
//     });

//     if (!result.canceled && result.assets[0].uri) {
//       onSearch(query, result.assets[0].uri);
//     }
//   };

//   const takePhotoWithCamera = async () => {
//     const { status } = await ImagePicker.requestCameraPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert("الصلاحيات مطلوبة", "يجب السماح باستخدام الكاميرا.");
//       return;
//     }

//     const result = await ImagePicker.launchCameraAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 0.7,
//     });

//     if (!result.canceled && result.assets[0].uri) {
//       onSearch(query, result.assets[0].uri);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* زر الكاميرا */}
//       <TouchableOpacity onPress={takePhotoWithCamera} style={styles.iconBtn}>
//         <Entypo name="camera" size={22} color="#5D4037" />
//       </TouchableOpacity>

//       {/* زر الاستوديو */}
//       <TouchableOpacity onPress={pickImageFromGallery} style={styles.iconBtn}>
//         <MaterialIcons name="image-search" size={22} color="#5D4037" />
//       </TouchableOpacity>

//       {/* زر الميكروفون */}
//       <TouchableOpacity
//         onPress={listening ? stopListening : startListening}
//         style={styles.iconBtn}
//       >
//         <Ionicons
//           name={listening ? "mic-off" : "mic"}
//           size={22}
//           color="#D84315"
//         />
//       </TouchableOpacity>

//       {/* حقل البحث */}
//       <TextInput
//         placeholder="ابحث عن خدمة أو منتج..."
//         placeholderTextColor="#999"
//         value={query}
//         onChangeText={setQuery}
//         onSubmitEditing={() => onSearch(query)}
//         style={styles.input}
//       />
//     </View>
//   );
// };

// export default GlobalSmartSearchBar;

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: "row-reverse",
//     backgroundColor: "#F5F5F5",
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderRadius: 14,
//     alignItems: "center",
//     marginHorizontal: 16,
//     marginTop: 10,
//     elevation: 2,
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     paddingHorizontal: 12,
//     textAlign: "right",
//     color: "#3E2723",
//   },
//   iconBtn: {
//     marginLeft: 12,
//   },
// });

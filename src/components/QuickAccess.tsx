// // components/QuickAccess.tsx
// import React from "react";
// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import { RootStackParamList } from "../types/navigation";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// type AccessItem = {
//   id: string;
//   name: string;
//   icon: keyof typeof MaterialCommunityIcons.glyphMap;
//   screen: keyof RootStackParamList;
//   params?: RootStackParamList[keyof RootStackParamList];
// };

// const quickAccessItems: AccessItem[] = [
//   {
//     id: "1",
//     name: "التوصيل",
//     icon: "truck-fast",
//     screen: "DeliveryTab",
//   },
//   {
//     id: "2",
//     name: "السوق",
//     icon: "shopping",
//     screen: "MarketStack",
//   },
//   {
//     id: "3",
//     name: "بنك الدم",
//     icon: "water",
//     screen: "BloodBankStack",
//   },
//   {
//     id: "4",
//     name: "حجوزات",
//     icon: "calendar",
//     screen: "BookingTabs",
//   },
// ];

// export const QuickAccess = () => {
//   const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>الوصول السريع</Text>
//       <View style={styles.row}>
//         {quickAccessItems.map((item) => (
//           <TouchableOpacity
//             key={item.id}
//             style={styles.item}
//             onPress={() => navigation.navigate(item.screen as any, item.params as any)}
//           >
//             <MaterialCommunityIcons name={item.icon} size={30} color="#D84315" />
//             <Text style={styles.label}>{item.name}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginHorizontal: 16,
//     marginTop: 20,
//     backgroundColor: "#FFF8F0",
//     borderRadius: 16,
//     padding: 12,
//     elevation: 2,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#3E2723",
//     marginBottom: 12,
//     textAlign: "right",
//   },
//   row: {
//     flexDirection: "row-reverse",
//     flexWrap: "wrap",
//     justifyContent: "flex-start",
//   },
//   item: {
//     width: "25%",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   label: {
//     fontSize: 12,
//     marginTop: 6,
//     color: "#3E2723",
//   },
// });

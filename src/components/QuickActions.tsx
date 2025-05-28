// // components/QuickActions.tsx
// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import { getRecentInteractions, Interaction } from "../storage/interactionStorage";
// import { RootStackParamList } from "../types/navigation";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// const COLORS = {
//   primary: "#D84315",
//   text: "#3E2723",
// };

// export const QuickActions = () => {
//   const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
//   const [actions, setActions] = useState<Interaction[]>([]);

//   useEffect(() => {
//     (async () => {
//       const recent = await getRecentInteractions();
//       setActions(recent);
//     })();
//   }, []);

// const handleNavigate = <T extends keyof RootStackParamList>(
//   screen: T,
//   params?: RootStackParamList[T]
// ) => {
//   // استخدم object syntax للتنقل الآمن
//   navigation.navigate({
//     name: screen,
//     params: params,
//   } as never); // ← للأسف لازم as never بسبب قيود TypeScript عند استخدام generic
// };




//   if (actions.length === 0) return null;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>الأزرار السريعة</Text>
//       <View style={styles.row}>
//         {actions.map((action) => (
//     <TouchableOpacity
//   key={action.id}
//   onPress={() => handleNavigate(action.target.screen, action.target.params)}
// >
//   <MaterialCommunityIcons
//     name={action.icon}
//     size={28}
//     color={COLORS.primary}
//   />
//   <Text style={styles.label}>{action.name}</Text>
// </TouchableOpacity>


//         ))}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     margin: 16,
//     padding: 12,
//     backgroundColor: "#FFF8F0",
//     borderRadius: 16,
//     elevation: 2,
//   },
//   title: {
//     fontWeight: "bold",
//     fontSize: 16,
//     color: COLORS.text,
//     marginBottom: 12,
//     textAlign: "right",
//   },
//   row: {
//     flexDirection: "row-reverse",
//     flexWrap: "wrap",
//   },
//   item: {
//     alignItems: "center",
//     marginLeft: 16,
//     marginBottom: 12,
//   },
//   label: {
//     fontSize: 12,
//     color: COLORS.text,
//     marginTop: 6,
//   },
// });

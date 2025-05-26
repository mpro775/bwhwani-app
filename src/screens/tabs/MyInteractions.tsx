import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const COLORS = {
  primary: "#D84315",
  secondary: "#5D4037",
  accent: "#8B4B47",
  background: "#FFF8F0",
  text: "#3E2723",
  success: "#4CAF50",
  info: "#2196F3",
};

type Interaction = {
  id: string;
  type: "إعجاب" | "تعليق" | "متابعة" | "مشاهدة";
  target: string;
  time: string;
  read: boolean;
};

const MyInteractionsDashboard = () => {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [stats, setStats] = useState({
    likes: 0,
    comments: 0,
    follows: 0,
    views: 0,
  });
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  useEffect(() => {
    // بيانات وهمية
    const dummyInteractions: Interaction[] = [
      { id: "1", type: "إعجاب", target: "منشور 1", time: "منذ ساعتين", read: false },
      { id: "2", type: "تعليق", target: "منتج 2", time: "منذ يوم", read: true },
      { id: "3", type: "متابعة", target: "أحمد علي", time: "منذ 3 أيام", read: false },
      { id: "4", type: "مشاهدة", target: "خدمة تصميم", time: "منذ 5 أيام", read: true },
      { id: "5", type: "إعجاب", target: "فرصة عمل", time: "منذ أسبوع", read: true },
    ];

    setInteractions(dummyInteractions);
    setStats({
      likes: 12,
      comments: 8,
      follows: 5,
      views: 32,
    });
  }, []);

  const filteredInteractions = activeTab === "unread" 
    ? interactions.filter(i => !i.read) 
    : interactions;

  const pieData = [
    {
      name: "إعجابات",
      count: stats.likes,
      color: "#D84315",
      legendFontColor: COLORS.text,
      legendFontSize: 14,
    },
    {
      name: "تعليقات",
      count: stats.comments,
      color: "#2196F3",
      legendFontColor: COLORS.text,
      legendFontSize: 14,
    },
    {
      name: "متابعات",
      count: stats.follows,
      color: "#4CAF50",
      legendFontColor: COLORS.text,
      legendFontSize: 14,
    },
    {
      name: "مشاهدات",
      count: stats.views,
      color: "#FFA726",
      legendFontColor: COLORS.text,
      legendFontSize: 14,
    },
  ];

  const chartData = {
    labels: ["10 مايو", "11", "12", "13", "14", "15"],
    datasets: [
      {
        data: [5, 7, 3, 8, 12, 10],
        color: () => COLORS.primary,
        strokeWidth: 2,
      },
    ],
  };

  const getInteractionIcon = (type: Interaction["type"]) => {
    switch (type) {
      case "إعجاب": return { name: "heart", color: "#D84315" };
      case "تعليق": return { name: "chatbubble", color: "#2196F3" };
      case "متابعة": return { name: "person-add", color: "#4CAF50" };
      case "مشاهدة": return { name: "eye", color: "#FFA726" };
    }
  };

  return (
    <LinearGradient colors={["#FFF5F5", "#FFFFFF"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>تفاعلاتي</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: "#FBE9E7" }]}>
            <Ionicons name="heart" size={24} color="#D84315" />
            <Text style={styles.statNumber}>{stats.likes}</Text>
            <Text style={styles.statLabel}>إعجاب</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: "#E3F2FD" }]}>
            <Ionicons name="chatbubble" size={24} color="#2196F3" />
            <Text style={styles.statNumber}>{stats.comments}</Text>
            <Text style={styles.statLabel}>تعليق</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: "#E8F5E9" }]}>
            <Ionicons name="person-add" size={24} color="#4CAF50" />
            <Text style={styles.statNumber}>{stats.follows}</Text>
            <Text style={styles.statLabel}>متابعة</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: "#FFF3E0" }]}>
            <Ionicons name="eye" size={24} color="#FFA726" />
            <Text style={styles.statNumber}>{stats.views}</Text>
            <Text style={styles.statLabel}>مشاهدة</Text>
          </View>
        </View>

        {/* Line Chart */}
        <View style={styles.chartContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>نشاط التفاعلات</Text>
            <Text style={styles.timeRange}>آخر 7 أيام</Text>
          </View>
          <LineChart
            data={chartData}
            width={SCREEN_WIDTH - 40}
            height={220}
            chartConfig={{
              backgroundColor: "#FFF",
              backgroundGradientFrom: "#FFF",
              backgroundGradientTo: "#FFF",
              decimalPlaces: 0,
              color: () => COLORS.primary,
              labelColor: () => COLORS.text,
              propsForDots: {
                r: "5",
                strokeWidth: "2",
                stroke: COLORS.primary,
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Pie Chart */}
        <View style={styles.chartContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>توزيع التفاعلات</Text>
          </View>
          <PieChart
            data={pieData}
            width={SCREEN_WIDTH - 40}
            height={200}
            chartConfig={{
              color: () => COLORS.primary,
            }}
            accessor="count"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[10, 0]}
            absolute
            style={styles.chart}
          />
        </View>

        {/* Interactions Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "all" && styles.activeTab]}
            onPress={() => setActiveTab("all")}
          >
            <Text style={[styles.tabText, activeTab === "all" && styles.activeTabText]}>
              الكل
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "unread" && styles.activeTab]}
            onPress={() => setActiveTab("unread")}
          >
            <Text style={[styles.tabText, activeTab === "unread" && styles.activeTabText]}>
              غير المقروء ({interactions.filter(i => !i.read).length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Interactions List */}
        <FlatList
          data={filteredInteractions}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => {
            const icon = getInteractionIcon(item.type);
            return (
              <TouchableOpacity 
                style={[styles.interactionCard, !item.read && styles.unreadCard]}
                activeOpacity={0.8}
              >
                <View style={[styles.iconContainer, { backgroundColor: `${icon.color}20` }]}>
                  <Ionicons name="heart" size={20} color={icon.color} />
                </View>
                <View style={styles.interactionContent}>
                  <Text style={styles.interactionText}>
                    <Text style={{ fontFamily: "Cairo-Bold" }}>{item.type}</Text> على {item.target}
                  </Text>
                  <Text style={styles.interactionTime}>{item.time}</Text>
                </View>
                {!item.read && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={styles.interactionsList}
        />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  headerTitle: {
    fontFamily: "Cairo-Bold",
    fontSize: 24,
    color: COLORS.primary,
  },
  filterButton: {
    padding: 8,
  },
  statsRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 20,
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    width: (SCREEN_WIDTH - 56) / 2,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontFamily: "Cairo-Bold",
    fontSize: 24,
    color: COLORS.text,
    marginVertical: 8,
    textAlign: "center",
  },
  statLabel: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 14,
    color: COLORS.text,
    textAlign: "center",
  },
  chartContainer: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: "Cairo-Bold",
    fontSize: 18,
    color: COLORS.text,
  },
  timeRange: {
    fontFamily: "Cairo-Regular",
    fontSize: 14,
    color: COLORS.accent,
  },
  chart: {
    borderRadius: 12,
  },
  tabsContainer: {
    flexDirection: "row-reverse",
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 14,
    color: "#666",
  },
  activeTabText: {
    color: COLORS.primary,
  },
  interactionsList: {
    paddingHorizontal: 16,
  },
  interactionCard: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  interactionContent: {
    flex: 1,
  },
  interactionText: {
    fontFamily: "Cairo-Regular",
    fontSize: 15,
    color: COLORS.text,
  },
  interactionTime: {
    fontFamily: "Cairo-Regular",
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
});

export default MyInteractionsDashboard;
// components/BookingCalendar.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import "moment/locale/ar";

type AvailabilityItem = {
  day: string; // "Sunday", "Monday", ...
  start: string; // "09:00"
  end: string;   // "17:00"
};

type Props = {
  availability: AvailabilityItem[];
  onDateSelect: (date: string) => void;
};

const weekdaysMap: Record<string, string> = {
  Sunday: "0",
  Monday: "1",
  Tuesday: "2",
  Wednesday: "3",
  Thursday: "4",
  Friday: "5",
  Saturday: "6",
};

const BookingCalendar: React.FC<Props> = ({ availability, onDateSelect }) => {
  const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    const today = moment();
    const availableDays = availability.map((a) => weekdaysMap[a.day]);

    const marks: { [key: string]: any } = {};
    for (let i = 0; i < 60; i++) {
      const date = moment(today).add(i, "days");
      const weekday = date.day().toString(); // 0 to 6
      if (availableDays.includes(weekday)) {
        const formatted = date.format("YYYY-MM-DD");
        marks[formatted] = {
          marked: true,
          dotColor: "#43A047",
          selectedColor: "#C8E6C9",
        };
      }
    }

    setMarkedDates(marks);
  }, [availability]);

  const handleDayPress = (day: any) => {
    const selected = day.dateString;
    if (!markedDates[selected]) {
      Alert.alert("غير متاح", "هذا اليوم غير متاح للحجز.");
      return;
    }
    onDateSelect(selected);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>اختر تاريخاً للحجز:</Text>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={markedDates}
        theme={{
          selectedDayBackgroundColor: "#43A047",
          selectedDayTextColor: "#fff",
          todayTextColor: "#D84315",
          dotColor: "#43A047",
          arrowColor: "#2C3E50",
          textDayFontFamily: "Cairo-Regular",
          textMonthFontFamily: "Cairo-Bold",
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  label: {
    fontFamily: "Cairo-Bold",
    fontSize: 18,
    color: "#2C3E50",
    marginBottom: 8,
    textAlign: "right",
  },
});

export default BookingCalendar;

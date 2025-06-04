import React, { useState } from "react";
import { View, Text, Switch, Platform } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

const ScheduledDeliveryPicker = ({ onChange }: { onChange: (date: Date | null) => void }) => {
  const [isScheduled, setIsScheduled] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const toggleSwitch = () => {
    setIsScheduled(!isScheduled);
    if (!isScheduled) setShowPicker(true); // Show picker when enabling
    else {
      setDate(null);
      onChange(null); // Reset
    }
  };

const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(Platform.OS === "ios"); // Keep picker for iOS
    if (selectedDate) {
      setDate(selectedDate);
      onChange(selectedDate);
    }
  };

  return (
    <View style={{ marginVertical: 16 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: 16 }}>طلب مجدول</Text>
        <Switch value={isScheduled} onValueChange={toggleSwitch} />
      </View>

      {isScheduled && (
        <View style={{ marginTop: 10 }}>
          <Text style={{ marginBottom: 5 }}>اختر التاريخ والوقت:</Text>
          {showPicker && (
            <DateTimePicker
              value={date || new Date()}
              mode="datetime"
              minimumDate={new Date()}
              display="default"
              onChange={onDateChange}
            />
          )}
          {date && <Text style={{ marginTop: 5 }}>موعد التوصيل: {date.toLocaleString()}</Text>}
        </View>
      )}
    </View>
  );
};

export default ScheduledDeliveryPicker;

// schedule: [{ day: "monday", open: true, from: "09:00", to: "18:00" }, ...]
type ScheduleItem = {
  day: string;
  open: boolean;
  from: string;
  to: string;
};
export function isStoreOpenNow(schedule: ScheduleItem[]): boolean {
  if (!Array.isArray(schedule) || !schedule.length) return false;

  const now = new Date();
  const dayIdx = now.getDay(); // الأحد=0 ... السبت=6
  const daysArr = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const today = daysArr[dayIdx];

  const todaySchedule = schedule.find(s => s.day.toLowerCase() === today);

  if (!todaySchedule || !todaySchedule.open) return false;

  const [fromH, fromM] = todaySchedule.from.split(":").map(Number);
  const [toH, toM] = todaySchedule.to.split(":").map(Number);

  // وقت بداية ونهاية الدوام
  const start = new Date(now);
  start.setHours(fromH, fromM, 0, 0);
  const end = new Date(now);
  end.setHours(toH, toM, 0, 0);

  // دعم دوام ليلي ينتهي بعد منتصف الليل
  if (end <= start) {
    // إلى بعد منتصف الليل (مثلا من 20:00 إلى 03:00)
    if (now >= start || now <= end) return true;
    return false;
  }

  return now >= start && now <= end;
}

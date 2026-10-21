
import { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";
import { useColorScheme } from "../useColorScheme";
import Colors from "@/constants/Colors";

interface DateSelectorProps {
  selectedDate: string; // YYYY-MM-DD
  onDateChange: (date: string) => void;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function startOfWeek(date: Date): Date {
  const result = new Date(date);
  const weekday = (result.getDay() + 6) % 7;

  result.setDate(result.getDate() - weekday);
  return result;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export default function DateSelector({
  selectedDate,
  onDateChange,
}: DateSelectorProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const today = formatDate(new Date());

  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(parseDate(selectedDate))
  );

  const dates = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const canGoPrevious =
    formatDate(addDays(weekStart, 6)) >= today;

  const monthLabel = weekStart.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const foreground = colors.foreground;
  const background = colors.background;
  const border = colors.border;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => setWeekStart(addDays(weekStart, -7))}
          disabled={!canGoPrevious}
          style={styles.arrow}
        >
          <Text
            style={{
              color: canGoPrevious ? foreground : "#888888",
              fontSize: 24,
            }}
          >
            ‹
          </Text>
        </Pressable>

        <Text style={[styles.month, { color: foreground }]}>
          {monthLabel}
        </Text>

        <Pressable
          onPress={() => setWeekStart(addDays(weekStart, 7))}
          style={styles.arrow}
        >
          <Text style={{ color: foreground, fontSize: 24 }}>›</Text>
        </Pressable>
      </View>

      <View style={styles.week}>
        {dates.map((date, index) => {
          const value = formatDate(date);
          const isSelected = value === selectedDate;
          const isPast = value < today;

          return (
            <Pressable
              key={value}
              disabled={isPast}
              onPress={() => onDateChange(value)}
              style={[
                styles.day,
                {
                  backgroundColor: isSelected
                    ? foreground
                    : background,
                  borderColor: isSelected ? foreground : border,
                },
              ]}
            >
              <Text
                style={[
                  styles.weekday,
                  { color: isPast ? "#888888" : isSelected ? background : foreground },
                ]}
              >
                {WEEKDAYS[index]}
              </Text>

              <Text
                style={[
                  styles.dayNumber,
                  { color: isPast ? "#888888" : isSelected ? background : foreground },
                ]}
              >
                {date.getDate()}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  arrow: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  month: {
    fontSize: 17,
    fontWeight: "600",
  },
  week: {
    flexDirection: "row",
    gap: 4,
  },
  day: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    gap: 8,
  },
  weekday: {
    fontSize: 11,
    fontWeight: "500",
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: "600",
  },
});

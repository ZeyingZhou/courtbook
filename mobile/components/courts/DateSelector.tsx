import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";
import { useColorScheme } from "../useColorScheme";
import Colors from "@/constants/Colors";

import { addDays, canGoToPreviousWeek, formatLocalDate, localDateStart, startOfWeek } from '@/domain/availability';
import type { LocalDate } from '@/types/availability';

interface DateSelectorProps {
  selectedDate: LocalDate;
  onDateChange: (date: LocalDate) => void;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function DateSelector({
  selectedDate,
  onDateChange,
}: DateSelectorProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const today = formatLocalDate(new Date());
  const [navigation, setNavigation] = useState({ date: selectedDate, offset: 0 });
  if (navigation.date !== selectedDate) {
    setNavigation({ date: selectedDate, offset: 0 });
  }
  const offset = navigation.date === selectedDate ? navigation.offset : 0;
  const weekStart = addDays(startOfWeek(localDateStart(selectedDate)), offset * 7);
  const dates = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
  const canGoPrevious = canGoToPreviousWeek(weekStart, today);

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
          accessibilityRole="button"
          accessibilityLabel="Previous week"
          accessibilityState={{ disabled: !canGoPrevious }}
          onPress={() => setNavigation({ date: selectedDate, offset: offset - 1 })}
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
          accessibilityRole="button"
          accessibilityLabel="Next week"
          onPress={() => setNavigation({ date: selectedDate, offset: offset + 1 })}
          style={styles.arrow}
        >
          <Text style={{ color: foreground, fontSize: 24 }}>›</Text>
        </Pressable>
      </View>

      <View style={styles.week}>
        {dates.map((date, index) => {
          const value = formatLocalDate(date);
          const isSelected = value === selectedDate;
          const isPast = value < today;

          return (
            <Pressable
              key={value}
              accessibilityRole="button"
              accessibilityLabel={date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              accessibilityState={{ disabled: isPast, selected: isSelected }}
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

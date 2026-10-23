import { ScrollView, StyleSheet, View } from 'react-native';
import Colors from '@/constants/Colors';
import { mockAvailability } from '@/data/courts';
import { useColorScheme } from '../useColorScheme';
import ThemedText from '../Themed/ThemedText';
import TimeSlotCell from './TimeSlotCell';

const courts = Array.from({ length: 7 }, (_, i) => String(i + 1));
// 23:00 is closing time: the last bookable hour starts at 22:00.
const hours = Array.from({ length: 15 }, (_, i) => i + 8);
const formatHour = (hour: number) => `${hour % 12 || 12} ${hour < 12 ? 'AM' : 'PM'}`;

export interface SlotSelection {
  courtId: string;
  startHour: number;
  duration: 1 | 2;
}

interface Props {
  selection: SlotSelection | null;
  onSlotPress: (courtId: string, hour: number) => void;
}

export default function CourtAvalibilityGrid({ selection, onSlotPress }: Props) {
  const colors = Colors[useColorScheme()];
  return (
    <View style={styles.container}>
      <ThemedText style={styles.hint}>Sample availability · Swipe to see all 7 courts</ThemedText>
      <ScrollView style={styles.scroll} nestedScrollEnabled>
        <View style={styles.row}>
          <View style={styles.timeColumn}>
            {hours.map((hour) => (
              <View key={hour} style={[styles.time, { borderColor: colors.border }]}>
                <ThemedText style={styles.timeText}>{formatHour(hour)}</ThemedText>
                <ThemedText style={styles.endTime}>to {formatHour(hour + 1)}</ThemedText>
              </View>
            ))}
          </View>
          <ScrollView horizontal nestedScrollEnabled style={styles.scroll}>
            {courts.map((courtId) => (
              <View key={courtId} style={styles.courtColumn}>
                {hours.map((hour) => {
                  const startTime = `${String(hour).padStart(2, '0')}:00`;
                  const slot = mockAvailability.find(
                    (item) => item.courtId === courtId && item.startTime === startTime
                  );
                  return (
                    <TimeSlotCell key={hour} courtNumber={courtId} available={slot?.available ?? true}
                      selected={selection?.courtId === courtId && hour >= selection.startHour && hour < selection.startHour + selection.duration}
                      onPress={() => onSlotPress(courtId, hour)}
                      label={`Court ${courtId}, ${formatHour(hour)} to ${formatHour(hour + 1)}`} />
                  );
                })}
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 20, gap: 12 },
  hint: { fontSize: 12, opacity: 0.65 },
  scroll: { flex: 1 },
  row: { flexDirection: 'row' },
  timeColumn: { width: 78 },
  courtColumn: { width: 60 },
  time: { height: 60, justifyContent: 'center', borderBottomWidth: 1, gap: 3 },
  timeText: { fontSize: 13, fontWeight: '500' },
  endTime: { fontSize: 11, opacity: 0.6 },
});

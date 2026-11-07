import { ScrollView, StyleSheet, View } from 'react-native';
import Colors from '@/constants/Colors';
import { slotHours } from '@/data/courts';
import { formatHour, slotKey } from '@/domain/availability';
import type { DisplaySlot, Slot } from '@/types/availability';
import type { Court } from '@/types/court';
import { useColorScheme } from '../useColorScheme';
import ThemedText from '../Themed/ThemedText';
import TimeSlotCell from './TimeSlotCell';

interface Props {
  courts: readonly Court[];
  slots: readonly DisplaySlot[];
  selection: Slot | null;
  onSlotPress: (slot: Slot) => void;
}

export default function CourtAvalibilityGrid({ courts, slots, selection, onSlotPress }: Props) {
  const colors = Colors[useColorScheme()];
  return (
    <View style={styles.container}>
      <ThemedText style={styles.hint}>Sample availability · Swipe to see all {courts.length} courts</ThemedText>
      <ScrollView style={styles.scroll} nestedScrollEnabled>
        <View style={styles.row}>
          <View style={styles.timeColumn}>
            {slotHours.map((hour) => (
              <View key={hour} style={[styles.time, { borderColor: colors.border }]}>
                <ThemedText style={styles.timeText}>{formatHour(hour)}</ThemedText>
                <ThemedText style={styles.endTime}>to {formatHour(hour + 1)}</ThemedText>
              </View>
            ))}
          </View>
          <ScrollView horizontal nestedScrollEnabled style={styles.scroll}>
            {courts.map((court) => (
              <View key={court.id} style={styles.courtColumn}>
                {slots.filter(({ slot }) => slot.courtId === court.id).map(({ slot, status }) => (
                  <TimeSlotCell
                    key={slotKey(slot)}
                    courtNumber={court.id}
                    status={status}
                    selected={selection !== null && slotKey(selection) === slotKey(slot)}
                    onPress={() => onSlotPress(slot)}
                    label={`${court.name}, ${formatHour(slot.startHour)} to ${formatHour(slot.startHour + 1)}`}
                  />
                ))}
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

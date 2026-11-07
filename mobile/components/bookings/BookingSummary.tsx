import { StyleSheet, View } from 'react-native';
import ThemedText from '@/components/Themed/ThemedText';
import { facilities } from '@/data/courts';
import { formatHour, localDateStart } from '@/domain/availability';
import type { Slot } from '@/types/availability';

export default function BookingSummary({ slot }: { slot: Slot }) {
  const facility = facilities.find(({ id }) => id === slot.facilityId);
  const court = facility?.courts.find(({ id }) => id === slot.courtId);
  return (
    <View style={styles.details}>
      <ThemedText style={styles.facility}>{facility?.name}</ThemedText>
      <ThemedText>{court?.name}</ThemedText>
      <ThemedText>{localDateStart(slot.date).toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      })}</ThemedText>
      <ThemedText>{formatHour(slot.startHour)} to {formatHour(slot.startHour + 1)} · 1 hour</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  details: { gap: 8 },
  facility: { fontSize: 18, fontWeight: '600' },
});

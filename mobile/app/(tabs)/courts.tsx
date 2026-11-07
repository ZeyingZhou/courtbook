import CourtAvalibilityGrid from '@/components/courts/CourtAvalibilityGrid';
import ThemedButton from '@/components/Themed/ThemedButton';
import DateSelector from '@/components/courts/DateSelector';
import FacilitySelector from '@/components/courts/FacilitySelector';
import Spacer from '@/components/Spacer';
import ThemedText from '@/components/Themed/ThemedText';
import { useEffect, useState } from 'react';
import { Alert, AppState, StyleSheet, View } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { facilities } from '@/data/courts';
import { formatHour, formatLocalDate, getSlots, getSlotStatus, slotKey } from '@/domain/availability';
import type { Slot } from '@/types/availability';

export default function Courts() {
  const [selectedDate, setSelectedDate] = useState(() => formatLocalDate(new Date()));
  const [selectedFacility, setSelectedFacility] = useState(facilities[0]);
  const [selection, setSelection] = useState<Slot | null>(null);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setTimeout(() => setNow(new Date()), 60_000 - now.getTime() % 60_000);
    return () => clearTimeout(timer);
  }, [now]);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') setNow(new Date());
    });
    return () => subscription.remove();
  }, []);

  const slots = getSlots({ facilityId: selectedFacility.id, date: selectedDate, bookings: [], now });
  const availableSelection = selection && getSlotStatus({ slot: selection, bookings: [], now }) === 'available'
    ? selection : null;
  const selectionLabel = availableSelection
    ? `Court ${availableSelection.courtId} · ${formatHour(availableSelection.startHour)} to ${formatHour(availableSelection.startHour + 1)}`
    : 'Select a court and one-hour time slot';
  const insets = useSafeAreaInsets();
  const colors = Colors[useColorScheme()];

  const handleSlotPress = (slot: Slot) => {
    if (getSlotStatus({ slot, bookings: [], now: new Date() }) !== 'available') {
      setNow(new Date());
      return;
    }
    setSelection((current) => current && slotKey(current) === slotKey(slot) ? null : slot);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20, backgroundColor: colors.background }]}>
      <ThemedText style={styles.title}>CourtBook 🎾</ThemedText>
      <Spacer height={15} />
      <View>
        <FacilitySelector
          facilities={facilities}
          selectedFacilityId={selectedFacility.id}
          onFacilityChange={(id) => {
            const facility = facilities.find((item) => item.id === id);
            if (!facility) return;
            setSelectedFacility(facility);
            setSelection(null);
          }}
        />
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={(date) => { setSelectedDate(date); setSelection(null); }}
        />
      </View>
      <CourtAvalibilityGrid
        courts={selectedFacility.courts}
        slots={slots}
        selection={availableSelection}
        onSlotPress={handleSlotPress}
      />
      <View style={[styles.bookingFooter, { borderColor: colors.border }]}>
        <ThemedText>{selectionLabel}</ThemedText>
        <ThemedButton
          title="Preview sample booking"
          accessibilityRole="button"
          accessibilityState={{ disabled: !availableSelection }}
          disabled={!availableSelection}
          style={{ opacity: availableSelection ? 1 : 0.4, alignItems: 'center', marginBottom: 0 }}
          onPress={() => {
            if (!availableSelection) return;
            if (getSlotStatus({ slot: availableSelection, bookings: [], now: new Date() }) !== 'available') {
              setNow(new Date());
              return;
            }
            Alert.alert('Sample booking preview', `${selectedFacility.name}\n${selectedDate}\n${selectionLabel}\n\nPreview only. No reservation is created.`);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bookingFooter: { paddingTop: 16, marginTop: 12, borderTopWidth: 1 },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold' },
});

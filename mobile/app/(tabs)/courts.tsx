import CourtAvalibilityGrid from '@/components/courts/CourtAvalibilityGrid';
import ThemedButton from '@/components/Themed/ThemedButton';
import DateSelector from '@/components/courts/DateSelector';
import FacilitySelector from '@/components/courts/FacilitySelector';
import Spacer from '@/components/Spacer';
import ThemedText from '@/components/Themed/ThemedText';
import BookingReview from '@/components/bookings/BookingReview';
import { useCallback, useEffect, useState } from 'react';
import { AppState, StyleSheet, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { facilities } from '@/data/courts';
import { formatHour, formatLocalDate, getSlots, getSlotStatus, slotKey } from '@/domain/availability';
import type { Slot } from '@/types/availability';
import { useBookings } from '@/providers/BookingsProvider';

type Draft =
  | { kind: 'selecting'; selection: Slot | null }
  | { kind: 'reviewing'; slot: Slot }
  | { kind: 'unavailable'; slot: Slot };

export default function Courts() {
  const [selectedDate, setSelectedDate] = useState(() => formatLocalDate(new Date()));
  const [selectedFacility, setSelectedFacility] = useState(facilities[0]);
  const [draft, setDraft] = useState<Draft>({ kind: 'selecting', selection: null });
  const { bookings, confirm } = useBookings();
  const [now, setNow] = useState(() => new Date());
  useFocusEffect(useCallback(() => {
    setNow(new Date());
    return () => setDraft((current) => current.kind === 'selecting'
      ? current : { kind: 'selecting', selection: current.slot });
  }, []));
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

  const selection = draft.kind === 'selecting' ? draft.selection : draft.slot;
  const slots = getSlots({ facilityId: selectedFacility.id, date: selectedDate, bookings, now });
  const availableSelection = selection && getSlotStatus({ slot: selection, bookings, now }) === 'available'
    ? selection : null;
  const selectionLabel = availableSelection
    ? `Court ${availableSelection.courtId} · ${formatHour(availableSelection.startHour)} to ${formatHour(availableSelection.startHour + 1)}`
    : 'Select a court and one-hour time slot';
  const insets = useSafeAreaInsets();
  const colors = Colors[useColorScheme()];

  const handleSlotPress = (slot: Slot) => {
    if (getSlotStatus({ slot, bookings, now: new Date() }) !== 'available') {
      setNow(new Date());
      return;
    }
    setDraft({ kind: 'selecting', selection: selection && slotKey(selection) === slotKey(slot) ? null : slot });
  };

  const dismissReview = () => {
    setDraft((current) => current.kind === 'selecting'
      ? current : { kind: 'selecting', selection: current.slot });
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
            setDraft({ kind: 'selecting', selection: null });
          }}
        />
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={(date) => { setSelectedDate(date); setDraft({ kind: 'selecting', selection: null }); }}
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
          title="Review sample booking"
          accessibilityRole="button"
          accessibilityState={{ disabled: !availableSelection }}
          disabled={!availableSelection}
          style={{ opacity: availableSelection ? 1 : 0.4, alignItems: 'center', marginBottom: 0 }}
          onPress={() => {
            if (!availableSelection) return;
            if (getSlotStatus({ slot: availableSelection, bookings, now: new Date() }) !== 'available') {
              setNow(new Date());
              return;
            }
            setDraft({ kind: 'reviewing', slot: availableSelection });
          }}
        />
      </View>
      {draft.kind !== 'selecting' && (
        <BookingReview
          slot={draft.slot}
          status={draft.kind === 'unavailable' ? 'unavailable' : 'ready'}
          onDismiss={dismissReview}
          onConfirm={() => {
            const result = confirm(draft.slot);
            setNow(new Date());
            if (result.status === 'unavailable') {
              setDraft({ kind: 'unavailable', slot: draft.slot });
              return;
            }
            setDraft({ kind: 'selecting', selection: null });
            router.navigate('/(tabs)/bookings');
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bookingFooter: { paddingTop: 16, marginTop: 12, borderTopWidth: 1 },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold' },
});

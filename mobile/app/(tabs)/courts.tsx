import CourtAvalibilityGrid, { type SlotSelection } from '@/components/courts/CourtAvalibilityGrid';
import ThemedButton from '@/components/Themed/ThemedButton';
import DateSelector from '@/components/courts/DateSelector';
import FacilitySelector from '@/components/courts/FacilitySelector';
import Spacer from '@/components/Spacer';
import ThemedText from '@/components/Themed/ThemedText'
import { useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import Colors from '@/constants/Colors'
import { useColorScheme } from '@/components/useColorScheme'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const facilities = [
  { id: '1', name: 'Riverside Tennis Center' },
  { id: '2', name: 'Central Park Courts' },
  { id: '3', name: 'Northside Racquet Club' },
  { id: '4', name: 'Eastside Tennis Club' },
  { id: '5', name: 'Lakeside Courts' },
]
const Courts = () => {
    const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  });
  const [selectedFacilityId, setSelectedFacilityId] = useState('1');
  const [selection, setSelection] = useState<SlotSelection | null>(null);
  const formatHour = (hour: number) => `${hour % 12 || 12} ${hour < 12 ? 'AM' : 'PM'}`;
  const selectionLabel = selection
    ? `Court ${selection.courtId} · ${formatHour(selection.startHour)}–${formatHour(selection.startHour + selection.duration)}`
    : 'Select a court and time to book';

  const handleSlotPress = (courtId: string, hour: number) => {
    setSelection((current) => {
      if (current?.courtId === courtId) {
        if (hour >= current.startHour && hour < current.startHour + current.duration) {
          return current.duration === 1 ? null : {
            courtId, startHour: hour === current.startHour ? hour + 1 : current.startHour, duration: 1,
          };
        }
        if (current.duration === 1 && Math.abs(hour - current.startHour) === 1) {
          return { courtId, startHour: Math.min(hour, current.startHour), duration: 2 };
        }
      }
      return { courtId, startHour: hour, duration: 1 };
    });
  };
  const insets = useSafeAreaInsets();
  const colors = Colors[useColorScheme()];
  return (
    <>
    <View
      style={[styles.container, {paddingTop: insets.top + 20, backgroundColor: colors.background}]}
    >
    <View>
        <ThemedText style={styles.title}>CourtBook 🎾</ThemedText>
    </View>
    <Spacer height={15}/>
    <View>
    <FacilitySelector
      facilities={facilities}
      selectedFacilityId={selectedFacilityId}
      onFacilityChange={(id) => {
        setSelectedFacilityId(id);
        setSelection(null);
      }}
    />
    <DateSelector
      selectedDate={selectedDate}
      onDateChange={(date) => { setSelectedDate(date); setSelection(null); }}
    />
    </View>
    <CourtAvalibilityGrid selection={selection} onSlotPress={handleSlotPress}/>
    <View style={[styles.bookingFooter, { borderColor: colors.border }]}>
      <ThemedText>{selectionLabel}</ThemedText>
      <ThemedButton
        title="Book"
        accessibilityRole="button"
        accessibilityState={{ disabled: !selection }}
        disabled={!selection}
        style={{ opacity: selection ? 1 : 0.4, alignItems: 'center', marginBottom: 0 }}
        onPress={() => {
          if (!selection) return;
          Alert.alert('Booking preview', `${facilities.find((facility) => facility.id === selectedFacilityId)?.name}\n${selectedDate}\n${selectionLabel}\n\nBooking confirmation is not connected yet.`);
        }}
      />
    </View>
    </View>
    </>
  )
}

export default Courts

const styles = StyleSheet.create({
    bookingFooter: { paddingTop: 16, marginTop: 12, borderTopWidth: 1 },
    container: {
        flex:1,
        padding: 20,

    },
    title: {
        fontSize: 20,
        fontWeight: "bold"
    }
})

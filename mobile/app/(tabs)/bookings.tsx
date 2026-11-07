import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BookingSummary from '@/components/bookings/BookingSummary';
import ThemedButton from '@/components/Themed/ThemedButton';
import ThemedCard from '@/components/Themed/ThemedCard';
import ThemedText from '@/components/Themed/ThemedText';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { slotStart } from '@/domain/availability';
import { useBookings } from '@/providers/BookingsProvider';

export default function Bookings() {
  const { bookings } = useBookings();
  const insets = useSafeAreaInsets();
  const colors = Colors[useColorScheme()];
  const chronological = [...bookings].sort((first, second) =>
    slotStart(first.slot).getTime() - slotStart(second.slot).getTime());

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + 20 }]}
    >
      <ThemedText style={styles.title} accessibilityRole="header">My bookings</ThemedText>
      <ThemedText style={styles.notice}>
        Sample bookings for this app session only. These do not reserve real courts and disappear when the app restarts.
      </ThemedText>
      {chronological.length === 0 ? (
        <ThemedCard style={styles.empty}>
          <ThemedText style={styles.emptyTitle}>No sample bookings yet</ThemedText>
          <ThemedText>Find an available one-hour slot and confirm it to see it here.</ThemedText>
          <ThemedButton title="Find a court" accessibilityRole="button" style={styles.button} onPress={() => router.navigate('/(tabs)/courts')} />
        </ThemedCard>
      ) : (
        <View style={styles.list}>
          {chronological.map((booking) => (
            <ThemedCard key={booking.id} style={styles.booking}>
              <ThemedText style={styles.confirmed}>Sample booking confirmed</ThemedText>
              <BookingSummary slot={booking.slot} />
            </ThemedCard>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, gap: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  notice: { lineHeight: 22, opacity: 0.7 },
  empty: { gap: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '600' },
  button: { alignItems: 'center', marginBottom: 0 },
  list: { gap: 16 },
  booking: { gap: 16 },
  confirmed: { fontWeight: '600' },
});

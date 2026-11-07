import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BookingSummary from '@/components/bookings/BookingSummary';
import ThemedButton from '@/components/Themed/ThemedButton';
import ThemedCard from '@/components/Themed/ThemedCard';
import ThemedText from '@/components/Themed/ThemedText';
import type { Slot } from '@/types/availability';

export default function BookingReview({ slot, status, onDismiss, onConfirm }: {
  slot: Slot;
  status: 'ready' | 'unavailable';
  onDismiss: () => void;
  onConfirm: () => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={[styles.overlay, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel="Dismiss booking review"
        />
        <ThemedCard style={styles.card} accessibilityViewIsModal>
          <ScrollView contentContainerStyle={styles.content}>
            <ThemedText style={styles.title} accessibilityRole="header">Review sample booking</ThemedText>
            <BookingSummary slot={slot} />
            <ThemedText style={styles.notice}>
              This is a sample booking for this app session only. It does not reserve a real court and disappears when the app restarts.
            </ThemedText>
            {status === 'unavailable' && (
              <ThemedText accessibilityRole="alert">This slot is no longer available. Choose another time.</ThemedText>
            )}
            <ThemedButton
              title="Confirm sample booking"
              accessibilityRole="button"
              disabled={status === 'unavailable'}
              accessibilityState={{ disabled: status === 'unavailable' }}
              style={[styles.button, status === 'unavailable' && styles.disabled]}
              onPress={onConfirm}
            />
            <ThemedButton title="Edit selection" variant="secondary" accessibilityRole="button" style={styles.button} onPress={onDismiss} />
          </ScrollView>
        </ThemedCard>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  card: { width: '100%', maxWidth: 480, maxHeight: '100%' },
  content: { gap: 20 },
  title: { fontSize: 22, fontWeight: 'bold' },
  notice: { lineHeight: 22, opacity: 0.75 },
  button: { marginVertical: 0, alignItems: 'center' },
  disabled: { opacity: 0.4 },
});

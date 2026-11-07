import { Pressable, StyleSheet, View } from 'react-native';
import Colors from '@/constants/Colors';
import type { SlotStatus } from '@/types/availability';
import { useColorScheme } from '../useColorScheme';
import ThemedText from '../Themed/ThemedText';

interface TimeSlotCellProps {
  courtNumber: string;
  status: SlotStatus;
  label: string;
  onPress?: () => void;
  selected?: boolean;
}

const statusLabels: Record<SlotStatus, string> = {
  available: 'Available',
  unavailable: 'Unavailable in sample schedule',
  elapsed: 'Start time has passed',
  booked: 'Booked',
};

export default function TimeSlotCell({ courtNumber, status, label, onPress, selected = false }: TimeSlotCellProps) {
  const available = status === 'available';
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  return (
    <View style={styles.cell}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}, ${statusLabels[status]}`}
        accessibilityState={{ disabled: !available, selected }}
        disabled={!available}
        onPress={onPress}
        style={({ pressed }) => [styles.button, {
          borderColor: colors.border,
          backgroundColor: selected ? colors.foreground : available ? colors.background : colors.border,
          opacity: pressed ? 0.6 : 1,
        }]}
      >
        <ThemedText style={[styles.text, selected && { color: colors.background }, !available && {
          color: colorScheme === 'dark' ? '#909090' : '#777777',
        }]}>{courtNumber}</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  cell: { height: 60, alignItems: 'center', justifyContent: 'center' },
  button: { width: 48, height: 48, borderWidth: 1, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 16, fontWeight: '600' },
});

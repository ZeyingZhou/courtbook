import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from '@/components/Themed/Themed';
import ThemedButton from '@/components/Themed/ThemedButton';
import ThemedText from '@/components/Themed/ThemedText';
import Spacer from '@/components/Spacer';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import ThemedCard from '@/components/Themed/ThemedCard';
import QuickBooking from '@/components/home/QuickBooking';

export default function Home() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();
  return (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.scrollContent,{ paddingTop: insets.top + 20 },]}
      style={[styles.scrollContainer,{backgroundColor: colors.background}]}>
      <View>
        <ThemedText style={styles.heading}>CourtBook 🎾</ThemedText>
        <Spacer height={10}></Spacer>
        <ThemedText style={styles.heading}>Ready for your next match? </ThemedText>
      </View>
      <QuickBooking/>
      <ThemedText style={styles.title}>Upcoming Booking</ThemedText>
      <ThemedCard>
        <ThemedText>No upcoming bookings yet.</ThemedText>
      </ThemedCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  scrollContainer: {
    flex:1
  },
  scrollContent: {
    padding: 20,
    gap: 24
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: "row",
    gap:12
  },
  heading: {
    fontSize:20,
    fontWeight: "bold"
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
  },
});

import { StyleSheet, View } from 'react-native'
import ThemedCard from '../Themed/ThemedCard'
import ThemedText from '../Themed/ThemedText'
import Spacer from '../Spacer'
import ThemedButton from '../Themed/ThemedButton'

const QuickBooking = () => {
  return (
    <ThemedCard>
        <ThemedText style={styles.title}>Quick Booking</ThemedText>
        <Spacer height={5}></Spacer>
        <ThemedText style={styles.title}>When do you want to play</ThemedText>
        <View style={styles.buttonContainer}>
          <ThemedButton 
            title="Today" 
            textStyle={styles.title} />
          <ThemedButton 
            title="Tomorrow" 
            textStyle={styles.title} />
          </View>
    </ThemedCard>
  )
}

export default QuickBooking

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    gap:12
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
  },
});
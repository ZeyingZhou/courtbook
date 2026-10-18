import { StyleSheet } from 'react-native'
import ThemedCard from '../Themed/ThemedCard'
import ThemedText from '../Themed/ThemedText'

const TimeSlotCell = () => {
  return (
    <ThemedCard style={styles.cell}>
        <ThemedText>1</ThemedText>
    </ThemedCard>
  )
}

export default TimeSlotCell

const styles = StyleSheet.create({
  cell: {
    width: 50,
    height: 50,
    borderRadius: 20,
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
  }
})
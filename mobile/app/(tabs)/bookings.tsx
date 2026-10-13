import { StyleSheet, Text, View } from 'react-native'

const Bookings = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bookings</Text>
    </View>
  )
}

export default Bookings

const styles = StyleSheet.create({
container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
})
import ThemedText from '@/components/Themed/ThemedText'
import { StyleSheet, View } from 'react-native'

const Courts = () => {
  return (
    <View style={styles.container}>
      <ThemedText>Courts</ThemedText>
    </View>
  )
}

export default Courts

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 20,
        fontWeight: "bold"
    }
})
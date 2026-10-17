import ThemedText from '@/components/Themed/ThemedText'
import { ScrollView, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const Courts = () => {
  const insets = useSafeAreaInsets();
  return (
    <>
    <View
      style={[styles.container, {paddingTop: insets.top + 20}]}
    >
    <View>
        <ThemedText style={styles.title}>CourtBook 🎾</ThemedText>
    </View>
    
    <ScrollView horizontal>
      <ScrollView></ScrollView>
    </ScrollView>
    </View>
    </>
  )
}

export default Courts

const styles = StyleSheet.create({
    container: {
        flex:1,
        padding: 20,
        justifyContent: 'center'
    },
    title: {
        fontSize: 20,
        fontWeight: "bold"
    }
})
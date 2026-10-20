import CourtAvalibilityGrid from '@/components/courts/CourtAvalibilityGrid';
import DateSelector from '@/components/courts/DateSelector';
import FacilitySelector from '@/components/courts/FacilitySelector';
import Spacer from '@/components/Spacer';
import ThemedText from '@/components/Themed/ThemedText'
import { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
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
  const insets = useSafeAreaInsets();
  return (
    <>
    <View
      style={[styles.container, {paddingTop: insets.top + 20}]}
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
      }}
    />
    <DateSelector
      selectedDate={selectedDate}
      onDateChange={setSelectedDate}
    />
    </View>
    <ScrollView horizontal>
      <ScrollView>
        <CourtAvalibilityGrid/>
      </ScrollView>
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

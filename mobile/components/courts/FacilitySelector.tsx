import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native'
import ThemedText from '../Themed/ThemedText';
import ThemedView from '../Themed/ThemedView';
import { useColorScheme } from '../useColorScheme';
import Colors from '@/constants/Colors';

interface Facility {
  id: string;
  name: string
}

interface Props {
  facilities: Facility[]
  selectedFacilityId: string
  onFacilityChange: (id: string) => void
}

const FacilitySelector = ({facilities, selectedFacilityId, onFacilityChange}: Props) => {
  const [visible, setVisible] = useState(false)
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme].background;
  const selectedFacility = facilities.find(
    (facility) => facility.id === selectedFacilityId
  );

  const handleSelect = (id: string) => {
    onFacilityChange(id);
    setVisible(false);
  };
  return (
    <View>
      <Pressable
        style={styles.selector}
        onPress={() => setVisible(true)}
      >
        <ThemedText>{selectedFacility?.name ?? "Select Facility"}</ThemedText>
        <ThemedText>▼</ThemedText>
      </Pressable>

      
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <ThemedView style={styles.overlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setVisible(false)}
          />
          {/* Todo: Dark Mode Styling for the Modal */}
          <ThemedView style={[styles.sheet, {backgroundColor: backgroundColor}]}>
            <ThemedText style={styles.title}>Select Facility</ThemedText>

            {facilities.map((facility) => (
              <Pressable
                key={facility.id}
                style={styles.option}
                onPress={() => handleSelect(facility.id)}
              >
                <ThemedView>
                  <ThemedText>
                    {facility.name}
                    </ThemedText>
                </ThemedView>

                {selectedFacilityId === facility.id && (
                  <ThemedText>✓</ThemedText>
                )}
              </Pressable>
            ))}
          </ThemedView>
        </ThemedView>
      </Modal>
    </View>
  )
}

export default FacilitySelector

const styles = StyleSheet.create({
  selector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
  },

  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },

  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
});
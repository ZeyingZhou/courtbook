import { StyleSheet, View, ViewProps } from 'react-native'
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

type ThemedViewProps = Omit<ViewProps, 'style'> & {
  style?: ViewProps['style'];
};

const ThemedView = ({style, ...props}: ThemedViewProps) => {
    const colorScheme = useColorScheme();
  return (
    <View
        style={[
            {backgroundColor: Colors[colorScheme].background},
            style
        ]}
        {...props}
    >
    </View>
  )
}

export default ThemedView

const styles = StyleSheet.create({})
import {
  StyleSheet,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native'
import { useColorScheme } from '@/components/useColorScheme'
import Colors from '@/constants/Colors'

type ThemedCardProps = Omit<ViewProps, 'style'> & {
  style?: StyleProp<ViewStyle>
}

const ThemedCard = ({style, ...props}: ThemedCardProps) => {
  const colorSchema = useColorScheme()
  const colors = Colors[colorSchema]
  return (
    <View 
        style={[{
            backgroundColor: colors.background,
            borderColor: colors.border
        }, styles.card, style]}
        {...props}
    />
  ) 
}

export default ThemedCard

const styles = StyleSheet.create({
    card: {
        borderWidth: 2,
        borderRadius: 5,
        padding: 20
    }
})
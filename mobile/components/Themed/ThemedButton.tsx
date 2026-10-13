import {
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import ThemedText from './ThemedText';

type ThemedButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  title: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  variant?: 'primary' | 'secondary';
};

const ThemedButton = ({
  title,
  textStyle,
  style,
  variant = 'primary',
  ...props
}: ThemedButtonProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <Pressable
      {...props}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: colors[`${variant}Button`],
          borderColor: colors[`${variant}ButtonBorder`],
        },
        style,
        pressed && styles.pressed,
      ]}>
      <ThemedText style={[{ color: colors[`${variant}ButtonText`] }, textStyle]}>
        {title}
      </ThemedText>
    </Pressable>
  );
};

export default ThemedButton;

const styles = StyleSheet.create({
  btn: {
    padding: 18,
    borderRadius: 6,
    marginVertical: 10,
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.5,
  },
});
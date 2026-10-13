import { Text, type TextProps } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

const ThemedText = ({ style, ...props }: TextProps) => {
  const colorScheme = useColorScheme();
  const textColor = Colors[colorScheme].text;

  return (
    <Text {...props} style={[{ color: textColor }, style]} />
  );
};

export default ThemedText;
import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: false
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({color}) => (
            <SymbolView
              name={{ios: 'house', android: 'house', web: 'house'}}
              tintColor={color}
            />
          )
        }}
      />
      <Tabs.Screen
        name="courts"
        options={{
          title: 'Courts',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'sportscourt', android: 'stadium', web: 'stadium' }}
              tintColor={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'person.crop.circle', android: 'account_circle', web: 'account_circle' }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}

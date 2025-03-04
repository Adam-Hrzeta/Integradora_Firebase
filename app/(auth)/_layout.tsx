import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Octicons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="register"
        options={{
          title: 'Registro',
          tabBarIcon: ({ color }) => <Octicons name="people" size={24} color="black" />,
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          title: 'Inicio de sesión',
          tabBarIcon: ({ color }) => <Octicons name="people" size={24} color="black" />,
        }}
      />
      <Tabs.Screen
        name="registerVehicle"
        options={{
          title: 'Registro de vehiculo',
          tabBarIcon: ({ color }) => <Octicons name="people" size={24} color="black" />,
        }}
      />
    </Tabs>
  );
}

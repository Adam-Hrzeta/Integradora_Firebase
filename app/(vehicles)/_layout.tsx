import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AntDesign, Fontisto, Octicons, SimpleLineIcons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        // tabBarStyle: {
        //   display: 'none', // Oculta la barra de pestañas en todas las pantallas
        // },
      }}>
      <Tabs.Screen
        name="registerVehicle"
        options={{
          title: 'Registrar mis vehiculos',
          tabBarIcon: ({ color }) => <AntDesign name="addusergroup" size={24} color="black" />,
        }}
      />
      <Tabs.Screen
        name="vehicles"
        options={{
          title: 'Ver mis vehiculos',
          tabBarIcon: ({ color }) => <Fontisto name="car" size={24} color="black" />,
        }}
      />
    </Tabs>
  );
}
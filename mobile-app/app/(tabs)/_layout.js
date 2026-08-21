/*
 * (tabs)/_layout.js — bottom tab navigator for the main app
 */

import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { getColors } from '../../styles/Theme';

function TabIcon({ emoji, focused }) {
  return <Text style={{ fontSize: focused ? 24 : 20, opacity: focused ? 1 : 0.55 }}>{emoji}</Text>;
}

export default function TabsLayout() {
  const { theme } = useContext(AppContext);
  const colors = getColors(theme);

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '800', fontSize: 20 },
        headerShadowVisible: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: 'Wolt',
          headerTitleAlign: 'center',
          headerTitleStyle: { color: colors.accent, fontWeight: '800', fontSize: 26 },
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
        }}
      />
      <Tabs.Screen name="search" options={{ title: 'Search', tabBarIcon: ({ focused }) => <TabIcon emoji="🔍" focused={focused} /> }} />
      <Tabs.Screen name="orders" options={{ title: 'Orders', tabBarIcon: ({ focused }) => <TabIcon emoji="🧾" focused={focused} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} /> }} />
    </Tabs>
  );
}

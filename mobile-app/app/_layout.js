/*
 * _layout.js — ROOT layout. The entry point of the whole app.
 */

import { Stack } from 'expo-router';
import { useContext } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, AppContext } from '../context/AppContext';
import { getColors } from '../styles/Theme';

function RootStack() {
  const { theme } = useContext(AppContext);
  const colors = getColors(theme);

  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: 'minimal',
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '800' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="restaurant/[id]" options={{ title: 'Restaurant' }} />
      <Stack.Screen name="category/[name]" options={{ title: 'Category' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <RootStack />
      </AppProvider>
    </SafeAreaProvider>
  );
}

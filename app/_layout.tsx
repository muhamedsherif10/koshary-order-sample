import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ReadyAlert } from '../src/ReadyAlert';
import { StoreProvider } from '../src/store';
import { C } from '../src/ui';

export default function RootLayout() {
  return (
    <StoreProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: C.bg },
          headerTintColor: C.ink,
          headerTitleStyle: { fontWeight: '800' },
          contentStyle: { backgroundColor: C.bg },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="menu" options={{ title: 'Koshary Corner' }} />
        <Stack.Screen name="cart" options={{ title: 'Your order' }} />
        <Stack.Screen name="order/[id]" options={{ title: 'Order status' }} />
        <Stack.Screen name="cashier" options={{ title: 'الكاشير' }} />
        <Stack.Screen name="kitchen" options={{ title: 'المطبخ' }} />
      </Stack>
      <ReadyAlert />
    </StoreProvider>
  );
}

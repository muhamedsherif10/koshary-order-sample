// Demo start screen — lets a reviewer open each side of the system on one device.
// In the real product these are separate: customers install the ordering app,
// the cashier and the kitchen each sign in on their own tablet (app or web page).
import { Href, router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, SampleBanner } from '../src/ui';

const ROLES: { href: Href; title: string; body: string; who: string; dark?: boolean }[] = [
  { href: '/menu', title: 'Customer app', body: 'Browse the menu, order, and track the order status.', who: 'Customers, on their phones' },
  { href: '/cashier', title: 'Cashier · الكاشير', body: 'Receives orders, sends them to the kitchen, gets an alert when an order is ready, hands it to the driver and marks it delivered.', who: 'Restaurant counter tablet (staff login in the real product)', dark: true },
  { href: '/kitchen', title: 'Kitchen · المطبخ', body: 'Sees only the food to cook, oldest first. Starts preparing and marks orders ready.', who: 'Kitchen tablet (staff login in the real product)', dark: true },
];

export default function DemoStart() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <SampleBanner />
      <ScrollView contentContainerStyle={st.wrap}>
        <Text style={st.brand}>Koshary Corner</Text>
        <Text style={st.sub}>Direct ordering system · demo</Text>

        {ROLES.map((r) => (
          <Pressable
            key={String(r.href)}
            style={({ pressed }) => [st.card, r.dark && st.cardDark, pressed && { opacity: 0.85 }]}
            onPress={() => router.push(r.href)}
            accessibilityRole="button"
          >
            <Text style={[st.cardTitle, r.dark && { color: '#fff' }]}>{r.title}</Text>
            <Text style={[st.cardBody, r.dark && { color: '#E7E5E4' }]}>{r.body}</Text>
            <Text style={[st.cardWho, r.dark && { color: '#FDE68A' }]}>{r.who}</Text>
          </Pressable>
        ))}

        <Text style={st.note}>
          Demo flow: the customer orders → the cashier sends it to the kitchen → the kitchen starts it and marks it ready → the cashier gets an alert, sends it out and marks it delivered. Check the customer's tracking screen at any step.
        </Text>
      </ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  wrap: { flexGrow: 1, padding: 20, justifyContent: 'center', gap: 12 },
  brand: { fontSize: 30, fontWeight: '900', color: C.ink, textAlign: 'center' },
  sub: { fontSize: 14, color: C.muted, textAlign: 'center', marginBottom: 8 },
  card: { backgroundColor: C.card, borderRadius: 18, padding: 16, borderWidth: 1.5, borderColor: C.brand },
  cardDark: { backgroundColor: C.ink, borderColor: C.ink },
  cardTitle: { fontSize: 19, fontWeight: '900', color: C.brandDark, textAlign: 'left', writingDirection: 'ltr' },
  cardBody: { fontSize: 14, color: C.ink, marginTop: 4, lineHeight: 20 },
  cardWho: { fontSize: 12, color: C.muted, marginTop: 8, fontWeight: '700' },
  note: { fontSize: 12, color: C.muted, textAlign: 'center', lineHeight: 18, marginTop: 6 },
});

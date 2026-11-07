// Screen 3 — Order status for the customer. Updates when staff change the status.
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { OrderStatus, STATUS_FLOW, STATUS_LABEL } from '../../src/data';
import { useStore } from '../../src/store';
import { Button, C, SampleBanner, egp } from '../../src/ui';

// The customer doesn't need the internal "sent to kitchen" step:
// they see it as "Order received" until the kitchen starts preparing.
const CUSTOMER_STEPS: OrderStatus[] = STATUS_FLOW.filter((s) => s !== 'confirmed');
const customerStatus = (s: OrderStatus): OrderStatus => (s === 'confirmed' ? 'received' : s);

export default function OrderStatusScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state } = useStore();
  const order = state.orders.find((o) => o.id === id);

  if (!order) {
    return (
      <View style={{ flex: 1 }}>
        <SampleBanner />
        <View style={{ padding: 24, gap: 12 }}>
          <Text style={st.title}>Order not found</Text>
          <Button label="Back to menu" variant="ghost" onPress={() => router.replace('/menu')} />
        </View>
      </View>
    );
  }

  const shown = customerStatus(order.status);
  const current = CUSTOMER_STEPS.indexOf(shown);

  return (
    <View style={{ flex: 1 }}>
      <SampleBanner />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
        <View style={st.hero}>
          <Text style={st.orderNo}>Order #{order.id}</Text>
          <Text style={st.title}>{STATUS_LABEL[shown].en}</Text>
          <Text style={st.hint}>{STATUS_LABEL[shown].hint}</Text>
        </View>

        <View style={st.box}>
          {CUSTOMER_STEPS.map((s, i) => {
            const done = i <= current;
            const isNow = i === current;
            return (
              <View key={s} style={st.step}>
                <View style={st.rail}>
                  <View style={[st.dot, done && st.dotDone, isNow && st.dotNow]} />
                  {i < CUSTOMER_STEPS.length - 1 && <View style={[st.bar, i < current && st.barDone]} />}
                </View>
                <View style={{ flex: 1, paddingBottom: 18 }}>
                  <Text style={[st.stepText, done && st.stepTextDone]}>{STATUS_LABEL[s].en}</Text>
                  <Text style={st.stepAr}>{STATUS_LABEL[s].ar}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={st.box}>
          <Text style={st.section}>Summary</Text>
          {order.lines.map((l) => (
            <View key={l.item.id} style={st.row}>
              <Text style={st.rowText}>{l.qty} × {l.item.name}</Text>
              <Text style={st.rowText}>{egp(l.item.price * l.qty)}</Text>
            </View>
          ))}
          <View style={st.row}>
            <Text style={[st.rowText, st.bold]}>Total (cash on delivery)</Text>
            <Text style={[st.rowText, st.bold]}>{egp(order.total)}</Text>
          </View>
        </View>

        <Text style={st.demoNote}>
          This screen updates automatically when the restaurant changes the order status.
        </Text>
        <Button label="Back to menu" onPress={() => router.replace('/menu')} />
      </ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  hero: { backgroundColor: C.brand, borderRadius: 16, padding: 18 },
  orderNo: { color: '#FFEDD5', fontWeight: '700' },
  title: { color: '#fff', fontSize: 24, fontWeight: '900', marginTop: 4 },
  hint: { color: '#FFEDD5', marginTop: 4 },
  box: { backgroundColor: C.card, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: C.line },
  step: { flexDirection: 'row' },
  rail: { width: 26, alignItems: 'center' },
  dot: { width: 14, height: 14, borderRadius: 7, backgroundColor: C.line, marginTop: 3 },
  dotDone: { backgroundColor: C.ok },
  dotNow: { width: 18, height: 18, borderRadius: 9, borderWidth: 4, borderColor: C.okSoft, marginTop: 1 },
  bar: { width: 2, flex: 1, backgroundColor: C.line, marginVertical: 2 },
  barDone: { backgroundColor: C.ok },
  stepText: { color: C.muted, fontWeight: '700', fontSize: 15 },
  stepTextDone: { color: C.ink },
  stepAr: { color: C.muted, fontSize: 12, textAlign: 'left' },
  section: { fontWeight: '800', fontSize: 16, color: C.ink, marginBottom: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  rowText: { color: C.muted, fontSize: 14 },
  bold: { color: C.ink, fontWeight: '800' },
  demoNote: { color: C.muted, fontSize: 12, textAlign: 'center' },
});
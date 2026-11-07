// In-app alert for the cashier: pops up on the cashier screen when the kitchen
// marks an order "ready", vibrates, and lets the cashier send it out in one tap.
// In the real product the kitchen and the cashier use different devices, and
// this alert would be triggered by the back-end (e.g. a Firestore listener).
import { usePathname } from 'expo-router';
import React, { useEffect } from 'react';
import { Modal, StyleSheet, Text, Vibration, View } from 'react-native';
import { useStore } from './store';
import { Button, C } from './ui';

// The alert is for the cashier, so it only appears on the cashier screen.
const CASHIER_ROUTES = ['/cashier'];

export function ReadyAlert() {
  const { state, dispatch } = useStore();
  const pathname = usePathname();
  const onCashierSide = CASHIER_ROUTES.includes(pathname);

  const orderId = state.readyAlerts[0];
  const order = state.orders.find((o) => o.id === orderId);
  const visible = !!order && onCashierSide;

  useEffect(() => {
    if (visible) Vibration.vibrate([0, 300, 150, 300]);
  }, [visible, orderId]);

  if (!order) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => dispatch({ type: 'dismissAlert', orderId: order.id })}>
      <View style={st.backdrop}>
        <View style={st.box} accessibilityRole="alert">
          <Text style={st.bell}>🔔</Text>
          <Text style={st.title}>طلب #{order.id} جاهز</Text>
          <Text style={st.body}>سلّمه للطيار</Text>
          <View style={st.items}>
            {order.lines.map((l) => (
              <Text key={l.item.id} style={st.item}>{l.qty} × {l.item.nameAr}</Text>
            ))}
          </View>
          <Text style={st.addr}>العنوان: {order.address}</Text>
          <Button big label="خرج للتوصيل" onPress={() => dispatch({ type: 'advance', orderId: order.id })} style={{ alignSelf: 'stretch', marginTop: 14 }} />
          <Button label="تمام، بعدين" variant="ghost" onPress={() => dispatch({ type: 'dismissAlert', orderId: order.id })} style={{ alignSelf: 'stretch', marginTop: 8 }} />
          {state.readyAlerts.length > 1 && <Text style={st.more}>وفيه {state.readyAlerts.length - 1} طلب جاهز تاني</Text>}
        </View>
      </View>
    </Modal>
  );
}

const rtl = { writingDirection: 'rtl' as const, textAlign: 'right' as const };

const st = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  box: { width: '100%', maxWidth: 380, backgroundColor: C.card, borderRadius: 20, padding: 20, borderWidth: 3, borderColor: C.ok, alignItems: 'stretch' },
  bell: { fontSize: 40, textAlign: 'center' },
  title: { fontSize: 26, fontWeight: '900', color: C.ok, textAlign: 'center', marginTop: 4 },
  body: { fontSize: 17, fontWeight: '700', color: C.ink, textAlign: 'center', marginTop: 2 },
  items: { marginTop: 12, backgroundColor: C.okSoft, borderRadius: 12, padding: 10, gap: 2 },
  item: { ...rtl, fontSize: 17, fontWeight: '700', color: C.ink },
  addr: { ...rtl, color: C.muted, fontSize: 13, marginTop: 8 },
  more: { textAlign: 'center', color: C.muted, fontSize: 13, marginTop: 10 },
});

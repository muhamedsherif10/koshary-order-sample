// Screen 2 — Cart and checkout (cash on delivery in the MVP).
import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { DELIVERY_FEE, MENU } from '../src/data';
import { useStore } from '../src/store';
import { Button, C, QtyStepper, SampleBanner, egp } from '../src/ui';

export default function CartScreen() {
  const { state, dispatch, cartSubtotal } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [tried, setTried] = useState(false);

  const phoneOk = /^01\d{9}$/.test(phone.trim());
  const valid = name.trim().length > 1 && phoneOk && address.trim().length > 4;

  if (state.cart.length === 0) {
    return (
      <View style={{ flex: 1 }}>
        <SampleBanner />
        <View style={st.empty}>
          <Text style={st.emptyTitle}>Your cart is empty</Text>
          <Button label="Back to menu" variant="ghost" onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  const place = () => {
    setTried(true);
    if (!valid) return;
    const id = String(state.nextNumber);
    dispatch({ type: 'placeOrder', order: { customerName: name.trim(), phone: phone.trim(), address: address.trim(), note: note.trim() } });
    router.replace(`/order/${id}`);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SampleBanner />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
        <View style={st.box}>
          {state.cart.map((l) => {
            const item = MENU.find((m) => m.id === l.itemId)!;
            return (
              <View key={l.itemId} style={st.line}>
                <View style={{ flex: 1 }}>
                  <Text style={st.lineName}>{item.name}</Text>
                  <Text style={st.linePrice}>{egp(item.price * l.qty)}</Text>
                </View>
                <QtyStepper
                  qty={l.qty}
                  onAdd={() => dispatch({ type: 'add', itemId: l.itemId })}
                  onRemove={() => dispatch({ type: 'remove', itemId: l.itemId })}
                />
              </View>
            );
          })}
          <View style={st.sep} />
          <Row label="Subtotal" value={egp(cartSubtotal)} />
          <Row label="Delivery" value={egp(DELIVERY_FEE)} />
          <Row label="Total" value={egp(cartSubtotal + DELIVERY_FEE)} bold />
        </View>

        <View style={st.box}>
          <Text style={st.section}>Delivery details</Text>
          <Field label="Name" value={name} onChange={setName} error={tried && name.trim().length < 2 ? 'Please enter your name' : ''} />
          <Field label="Mobile number" value={phone} onChange={setPhone} keyboard="phone-pad" placeholder="01xxxxxxxxx" error={tried && !phoneOk ? 'Enter an 11-digit Egyptian mobile number' : ''} />
          <Field label="Address" value={address} onChange={setAddress} placeholder="Street, building, floor" error={tried && address.trim().length < 5 ? 'Please enter your address' : ''} />
          <Field label="Note for the kitchen (optional)" value={note} onChange={setNote} placeholder="e.g. extra onions, no shatta" />
        </View>

        <View style={st.payBox}>
          <Text style={st.payTitle}>Payment: cash on delivery</Text>
          <Text style={st.payHint}>Online payment is planned for Phase 2.</Text>
        </View>

        <Button big label={`Place order · ${egp(cartSubtotal + DELIVERY_FEE)}`} onPress={place} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={st.row}>
      <Text style={[st.rowText, bold && st.bold]}>{label}</Text>
      <Text style={[st.rowText, bold && st.bold]}>{value}</Text>
    </View>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChange: (t: string) => void;
  placeholder?: string;
  keyboard?: 'phone-pad' | 'default';
  error?: string;
}) {
  return (
    <View style={{ marginTop: 10 }}>
      <Text style={st.label}>{props.label}</Text>
      <TextInput
        value={props.value}
        onChangeText={props.onChange}
        placeholder={props.placeholder}
        placeholderTextColor="#A8A29E"
        keyboardType={props.keyboard ?? 'default'}
        style={[st.input, !!props.error && { borderColor: '#DC2626' }]}
      />
      {!!props.error && <Text style={st.err}>{props.error}</Text>}
    </View>
  );
}

const st = StyleSheet.create({
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: C.ink },
  box: { backgroundColor: C.card, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: C.line },
  line: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  lineName: { fontWeight: '700', color: C.ink, fontSize: 15 },
  linePrice: { color: C.muted, marginTop: 2 },
  sep: { height: 1, backgroundColor: C.line, marginVertical: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  rowText: { color: C.muted, fontSize: 14 },
  bold: { color: C.ink, fontWeight: '800', fontSize: 16 },
  section: { fontWeight: '800', fontSize: 16, color: C.ink },
  label: { color: C.muted, fontSize: 13, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: C.line, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: C.ink, backgroundColor: '#fff' },
  err: { color: '#DC2626', fontSize: 12, marginTop: 4 },
  payBox: { backgroundColor: C.okSoft, borderRadius: 12, padding: 12 },
  payTitle: { color: C.ok, fontWeight: '800' },
  payHint: { color: C.ok, fontSize: 12, marginTop: 2 },
});

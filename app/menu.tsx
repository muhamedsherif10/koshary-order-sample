// Screen 1 — Menu with categories and a sticky cart bar.
import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CATEGORIES, MENU } from '../src/data';
import { qtyInCart, useStore } from '../src/store';
import { C, QtyStepper, SampleBanner, egp } from '../src/ui';

export default function MenuScreen() {
  const { state, dispatch, cartCount, cartSubtotal } = useStore();
  const [active, setActive] = useState(CATEGORIES[0].id);
  const items = MENU.filter((m) => m.categoryId === active);
  const lastOrder = state.orders.find((o) => o.status !== 'delivered' && Number(o.id) >= 102);

  return (
    <View style={{ flex: 1 }}>
      <SampleBanner />

      <View style={st.topRow}>
        <Text style={st.hello}>Order directly — no app commission</Text>
      </View>

      {lastOrder && (
        <Pressable style={st.trackCard} onPress={() => router.push(`/order/${lastOrder.id}`)}>
          <Text style={st.trackText}>Order #{lastOrder.id} is in progress — tap to track</Text>
        </Pressable>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={st.chipsWrap} contentContainerStyle={st.chips}>
        {CATEGORIES.map((c) => (
          <Pressable
            key={c.id}
            onPress={() => setActive(c.id)}
            style={[st.chip, active === c.id && st.chipActive]}
            accessibilityRole="tab"
            accessibilityState={{ selected: active === c.id }}
          >
            <Text style={[st.chipText, active === c.id && st.chipTextActive]}>{c.name}</Text>
            <Text style={[st.chipAr, active === c.id && st.chipTextActive]}>{c.nameAr}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 110, gap: 10 }}
        renderItem={({ item }) => (
          <View style={st.card}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={st.name}>{item.name}</Text>
              <Text style={st.nameAr}>{item.nameAr}</Text>
              <Text style={st.desc}>{item.description}</Text>
              <Text style={st.price}>{egp(item.price)}</Text>
            </View>
            <QtyStepper
              qty={qtyInCart(state.cart, item.id)}
              onAdd={() => dispatch({ type: 'add', itemId: item.id })}
              onRemove={() => dispatch({ type: 'remove', itemId: item.id })}
            />
          </View>
        )}
      />

      {cartCount > 0 && (
        <Pressable style={st.cartBar} onPress={() => router.push('/cart')} accessibilityRole="button">
          <Text style={st.cartBarText}>View cart · {cartCount} item{cartCount > 1 ? 's' : ''}</Text>
          <Text style={st.cartBarText}>{egp(cartSubtotal)}</Text>
        </Pressable>
      )}
    </View>
  );
}

const st = StyleSheet.create({
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12 },
  hello: { color: C.muted, fontSize: 13, fontWeight: '600' },
  trackCard: { marginHorizontal: 16, marginTop: 10, backgroundColor: C.infoSoft, borderRadius: 12, padding: 12 },
  trackText: { color: C.info, fontWeight: '700' },
  chipsWrap: { flexGrow: 0 },
  chips: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  chip: { borderWidth: 1, borderColor: C.line, backgroundColor: C.card, borderRadius: 14, paddingVertical: 8, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center', minHeight: 52 },
  chipActive: { backgroundColor: C.brand, borderColor: C.brand },
  chipText: { color: C.ink, fontWeight: '700', fontSize: 14, lineHeight: 18 },
  chipAr: { color: C.muted, fontSize: 12, lineHeight: 20, includeFontPadding: true },
  chipTextActive: { color: '#fff' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: C.line },
  name: { fontSize: 16, fontWeight: '800', color: C.ink },
  nameAr: { fontSize: 13, lineHeight: 20, color: C.muted, marginTop: 1, textAlign: 'left' },
  desc: { fontSize: 13, color: C.muted, marginTop: 4 },
  price: { fontSize: 15, fontWeight: '800', color: C.brandDark, marginTop: 6 },
  cartBar: { position: 'absolute', left: 16, right: 16, bottom: 20, backgroundColor: C.brand, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 18, flexDirection: 'row', justifyContent: 'space-between' },
  cartBarText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});

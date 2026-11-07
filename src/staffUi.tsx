// Shared UI for the two staff screens (cashier and kitchen). Arabic, right-to-left,
// big text and one big button per order, because the staff are not tech-savvy.
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { OrderStatus, STATUS_LABEL } from './data';
import { Order } from './store';
import { Button, C } from './ui';

export const STATUS_COLOR: Record<OrderStatus, { bg: string; fg: string }> = {
  received: { bg: '#FEF3C7', fg: '#92400E' },
  confirmed: { bg: '#EDE9FE', fg: '#6D28D9' },
  preparing: { bg: C.brandSoft, fg: C.brandDark },
  ready: { bg: C.okSoft, fg: C.ok },
  on_the_way: { bg: C.infoSoft, fg: C.info },
  delivered: { bg: '#F5F5F4', fg: C.muted },
};

export const minutesAgo = (t: number) => Math.max(0, Math.round((Date.now() - t) / 60000));
export const agoText = (t: number) => (minutesAgo(t) === 0 ? 'الآن' : `من ${minutesAgo(t)} دقيقة`);

export function Tab({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[st.tab, active && st.tabActive]} accessibilityRole="tab" accessibilityState={{ selected: active }}>
      <Text style={[st.tabText, active && st.tabTextActive]}>{label}</Text>
    </Pressable>
  );
}

export function Banner({ text, tone = 'warn' }: { text: string; tone?: 'warn' | 'ok' }) {
  return (
    <View style={[st.banner, tone === 'ok' && { backgroundColor: C.okSoft }]}>
      <Text style={[st.bannerText, tone === 'ok' && { color: C.ok }]}>{text}</Text>
    </View>
  );
}

export function OrderCard({
  order,
  actionLabel,
  onAction,
  waitingText,
  kitchen,
}: {
  order: Order;
  actionLabel?: string | null; // button shown only if this role acts on the current status
  onAction?: () => void;
  waitingText?: string; // shown instead of a button when another role must act
  kitchen?: boolean; // kitchen view: food only, no address/phone/price
}) {
  const color = STATUS_COLOR[order.status];
  return (
    <View style={[st.card, order.status === 'received' && st.cardNew, order.status === 'ready' && st.cardReady]}>
      <View style={st.cardHead}>
        <Text style={st.orderNo}>طلب #{order.id}</Text>
        <View style={[st.badge, { backgroundColor: color.bg }]}>
          <Text style={[st.badgeText, { color: color.fg }]}>{STATUS_LABEL[order.status].ar}</Text>
        </View>
      </View>
      <Text style={[st.rtl, st.meta]}>
        {agoText(order.createdAt)}
        {kitchen ? '' : ' · الدفع كاش'}
      </Text>

      <View style={st.items}>
        {order.lines.map((l) => (
          <Text key={l.item.id} style={[st.rtl, st.item, kitchen && st.itemBig]}>
            {l.qty} × {l.item.nameAr}
          </Text>
        ))}
      </View>
      {!!order.note && <Text style={[st.rtl, st.note]}>ملاحظة: {order.note}</Text>}

      {!kitchen && (
        <>
          <Text style={[st.rtl, st.meta]}>العنوان: {order.address}</Text>
          <Text style={[st.rtl, st.meta]}>الموبايل: {order.phone}</Text>
          <Text style={[st.rtl, st.total]}>الإجمالي: {order.total} جنيه</Text>
        </>
      )}

      {actionLabel && onAction ? (
        <Button big label={actionLabel} onPress={onAction} style={{ marginTop: 12 }} />
      ) : waitingText ? (
        <Text style={[st.rtl, st.waiting]}>{waitingText}</Text>
      ) : null}
    </View>
  );
}

const rtl = { writingDirection: 'rtl' as const, textAlign: 'right' as const };

export const st = StyleSheet.create({
  rtl,
  tabs: { flexDirection: 'row-reverse', gap: 8, paddingHorizontal: 16, paddingTop: 12 },
  tab: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: C.card, borderWidth: 1, borderColor: C.line, alignItems: 'center' },
  tabActive: { backgroundColor: C.ink, borderColor: C.ink },
  tabText: { fontWeight: '800', color: C.ink, fontSize: 15 },
  tabTextActive: { color: '#fff' },
  banner: { marginHorizontal: 16, marginTop: 10, backgroundColor: '#FEF3C7', borderRadius: 12, padding: 12 },
  bannerText: { ...rtl, color: '#92400E', fontWeight: '800', fontSize: 16 },
  empty: { color: C.muted, fontSize: 16, textAlign: 'center', marginTop: 40 },
  card: { backgroundColor: C.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.line },
  cardNew: { borderColor: '#F59E0B', borderWidth: 2 },
  cardReady: { borderColor: C.ok, borderWidth: 2 },
  cardHead: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  orderNo: { ...rtl, fontSize: 22, fontWeight: '900', color: C.ink },
  badge: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5 },
  badgeText: { fontWeight: '800', fontSize: 14 },
  meta: { color: C.muted, fontSize: 13, marginTop: 4 },
  items: { marginTop: 10, gap: 2 },
  item: { fontSize: 18, fontWeight: '700', color: C.ink, lineHeight: 28 },
  itemBig: { fontSize: 22, lineHeight: 34 },
  note: { marginTop: 8, backgroundColor: '#FEF9C3', color: '#713F12', padding: 8, borderRadius: 8, fontWeight: '700', overflow: 'hidden' },
  total: { marginTop: 8, fontSize: 16, fontWeight: '800', color: C.ink },
  waiting: { marginTop: 12, color: C.muted, fontWeight: '700', fontSize: 14, backgroundColor: '#F5F5F4', padding: 10, borderRadius: 10, overflow: 'hidden' },
});

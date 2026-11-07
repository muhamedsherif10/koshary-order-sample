// Cashier screen — receives customer orders, sends them to the kitchen,
// hands ready orders to the driver, and marks them delivered.
import React, { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { ACTED_BY, NEXT_ACTION_AR, OrderStatus } from '../src/data';
import { Banner, OrderCard, Tab, st } from '../src/staffUi';
import { useStore } from '../src/store';
import { SampleBanner } from '../src/ui';

type Filter = 'active' | 'delivered';

// What needs the cashier's attention comes first.
const PRIORITY: Record<OrderStatus, number> = { ready: 0, received: 1, on_the_way: 2, confirmed: 3, preparing: 4, delivered: 5 };

export default function CashierScreen() {
  const { state, dispatch } = useStore();
  const [filter, setFilter] = useState<Filter>('active');

  const active = state.orders.filter((o) => o.status !== 'delivered');
  const list = state.orders
    .filter((o) => (filter === 'active' ? o.status !== 'delivered' : o.status === 'delivered'))
    .sort((a, b) => PRIORITY[a.status] - PRIORITY[b.status]);
  const newCount = state.orders.filter((o) => o.status === 'received').length;

  return (
    <View style={{ flex: 1 }}>
      <SampleBanner />

      <View style={st.tabs}>
        <Tab label={`الطلبات الحالية (${active.length})`} active={filter === 'active'} onPress={() => setFilter('active')} />
        <Tab label="تم التوصيل" active={filter === 'delivered'} onPress={() => setFilter('delivered')} />
      </View>

      {newCount > 0 && filter === 'active' && <Banner text={`عندك ${newCount} طلب جديد — راجعه وابعته للمطبخ`} />}

      <FlatList
        data={list}
        keyExtractor={(o) => o.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListEmptyComponent={<Text style={[st.rtl, st.empty]}>مفيش طلبات هنا</Text>}
        renderItem={({ item }) => {
          const mine = ACTED_BY[item.status] === 'cashier';
          return (
            <OrderCard
              order={item}
              actionLabel={mine ? NEXT_ACTION_AR[item.status] : null}
              onAction={() => dispatch({ type: 'advance', orderId: item.id })}
              waitingText={ACTED_BY[item.status] === 'kitchen' ? 'في المطبخ — هيوصلك تنبيه لما يجهز' : undefined}
            />
          );
        }}
      />
    </View>
  );
}

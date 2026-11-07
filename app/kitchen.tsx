// Kitchen screen — shows only the orders the cashier sent to the kitchen,
// oldest first, with the food in big text. No prices, addresses or phone numbers.
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { NEXT_ACTION_AR } from '../src/data';
import { Banner, OrderCard, st } from '../src/staffUi';
import { useStore } from '../src/store';
import { SampleBanner } from '../src/ui';

export default function KitchenScreen() {
  const { state, dispatch } = useStore();

  const list = state.orders
    .filter((o) => o.status === 'confirmed' || o.status === 'preparing')
    .sort((a, b) => a.createdAt - b.createdAt); // first in, first out

  const waiting = list.filter((o) => o.status === 'confirmed').length;
  const cooking = list.filter((o) => o.status === 'preparing').length;

  return (
    <View style={{ flex: 1 }}>
      <SampleBanner />

      <Banner
        tone={waiting > 0 ? 'warn' : 'ok'}
        text={waiting > 0 ? `${waiting} طلب مستني يبدأ · ${cooking} بيتحضر` : `${cooking} طلب بيتحضر`}
      />

      <FlatList
        data={list}
        keyExtractor={(o) => o.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListEmptyComponent={<Text style={[st.rtl, st.empty]}>مفيش طلبات في المطبخ دلوقتي</Text>}
        renderItem={({ item }) => (
          <OrderCard
            kitchen
            order={item}
            actionLabel={NEXT_ACTION_AR[item.status]}
            onAction={() => dispatch({ type: 'advance', orderId: item.id })}
          />
        )}
      />
    </View>
  );
}

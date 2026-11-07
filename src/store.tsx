// Shared state for cart and orders (React Context + useReducer).
// In a real build, orders would live in a back-end (e.g. Firebase/Supabase)
// so the staff device and the customer's phone see the same data in real time.
// In this sample both screens share in-memory state on one device.

import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { DELIVERY_FEE, MENU, MenuItem, OrderStatus, STATUS_FLOW } from './data';

export type CartLine = { itemId: string; qty: number };

export type Order = {
  id: string;
  lines: { item: MenuItem; qty: number }[];
  customerName: string;
  phone: string;
  address: string;
  note: string;
  subtotal: number;
  total: number;
  status: OrderStatus;
  createdAt: number;
};

// readyAlerts: orders that just became ready and the cashier hasn't acknowledged yet.
type State = { cart: CartLine[]; orders: Order[]; nextNumber: number; readyAlerts: string[] };

type Action =
  | { type: 'add'; itemId: string }
  | { type: 'remove'; itemId: string }
  | { type: 'clearCart' }
  | { type: 'placeOrder'; order: Omit<Order, 'id' | 'status' | 'createdAt' | 'lines' | 'subtotal' | 'total'> }
  | { type: 'advance'; orderId: string }
  | { type: 'dismissAlert'; orderId: string };

const findItem = (id: string) => MENU.find((m) => m.id === id)!;

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add': {
      const exists = state.cart.find((l) => l.itemId === action.itemId);
      const cart = exists
        ? state.cart.map((l) => (l.itemId === action.itemId ? { ...l, qty: l.qty + 1 } : l))
        : [...state.cart, { itemId: action.itemId, qty: 1 }];
      return { ...state, cart };
    }
    case 'remove': {
      const cart = state.cart
        .map((l) => (l.itemId === action.itemId ? { ...l, qty: l.qty - 1 } : l))
        .filter((l) => l.qty > 0);
      return { ...state, cart };
    }
    case 'clearCart':
      return { ...state, cart: [] };
    case 'placeOrder': {
      const lines = state.cart.map((l) => ({ item: findItem(l.itemId), qty: l.qty }));
      const subtotal = lines.reduce((s, l) => s + l.item.price * l.qty, 0);
      const order: Order = {
        ...action.order,
        id: String(state.nextNumber),
        lines,
        subtotal,
        total: subtotal + DELIVERY_FEE,
        status: 'received',
        createdAt: Date.now(),
      };
      return { ...state, cart: [], orders: [order, ...state.orders], nextNumber: state.nextNumber + 1 };
    }
    case 'advance': {
      let becameReady = false;
      const orders = state.orders.map((o) => {
        if (o.id !== action.orderId) return o;
        const i = STATUS_FLOW.indexOf(o.status);
        if (i >= STATUS_FLOW.length - 1) return o;
        const next = STATUS_FLOW[i + 1];
        becameReady = next === 'ready';
        return { ...o, status: next };
      });
      // Notify the cashier when the kitchen marks an order ready;
      // clear the alert once the order moves on.
      const readyAlerts = becameReady
        ? [...state.readyAlerts, action.orderId]
        : state.readyAlerts.filter((id) => id !== action.orderId);
      return { ...state, orders, readyAlerts };
    }
    case 'dismissAlert':
      return { ...state, readyAlerts: state.readyAlerts.filter((id) => id !== action.orderId) };
  }
}

// Two demo orders so the staff screen is not empty on first open.
const seedOrders: Order[] = [
  {
    id: '100',
    lines: [{ item: findItem('k2'), qty: 2 }, { item: findItem('r2'), qty: 2 }],
    customerName: 'Demo customer A',
    phone: '01000000000',
    address: 'عنوان تجريبي، مدينة نصر',
    note: 'بصل زيادة لو سمحت',
    subtotal: 140,
    total: 155,
    status: 'preparing',
    createdAt: Date.now() - 12 * 60 * 1000,
  },
  {
    id: '99',
    lines: [{ item: findItem('k4'), qty: 1 }],
    customerName: 'Demo customer B',
    phone: '01100000000',
    address: 'عنوان تجريبي، مصر الجديدة',
    note: '',
    subtotal: 220,
    total: 235,
    status: 'on_the_way',
    createdAt: Date.now() - 25 * 60 * 1000,
  },
];

seedOrders.unshift({
  id: '101',
  lines: [{ item: findItem('k1'), qty: 3 }, { item: findItem('d1'), qty: 1 }],
  customerName: 'Demo customer C',
  phone: '01200000000',
  address: 'عنوان تجريبي، المعادي',
  note: 'من غير شطة',
  subtotal: 130,
  total: 145,
  status: 'confirmed',
  createdAt: Date.now() - 4 * 60 * 1000,
});

const initialState: State = { cart: [], orders: seedOrders, nextNumber: 102, readyAlerts: [] };

type Ctx = {
  state: State;
  dispatch: React.Dispatch<Action>;
  cartCount: number;
  cartSubtotal: number;
};

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => {
    const cartCount = state.cart.reduce((s, l) => s + l.qty, 0);
    const cartSubtotal = state.cart.reduce((s, l) => s + findItem(l.itemId).price * l.qty, 0);
    return { state, dispatch, cartCount, cartSubtotal };
  }, [state]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}

export const qtyInCart = (cart: CartLine[], itemId: string) =>
  cart.find((l) => l.itemId === itemId)?.qty ?? 0;

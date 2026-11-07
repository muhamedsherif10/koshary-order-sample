import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

export const C = {
  bg: '#FBF7F2',
  card: '#FFFFFF',
  ink: '#1F1A17',
  muted: '#6F655E',
  line: '#EAE2D8',
  brand: '#C2410C', // tomato-sauce orange
  brandDark: '#9A3412',
  brandSoft: '#FFEDD5',
  ok: '#15803D',
  okSoft: '#DCFCE7',
  info: '#1D4ED8',
  infoSoft: '#DBEAFE',
};

export const egp = (n: number) => `EGP ${n}`;

export function SampleBanner() {
  return (
    <View style={s.banner}>
      <Text style={s.bannerText}>SAMPLE · demo data, not a real restaurant</Text>
    </View>
  );
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  style,
  big,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost';
  disabled?: boolean;
  style?: ViewStyle;
  big?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        s.btn,
        big && s.btnBig,
        variant === 'primary' ? s.btnPrimary : s.btnGhost,
        disabled && { opacity: 0.4 },
        pressed && { opacity: 0.8 },
        style,
      ]}
    >
      <Text style={[s.btnText, big && { fontSize: 18 }, variant === 'ghost' && { color: C.brand }]}>{label}</Text>
    </Pressable>
  );
}

export function QtyStepper({ qty, onAdd, onRemove }: { qty: number; onAdd: () => void; onRemove: () => void }) {
  if (qty === 0) {
    return (
      <Pressable accessibilityLabel="Add" onPress={onAdd} style={s.addBtn}>
        <Text style={s.addBtnText}>+ Add</Text>
      </Pressable>
    );
  }
  return (
    <View style={s.stepper}>
      <Pressable accessibilityLabel="Remove one" onPress={onRemove} style={s.stepBtn}>
        <Text style={s.stepText}>−</Text>
      </Pressable>
      <Text style={s.qty}>{qty}</Text>
      <Pressable accessibilityLabel="Add one" onPress={onAdd} style={s.stepBtn}>
        <Text style={s.stepText}>+</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  banner: { backgroundColor: '#1F1A17', paddingVertical: 4, alignItems: 'center' },
  bannerText: { color: '#FDE68A', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  btn: { borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center' },
  btnBig: { paddingVertical: 16 },
  btnPrimary: { backgroundColor: C.brand },
  btnGhost: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: C.brand },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  addBtn: { backgroundColor: C.brandSoft, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14 },
  addBtnText: { color: C.brandDark, fontWeight: '700' },
  stepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.brandSoft, borderRadius: 10 },
  stepBtn: { paddingHorizontal: 12, paddingVertical: 6 },
  stepText: { color: C.brandDark, fontSize: 18, fontWeight: '800' },
  qty: { minWidth: 18, textAlign: 'center', fontWeight: '800', color: C.ink },
});

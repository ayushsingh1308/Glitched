import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { colors, radius, shadow } from '../theme';

export function Button({ title, onPress, variant = 'primary', disabled, style }) {
  const bg = variant === 'primary' ? colors.primary : variant === 'danger' ? colors.danger : variant === 'accent' ? colors.accent : 'transparent';
  const outlined = variant === 'outline';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bg, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
        outlined && { borderWidth: 1.5, borderColor: colors.primary },
        style,
      ]}
    >
      <Text style={[styles.btnText, outlined && { color: colors.primary }]}>{title}</Text>
    </Pressable>
  );
}

export function Card({ children, style, onPress }) {
  const Wrapper = onPress ? Pressable : View;
  return (
    <Wrapper onPress={onPress} style={[styles.card, style]}>
      {children}
    </Wrapper>
  );
}

export function Chip({ label, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && { backgroundColor: colors.primary, borderColor: colors.primary }]}>
      <Text style={[styles.chipText, active && { color: '#fff' }]}>{label}</Text>
    </Pressable>
  );
}

export function ProgressBar({ value }) {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${Math.min(1, Math.max(0, value)) * 100}%` }]} />
    </View>
  );
}

export function Empty({ text }) {
  return (
    <View style={{ padding: 32, alignItems: 'center' }}>
      <Text style={{ color: colors.muted, textAlign: 'center' }}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  btn: { paddingVertical: 13, paddingHorizontal: 18, borderRadius: radius, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  card: { backgroundColor: colors.card, borderRadius: radius, padding: 16, marginBottom: 12, ...shadow },
  chip: { paddingVertical: 7, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1, borderColor: colors.border, backgroundColor: '#fff', marginRight: 8 },
  chipText: { color: colors.text, fontWeight: '600', fontSize: 13 },
  track: { height: 10, backgroundColor: '#ede9fe', borderRadius: 999, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.primary },
});

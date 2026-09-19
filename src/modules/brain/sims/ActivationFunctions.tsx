import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { GlassCard, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { calcActivation } from '../logic';

type FuncType = 'sigmoid' | 'relu' | 'leaky_relu' | 'gelu';

export const ActivationFunctions: React.FC = () => {
  const { colors, spacing, radius } = useTheme();
  const [func, setFunc] = useState<FuncType>('relu');
  const [inputVal, setInputVal] = useState(1.5);

  const { y, derivative } = calcActivation(func, inputVal);

  const funcs: { id: FuncType; name: string }[] = [
    { id: 'relu', name: 'ReLU' },
    { id: 'gelu', name: 'GELU' },
    { id: 'sigmoid', name: 'Sigmoid' },
    { id: 'leaky_relu', name: 'Leaky ReLU' },
  ];

  return (
    <GlassCard elevation="md" style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: colors.primaryMuted, borderRadius: radius.md }]}>
          <Icon name="pulse-outline" size={24} color={colors.primary} />
        </View>
        <View style={styles.flex}>
          <Text variant="bodyStrong">Activation Explorer</Text>
          <Text variant="caption" color="textSecondary">
            Non-linearity prevents deep neural nets from collapsing into simple linear models.
          </Text>
        </View>
      </View>

      {/* Function Selector */}
      <View style={[styles.selectorRow, { gap: spacing.xs }]}>
        {funcs.map(f => {
          const active = func === f.id;
          return (
            <Pressable
              key={f.id}
              onPress={() => setFunc(f.id)}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? colors.primary : colors.surfaceAlt,
                  borderRadius: radius.pill,
                },
              ]}
            >
              <Text variant="caption" style={{ color: active ? colors.onPrimary : colors.text, fontWeight: active ? '700' : '500' }}>
                {f.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Input Slider Simulation */}
      <View style={[styles.controlBox, { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md }]}>
        <View style={styles.rowBetween}>
          <Text variant="label">Input Signal (x): {inputVal > 0 ? `+${inputVal.toFixed(1)}` : inputVal.toFixed(1)}</Text>
        </View>
        <View style={styles.buttonRow}>
          {[-3, -1.5, 0, 1.5, 3].map(val => (
            <Pressable
              key={val}
              onPress={() => setInputVal(val)}
              style={[
                styles.valBtn,
                {
                  backgroundColor: inputVal === val ? colors.accent + '33' : colors.surfaceAlt,
                  borderColor: inputVal === val ? colors.accent : colors.glassBorder,
                  borderRadius: radius.sm,
                },
              ]}
            >
              <Text variant="caption" color={inputVal === val ? 'accent' : 'text'}>
                {val > 0 ? `+${val}` : val}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Output Metrics */}
      <View style={styles.gridRow}>
        <View style={[styles.metricBox, { backgroundColor: colors.primaryMuted, borderRadius: radius.md }]}>
          <Text variant="label" color="primary">Output f(x)</Text>
          <Text variant="h2" color="primary">{y}</Text>
        </View>
        <View style={[styles.metricBox, { backgroundColor: colors.accentMuted, borderRadius: radius.md }]}>
          <Text variant="label" color="accent">Gradient df/dx</Text>
          <Text variant="h2" color="accent">{derivative}</Text>
        </View>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  card: { gap: 14, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  selectorRow: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { paddingHorizontal: 12, paddingVertical: 6 },
  controlBox: { gap: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  buttonRow: { flexDirection: 'row', gap: 6, justifyContent: 'space-between' },
  valBtn: { flex: 1, alignItems: 'center', paddingVertical: 6, borderWidth: StyleSheet.hairlineWidth },
  gridRow: { flexDirection: 'row', gap: 10 },
  metricBox: { flex: 1, padding: 12, alignItems: 'center', gap: 4 },
});

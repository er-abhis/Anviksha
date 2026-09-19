import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { GlassCard, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { calcGradientDescentStep } from '../logic';

export const GradientDescent: React.FC = () => {
  const { colors, spacing, radius } = useTheme();
  const [posX, setPosX] = useState(-1.5);
  const [lr, setLr] = useState(0.2);
  const [momentum, setMomentum] = useState(0.0);
  const [velocity, setVelocity] = useState(0.0);

  const { loss, grad, velocity: nextVel, nextX } = calcGradientDescentStep(posX, lr, momentum, velocity);

  const takeStep = () => {
    setVelocity(nextVel);
    setPosX(nextX);
  };

  const resetState = () => {
    setPosX(-1.5);
    setVelocity(0.0);
  };

  return (
    <GlassCard elevation="md" style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: colors.primaryMuted, borderRadius: radius.md }]}>
          <Icon name="trending-down-outline" size={24} color={colors.primary} />
        </View>
        <View style={styles.flex}>
          <Text variant="bodyStrong">Gradient Descent</Text>
          <Text variant="caption" color="textSecondary">
            Walk down the loss slope $L(x) = (x-2)^2 + 1$ towards global minimum $x = 2.0$.
          </Text>
        </View>
      </View>

      {/* Parameter Sliders / Presets */}
      <View style={[styles.paramBox, { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md }]}>
        <View style={styles.rowBetween}>
          <Text variant="label">Learning Rate (lr): {lr}</Text>
        </View>
        <View style={styles.btnRow}>
          {[0.05, 0.2, 0.5, 0.9].map(rate => (
            <Pressable
              key={rate}
              onPress={() => setLr(rate)}
              style={[
                styles.smallBtn,
                {
                  backgroundColor: lr === rate ? colors.primary : colors.surfaceAlt,
                  borderRadius: radius.pill,
                },
              ]}
            >
              <Text variant="caption" style={{ color: lr === rate ? colors.onPrimary : colors.text }}>
                {rate} {rate === 0.9 ? '(High)' : rate === 0.05 ? '(Slow)' : ''}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Position Metrics & Loss Display */}
      <View style={styles.metricsRow}>
        <View style={[styles.statBox, { backgroundColor: colors.surface, borderRadius: radius.md }]}>
          <Text variant="label" color="textSecondary">Position x</Text>
          <Text variant="h2" color="primary">{posX.toFixed(2)}</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: colors.surface, borderRadius: radius.md }]}>
          <Text variant="label" color="textSecondary">Loss L(x)</Text>
          <Text variant="h2" color={loss < 1.1 ? 'success' : 'warning'}>{loss.toFixed(2)}</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: colors.surface, borderRadius: radius.md }]}>
          <Text variant="label" color="textSecondary">Gradient</Text>
          <Text variant="h2" color="accent">{grad.toFixed(2)}</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.ctrlRow}>
        <Pressable
          onPress={takeStep}
          style={[styles.actionBtn, { backgroundColor: colors.primary, borderRadius: radius.md }]}
        >
          <Icon name="play-outline" size={18} color={colors.onPrimary} />
          <Text variant="button" color="textInverse">Take 1 Step</Text>
        </Pressable>
        <Pressable
          onPress={resetState}
          style={[styles.resetBtn, { backgroundColor: colors.surfaceAlt, borderRadius: radius.md }]}
        >
          <Icon name="refresh-outline" size={18} color={colors.text} />
          <Text variant="button" color="text">Reset</Text>
        </Pressable>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  card: { gap: 14, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  paramBox: { gap: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  btnRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  smallBtn: { paddingHorizontal: 10, paddingVertical: 5 },
  metricsRow: { flexDirection: 'row', gap: 8 },
  statBox: { flex: 1, padding: 10, alignItems: 'center', gap: 2 },
  ctrlRow: { flexDirection: 'row', gap: 8 },
  actionBtn: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12 },
  resetBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12 },
});

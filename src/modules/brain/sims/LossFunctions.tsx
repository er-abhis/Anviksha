import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { GlassCard, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { calcLossMetrics } from '../logic';

export const LossFunctions: React.FC = () => {
  const { colors, spacing, radius } = useTheme();
  const [yTrue] = useState(1.0);
  const [yPred, setYPred] = useState(0.2);

  const { diff, mse, mae, huber, crossEntropy } = calcLossMetrics(yTrue, yPred);

  return (
    <GlassCard elevation="md" style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: colors.primaryMuted, borderRadius: radius.md }]}>
          <Icon name="analytics-outline" size={24} color={colors.primary} />
        </View>
        <View style={styles.flex}>
          <Text variant="bodyStrong">Loss Functions</Text>
          <Text variant="caption" color="textSecondary">
            Measure prediction error penalties: quadratic (MSE), linear (MAE), or logarithmic (Cross-Entropy).
          </Text>
        </View>
      </View>

      {/* Prediction selector */}
      <View style={[styles.sliderBox, { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md }]}>
        <View style={styles.rowBetween}>
          <Text variant="label">True Value y = {yTrue.toFixed(1)}</Text>
          <Text variant="label" color="primary">Predicted y_pred = {yPred.toFixed(2)}</Text>
        </View>
        <View style={styles.btnRow}>
          {[0.0, 0.25, 0.5, 0.75, 1.0].map(val => (
            <Pressable
              key={val}
              onPress={() => setYPred(val)}
              style={[
                styles.valBtn,
                {
                  backgroundColor: yPred === val ? colors.primary : colors.surfaceAlt,
                  borderRadius: radius.sm,
                },
              ]}
            >
              <Text variant="caption" style={{ color: yPred === val ? colors.onPrimary : colors.text }}>
                {val.toFixed(2)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Loss Penalty Grid */}
      <View style={styles.lossGrid}>
        <View style={[styles.lossCard, { backgroundColor: colors.surface, borderRadius: radius.md }]}>
          <Text variant="label" color="textSecondary">MSE (y - y_pred)^2</Text>
          <Text variant="h2" color="warning">{mse}</Text>
          <Text variant="caption" color="textTertiary">Squares errors (outlier sensitive)</Text>
        </View>
        <View style={[styles.lossCard, { backgroundColor: colors.surface, borderRadius: radius.md }]}>
          <Text variant="label" color="textSecondary">MAE $|y - \hat{y}|$</Text>
          <Text variant="h2" color="primary">{mae}</Text>
          <Text variant="caption" color="textTertiary">Linear penalty (robust)</Text>
        </View>
        <View style={[styles.lossCard, { backgroundColor: colors.surface, borderRadius: radius.md }]}>
          <Text variant="label" color="textSecondary">Huber Loss ($\delta=1$)</Text>
          <Text variant="h2" color="accent">{huber}</Text>
          <Text variant="caption" color="textTertiary">Smooth quadratic + linear blend</Text>
        </View>
        <View style={[styles.lossCard, { backgroundColor: colors.surface, borderRadius: radius.md }]}>
          <Text variant="label" color="textSecondary">Cross-Entropy</Text>
          <Text variant="h2" color="accentAlt">{crossEntropy}</Text>
          <Text variant="caption" color="textTertiary">Log loss for probabilities</Text>
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
  sliderBox: { gap: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  btnRow: { flexDirection: 'row', gap: 6 },
  valBtn: { flex: 1, alignItems: 'center', paddingVertical: 6 },
  lossGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  lossCard: { width: '48%', padding: 10, gap: 2 },
});

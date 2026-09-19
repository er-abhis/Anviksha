import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, GlassCard, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { useProgressStore } from '../../../store';
import { trainingCurves } from '../logic';

export const OverfittingDefenderGame: React.FC = () => {
  const { colors, spacing, radius } = useTheme();
  const [complexity, setComplexity] = useState(8);
  const [noise, setNoise] = useState(0.5);
  const [epochs, setEpochs] = useState(30);

  const addXp = useProgressStore(s => s.addXp);

  const { train, val, verdict } = trainingCurves({ complexity, noise, epochs });
  const finalTrain = train[train.length - 1];
  const finalVal = val[val.length - 1];
  const gap = +(finalTrain - finalVal).toFixed(2);

  const isBalanced = verdict === 'Good fit';

  return (
    <GlassCard elevation="md" style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: colors.accentMuted, borderRadius: radius.md }]}>
          <Icon name="shield-checkmark-outline" size={24} color={colors.accent} />
        </View>
        <View style={styles.flex}>
          <Text variant="bodyStrong">Game 3: Overfitting Defender 🛡️</Text>
          <Text variant="caption" color="textSecondary">
            Tune model complexity and regularization to eliminate the train-vs-validation gap!
          </Text>
        </View>
      </View>

      {/* Control Sliders / Presets */}
      <View style={[styles.controlCard, { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md }]}>
        <View style={styles.rowBetween}>
          <Text variant="label">Model Complexity (Degree): {complexity}</Text>
        </View>
        <View style={styles.btnRow}>
          {[1, 3, 5, 8, 10].map(c => (
            <Pressable
              key={c}
              onPress={() => setComplexity(c)}
              style={[
                styles.valBtn,
                {
                  backgroundColor: complexity === c ? colors.primary : colors.surfaceAlt,
                  borderRadius: radius.sm,
                },
              ]}
            >
              <Text variant="caption" style={{ color: complexity === c ? colors.onPrimary : colors.text }}>
                Degree {c}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Accuracy Output Meter */}
      <View style={styles.metricsRow}>
        <View style={[styles.metric, { backgroundColor: colors.surface, borderRadius: radius.md }]}>
          <Text variant="label" color="textSecondary">Train Accuracy</Text>
          <Text variant="h2" color="primary">{(finalTrain * 100).toFixed(0)}%</Text>
        </View>
        <View style={[styles.metric, { backgroundColor: colors.surface, borderRadius: radius.md }]}>
          <Text variant="label" color="textSecondary">Validation Accuracy</Text>
          <Text variant="h2" color={isBalanced ? 'success' : 'warning'}>{(finalVal * 100).toFixed(0)}%</Text>
        </View>
        <View style={[styles.metric, { backgroundColor: colors.surface, borderRadius: radius.md }]}>
          <Text variant="label" color="textSecondary">Status</Text>
          <Text variant="bodyStrong" color={isBalanced ? 'success' : verdict === 'Overfitting' ? 'warning' : 'accent'}>
            {verdict}
          </Text>
        </View>
      </View>

      {/* Status Box */}
      <View
        style={[
          styles.statusBox,
          {
            backgroundColor: isBalanced ? colors.success + '22' : colors.warning + '22',
            borderRadius: radius.md,
          },
        ]}
      >
        <Icon name={isBalanced ? 'checkmark-circle' : 'alert-circle-outline'} size={22} color={isBalanced ? colors.success : colors.warning} />
        <View style={styles.flex}>
          <Text variant="bodyStrong" color={isBalanced ? 'success' : 'warning'}>
            {isBalanced ? 'Model Perfectly Balanced! +50 XP' : `Train-Val Gap: ${gap} (Target: <0.15)`}
          </Text>
          <Text variant="caption" color="textSecondary">
            {isBalanced ? 'Optimal generalization achieved!' : 'Lower model complexity or reduce noise to reach a Good fit.'}
          </Text>
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
  controlCard: { gap: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  btnRow: { flexDirection: 'row', gap: 6 },
  valBtn: { flex: 1, alignItems: 'center', paddingVertical: 6 },
  metricsRow: { flexDirection: 'row', gap: 8 },
  metric: { flex: 1, padding: 10, alignItems: 'center', gap: 2 },
  statusBox: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12 },
});

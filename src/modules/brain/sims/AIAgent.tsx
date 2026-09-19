import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { GlassCard, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { AGENT_STEPS } from '../logic';

export const AIAgent: React.FC = () => {
  const { colors, spacing, radius } = useTheme();
  const [activeStep, setActiveStep] = useState(0);

  const step = AGENT_STEPS[activeStep];

  const nextStep = () => {
    setActiveStep(prev => (prev + 1) % AGENT_STEPS.length);
  };

  return (
    <GlassCard elevation="md" style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: colors.primaryMuted, borderRadius: radius.md }]}>
          <Icon name="hardware-chip-outline" size={24} color={colors.primary} />
        </View>
        <View style={styles.flex}>
          <Text variant="bodyStrong">AI Agent Tool Loop</Text>
          <Text variant="caption" color="textSecondary">
            Autonomous loop: Perceive $\rightarrow$ Reason $\rightarrow$ Tool Execution $\rightarrow$ Environment Feedback.
          </Text>
        </View>
      </View>

      {/* Step Indicator Row */}
      <View style={styles.stepIndicatorRow}>
        {AGENT_STEPS.map((item, idx) => {
          const active = activeStep === idx;
          const completed = activeStep > idx;
          return (
            <Pressable
              key={item.phase}
              onPress={() => setActiveStep(idx)}
              style={[
                styles.stepPill,
                {
                  backgroundColor: active
                    ? colors.primary
                    : completed
                    ? colors.success + '33'
                    : colors.surfaceAlt,
                  borderRadius: radius.pill,
                },
              ]}
            >
              <Text
                variant="caption"
                style={{
                  color: active ? colors.onPrimary : completed ? colors.success : colors.textSecondary,
                  fontWeight: active ? '700' : '500',
                }}
              >
                {idx + 1}. {item.phase}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Current Step Detail Box */}
      <View style={[styles.stepBox, { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md }]}>
        <View style={styles.rowGap}>
          <Icon name={step.icon} size={22} color={colors.primary} />
          <Text variant="bodyStrong" color="primary">{step.title}</Text>
        </View>
        <Text variant="body" color="text" style={{ marginTop: 4 }}>
          {step.description}
        </Text>
      </View>

      {/* Step Action Button */}
      <Pressable
        onPress={nextStep}
        style={[styles.actionBtn, { backgroundColor: colors.primary, borderRadius: radius.md }]}
      >
        <Text variant="button" color="textInverse">
          {activeStep === AGENT_STEPS.length - 1 ? 'Restart Agent Loop 🔄' : 'Advance Agent Step ➔'}
        </Text>
      </Pressable>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  card: { gap: 14, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  stepIndicatorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  stepPill: { paddingHorizontal: 10, paddingVertical: 5 },
  stepBox: { gap: 6 },
  rowGap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  actionBtn: { alignItems: 'center', paddingVertical: 12 },
});

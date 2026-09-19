import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { GlassCard, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { PROMPT_STYLES } from '../logic';

export const PromptPlayground: React.FC = () => {
  const { colors, spacing, radius } = useTheme();
  const [styleKey, setStyleKey] = useState<'zero-shot' | 'few-shot' | 'chain-of-thought'>('chain-of-thought');

  const meta = PROMPT_STYLES[styleKey];

  return (
    <GlassCard elevation="md" style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: colors.primaryMuted, borderRadius: radius.md }]}>
          <Icon name="chatbubbles-outline" size={24} color={colors.primary} />
        </View>
        <View style={styles.flex}>
          <Text variant="bodyStrong">Prompt Engineering Lab</Text>
          <Text variant="caption" color="textSecondary">
            Structure your instructions to guide language models towards step-by-step reasoning.
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={[styles.tabRow, { gap: spacing.xs }]}>
        {(['zero-shot', 'few-shot', 'chain-of-thought'] as const).map(key => {
          const active = styleKey === key;
          return (
            <Pressable
              key={key}
              onPress={() => setStyleKey(key)}
              style={[
                styles.tabBtn,
                {
                  backgroundColor: active ? colors.primary : colors.surfaceAlt,
                  borderRadius: radius.pill,
                },
              ]}
            >
              <Text variant="caption" style={{ color: active ? colors.onPrimary : colors.text, fontWeight: active ? '700' : '500' }}>
                {key === 'zero-shot' ? 'Zero-Shot' : key === 'few-shot' ? 'Few-Shot' : 'CoT Reasoning'}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Code Prompt Box */}
      <View style={[styles.codeBox, { backgroundColor: colors.surface, borderRadius: radius.md, borderColor: colors.glassBorder }]}>
        <Text variant="label" color="textSecondary" style={styles.boxLabel}>PROMPT TEMPLATE</Text>
        <Text variant="body" color="text" style={styles.monoText}>{meta.template}</Text>
      </View>

      {/* Output Response */}
      <View style={[styles.codeBox, { backgroundColor: colors.primaryMuted + '44', borderRadius: radius.md, borderColor: colors.primary + '33' }]}>
        <View style={styles.rowBetween}>
          <Text variant="label" color="primary">MODEL RESPONSE</Text>
          <View style={[styles.badge, { backgroundColor: colors.success + '22' }]}>
            <Text variant="caption" color="success">Accuracy {meta.accuracyScore}%</Text>
          </View>
        </View>
        <Text variant="bodyStrong" color="text" style={[styles.monoText, { marginTop: 4 }]}>
          {meta.output}
        </Text>
      </View>

      {/* Reasoning Breakdown */}
      <View style={[styles.reasonBox, { backgroundColor: colors.surfaceAlt, borderRadius: radius.md, padding: spacing.md }]}>
        <Text variant="label" color="textSecondary">BEHIND THE SCENES</Text>
        {meta.reasoningSteps.map((step, idx) => (
          <View key={idx} style={styles.stepRow}>
            <Icon name="checkmark-circle-outline" size={16} color={colors.accent} />
            <Text variant="caption" color="textSecondary" style={styles.flex}>{step}</Text>
          </View>
        ))}
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  card: { gap: 14, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  tabRow: { flexDirection: 'row', flexWrap: 'wrap' },
  tabBtn: { paddingHorizontal: 12, paddingVertical: 6 },
  codeBox: { padding: 12, gap: 4, borderWidth: StyleSheet.hairlineWidth },
  boxLabel: { fontSize: 10, letterSpacing: 0.8 },
  monoText: { fontFamily: 'PlatformFont', fontSize: 13, lineHeight: 18 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  reasonBox: { gap: 6 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});

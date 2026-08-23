import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { Gradient, GlassCard, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { LabArchitecture } from '../types';
import { localProvider } from '../provider/LocalSimulationProvider';
import { SimTurn } from '../provider/AIProvider';
import { samplesFor } from '../simulator/scenarios';

interface SimulationPanelProps {
  architecture: LabArchitecture;
}

/** Offline "Test My AI" playground. Clearly labelled — this is not a real LLM. */
export const SimulationPanel: React.FC<SimulationPanelProps> = ({
  architecture,
}) => {
  const { colors, radius, spacing, gradients } = useTheme();
  const [turn, setTurn] = useState<SimTurn | null>(null);
  const samples = samplesFor(architecture.missionId);

  const run = async (input: string) => {
    setTurn(await localProvider.simulate(architecture, input));
  };

  return (
    <GlassCard elevation="md">
      <View style={{ gap: spacing.md }}>
        <View style={[styles.headerRow, { gap: spacing.sm }]}>
          <Icon name="play-circle" size={20} color={colors.primary} />
          <Text variant="bodyStrong" style={styles.flex}>
            Test My AI
          </Text>
          <View
            style={[
              styles.pill,
              { backgroundColor: colors.warning + '22', borderRadius: radius.pill },
            ]}
          >
            <Icon name="cloud-offline-outline" size={12} color={colors.warning} />
            <Text variant="caption" style={{ color: colors.warning }}>
              {' '}Simulation Mode
            </Text>
          </View>
        </View>

        <Text variant="caption" color="textSecondary">
          Practice mode — this runs offline with sample data to show how your
          architecture behaves. No real AI is involved.
        </Text>

        {/* Sample inputs to run through the pipeline */}
        <View style={[styles.chips, { gap: spacing.sm }]}>
          {samples.map(s => (
            <Pressable
              key={s.input}
              onPress={() => run(s.input)}
              accessibilityRole="button"
              accessibilityLabel={`Try: ${s.input}`}
              style={({ pressed }) => [
                styles.chip,
                {
                  borderRadius: radius.pill,
                  borderColor: colors.glassBorder,
                  backgroundColor: colors.glass,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.xs,
                  transform: [{ scale: pressed ? 0.96 : 1 }],
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Icon name="play" size={12} color={colors.primary} />
              <Text variant="caption" numberOfLines={1}>
                {' '}
                {s.input}
              </Text>
            </Pressable>
          ))}
        </View>

        {turn && (
          <View style={{ gap: spacing.sm }}>
            {/* Pipeline trace */}
            {turn.trace.length > 0 && (
              <Animated.View
                layout={LinearTransition}
                style={[styles.trace, { gap: spacing.xs }]}
              >
                {turn.trace.map((stage, i) => (
                  <Animated.View
                    key={`${stage}-${i}`}
                    entering={FadeInDown.delay(i * 50).springify().damping(16)}
                    style={styles.traceItem}
                  >
                    <View
                      style={[
                        styles.stage,
                        {
                          backgroundColor: colors.primaryMuted,
                          borderColor: colors.accent + '55',
                          borderRadius: radius.sm,
                        },
                      ]}
                    >
                      <Text variant="caption" color="primary">
                        {stage}
                      </Text>
                    </View>
                    {i < turn.trace.length - 1 && (
                      <Icon
                        name="arrow-forward"
                        size={12}
                        color={colors.accent}
                      />
                    )}
                  </Animated.View>
                ))}
              </Animated.View>
            )}

            {/* User input bubble */}
            <Animated.View
              entering={FadeInDown.delay(turn.trace.length * 50).springify().damping(16)}
              style={[styles.userBubble, { borderRadius: radius.lg }]}
            >
              <Gradient
                colors={gradients.brand}
                borderRadius={radius.lg}
                style={styles.bubbleFill}
              >
                <Text variant="caption" style={{ color: colors.onPrimary }}>
                  {turn.input}
                </Text>
              </Gradient>
            </Animated.View>

            {/* AI response bubble */}
            <Animated.View
              entering={FadeInDown.delay(turn.trace.length * 50 + 80).springify().damping(16)}
              style={[
                styles.aiBubble,
                {
                  backgroundColor: turn.degraded
                    ? colors.warning + '20'
                    : colors.glass,
                  borderColor: turn.degraded ? colors.warning + '55' : colors.glassBorder,
                  borderWidth: StyleSheet.hairlineWidth,
                  borderRadius: radius.lg,
                },
              ]}
            >
              <Text variant="body">{turn.output}</Text>
            </Animated.View>
          </View>
        )}
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    maxWidth: '100%',
  },
  trace: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
  traceItem: { flexDirection: 'row', alignItems: 'center' },
  stage: { paddingHorizontal: 8, paddingVertical: 4, borderWidth: StyleSheet.hairlineWidth },
  userBubble: { alignSelf: 'flex-end', maxWidth: '85%', overflow: 'hidden' },
  bubbleFill: { padding: 10 },
  aiBubble: { alignSelf: 'flex-start', maxWidth: '90%', padding: 10 },
});

import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Card, Text } from '../../../components';
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
  const { colors, radius, spacing } = useTheme();
  const [turn, setTurn] = useState<SimTurn | null>(null);
  const samples = samplesFor(architecture.missionId);

  const run = async (input: string) => {
    setTurn(await localProvider.simulate(architecture, input));
  };

  return (
    <Card elevation="sm">
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
                  borderColor: colors.border,
                  backgroundColor: colors.surfaceAlt,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.xs,
                  opacity: pressed ? 0.7 : 1,
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
              <View style={[styles.trace, { gap: spacing.xs }]}>
                {turn.trace.map((stage, i) => (
                  <View key={`${stage}-${i}`} style={styles.traceItem}>
                    <View
                      style={[
                        styles.stage,
                        {
                          backgroundColor: colors.primaryMuted,
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
                        color={colors.textTertiary}
                      />
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* User input bubble */}
            <View
              style={[
                styles.userBubble,
                { backgroundColor: colors.primary, borderRadius: radius.lg },
              ]}
            >
              <Text variant="caption" style={{ color: colors.onPrimary }}>
                {turn.input}
              </Text>
            </View>

            {/* AI response bubble */}
            <View
              style={[
                styles.aiBubble,
                {
                  backgroundColor: turn.degraded
                    ? colors.warning + '18'
                    : colors.surfaceAlt,
                  borderRadius: radius.lg,
                },
              ]}
            >
              <Text variant="body">{turn.output}</Text>
            </View>
          </View>
        )}
      </View>
    </Card>
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
  stage: { paddingHorizontal: 8, paddingVertical: 4 },
  userBubble: { alignSelf: 'flex-end', maxWidth: '85%', padding: 10 },
  aiBubble: { alignSelf: 'flex-start', maxWidth: '90%', padding: 10 },
});

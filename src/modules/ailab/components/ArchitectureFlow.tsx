import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { GlassCard, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { getComponent } from '../data/components';
import { LabComponentId } from '../types';

interface ArchitectureFlowProps {
  components: LabComponentId[];
  startLabel?: string;
  endLabel?: string;
  accent?: string;
}

/** Vertical pipeline visual: Input ↓ <components> ↓ Answer. */
export const ArchitectureFlow: React.FC<ArchitectureFlowProps> = ({
  components,
  startLabel = 'Input',
  endLabel = 'Answer',
  accent,
}) => {
  const { colors, radius, spacing } = useTheme();
  const tint = accent ?? colors.accent;

  const nodes = [
    { emoji: '📥', label: startLabel, endpoint: true },
    ...components.map(id => {
      const c = getComponent(id);
      return { emoji: c.emoji, label: c.label, endpoint: false };
    }),
    { emoji: '📤', label: endLabel, endpoint: true },
  ];

  return (
    <Animated.View layout={LinearTransition} style={styles.wrap}>
      {nodes.map((n, i) => (
        <Animated.View
          key={`${n.label}-${i}`}
          layout={LinearTransition}
          style={styles.nodeWrap}
        >
          <GlassCard
            elevation={n.endpoint ? 'sm' : 'glow'}
            padded={false}
            style={StyleSheet.flatten([
              styles.node,
              {
                borderRadius: radius.lg,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                borderColor: n.endpoint ? colors.glassBorder : tint,
                borderWidth: n.endpoint ? StyleSheet.hairlineWidth : 1.5,
              },
            ])}
          >
            <Text style={styles.emoji}>{n.emoji}</Text>
            <Text variant={n.endpoint ? 'caption' : 'bodyStrong'}>{n.label}</Text>
          </GlassCard>
          {i < nodes.length - 1 && (
            <Icon name="arrow-down" size={18} color={tint} />
          )}
        </Animated.View>
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  nodeWrap: { alignItems: 'center' },
  node: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    minWidth: 180,
    justifyContent: 'center',
  },
  emoji: { fontSize: 18 },
});

import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Card, Text } from '../../../components';
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
  const tint = accent ?? colors.primary;

  const nodes = [
    { emoji: '📥', label: startLabel, endpoint: true },
    ...components.map(id => {
      const c = getComponent(id);
      return { emoji: c.emoji, label: c.label, endpoint: false };
    }),
    { emoji: '📤', label: endLabel, endpoint: true },
  ];

  return (
    <View style={styles.wrap}>
      {nodes.map((n, i) => (
        <View key={`${n.label}-${i}`} style={styles.nodeWrap}>
          <Card
            elevation={n.endpoint ? 'none' : 'sm'}
            padded={false}
            style={StyleSheet.flatten([
              styles.node,
              {
                borderRadius: radius.md,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                backgroundColor: n.endpoint ? colors.surfaceAlt : colors.surface,
                borderColor: n.endpoint ? colors.border : tint,
              },
            ])}
          >
            <Text style={styles.emoji}>{n.emoji}</Text>
            <Text variant={n.endpoint ? 'caption' : 'bodyStrong'}>{n.label}</Text>
          </Card>
          {i < nodes.length - 1 && (
            <Icon name="arrow-down" size={18} color={colors.textTertiary} />
          )}
        </View>
      ))}
    </View>
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

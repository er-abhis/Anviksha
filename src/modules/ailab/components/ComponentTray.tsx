import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { getComponent } from '../data/components';
import { LabComponentId } from '../types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ComponentTrayProps {
  /** The components offered for this mission (solution + distractors). */
  pool: LabComponentId[];
  /** Components already placed in the workspace (shown as added/disabled). */
  placed: LabComponentId[];
  onAdd: (id: LabComponentId) => void;
}

/** Tap-to-add palette of building blocks. Placed blocks show a check + dim. */
export const ComponentTray: React.FC<ComponentTrayProps> = ({
  pool,
  placed,
  onAdd,
}) => {
  const { colors, radius, spacing } = useTheme();

  return (
    <View style={[styles.wrap, { gap: spacing.sm }]}>
      {pool.map(id => {
        const c = getComponent(id);
        const isPlaced = placed.includes(id);
        return (
          <AnimatedPressable
            key={id}
            layout={LinearTransition}
            disabled={isPlaced}
            onPress={() => onAdd(id)}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityState={{ disabled: isPlaced }}
            accessibilityLabel={`Add ${c.label}. ${c.blurb}`}
            style={({ pressed }: { pressed: boolean }) => [
              styles.chip,
              {
                borderRadius: radius.lg,
                borderColor: isPlaced ? colors.success + '55' : colors.glassBorder,
                backgroundColor: isPlaced ? colors.success + '14' : colors.glass,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                gap: spacing.xs,
                transform: [{ scale: pressed ? 0.95 : 1 }],
                opacity: pressed ? 0.85 : isPlaced ? 0.7 : 1,
              },
            ]}
          >
            <Text style={styles.emoji}>{c.emoji}</Text>
            <Text variant="caption" color={isPlaced ? 'textSecondary' : 'text'}>
              {c.label}
            </Text>
            <Icon
              name={isPlaced ? 'checkmark-circle' : 'add-circle-outline'}
              size={16}
              color={isPlaced ? colors.success : colors.accent}
            />
          </AnimatedPressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  emoji: { fontSize: 15 },
});

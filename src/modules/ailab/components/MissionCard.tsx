import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Gradient, GlassCard, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { Mission } from '../types';

interface MissionCardProps {
  mission: Mission;
  onPress: () => void;
  completed?: boolean;
}

/** Premium mission tile: accent emoji chip, difficulty pill, concept hint. */
export const MissionCard: React.FC<MissionCardProps> = ({
  mission,
  onPress,
  completed,
}) => {
  const { colors, radius, spacing } = useTheme();
  const accent = colors[mission.accent];

  return (
    <GlassCard
      elevation="glow"
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${mission.title}. ${mission.difficulty}. ${mission.tagline}`}
      style={{ overflow: 'hidden' }}
    >
      {/* Accent rail down the left edge for a designed, non-generic feel. */}
      <Gradient
        colors={[accent, accent + '00']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.rail}
      />
      <View style={[styles.row, { gap: spacing.md }]}>
        <View
          style={[
            styles.emojiChip,
            { borderRadius: radius.md, overflow: 'hidden' },
          ]}
        >
          <Gradient
            colors={[accent + '44', accent + '18']}
            borderRadius={radius.md}
            style={StyleSheet.absoluteFill}
          />
          <Text style={styles.emoji}>{mission.emoji}</Text>
        </View>

        <View style={styles.flex}>
          <View style={[styles.titleRow, { gap: spacing.sm }]}>
            <Text variant="bodyStrong" numberOfLines={1} style={styles.flex}>
              {mission.title}
            </Text>
            {completed && (
              <Icon name="checkmark-circle" size={16} color={colors.success} />
            )}
            <View
              style={[
                styles.pill,
                { backgroundColor: accent + '22', borderRadius: radius.pill },
              ]}
            >
              <Text variant="caption" style={{ color: accent }}>
                {mission.difficulty}
              </Text>
            </View>
          </View>
          <Text variant="caption" color="textSecondary" numberOfLines={1}>
            {mission.tagline}
          </Text>
          <View style={[styles.conceptRow, { gap: spacing.xxs }]}>
            <Icon name="bulb-outline" size={12} color={colors.textTertiary} />
            <Text variant="caption" color="textTertiary" numberOfLines={1} style={styles.flex}>
              {mission.concept}
            </Text>
          </View>
        </View>

        <Icon name="chevron-forward" size={18} color={colors.accent} />
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  rail: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  flex: { flex: 1 },
  emojiChip: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 24 },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  pill: { paddingHorizontal: 8, paddingVertical: 2 },
  conceptRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
});

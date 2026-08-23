import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Logo } from './Logo';
import { Text } from './Text';

export interface AchievementCardProps {
  /** Chapter/lesson title completed. */
  title: string;
  /** Short list of what was learned. */
  learned?: string[];
  /** Score percentage (0..100). */
  pct: number;
}

/**
 * A branded, self-contained completion card. Doubles as the shareable image
 * (captured via react-native-view-shot) so it must render with a SOLID
 * background — SVG gradients don't always survive an Android snapshot. Fixed
 * width keeps the exported image consistent across devices.
 */
export const AchievementCard: React.FC<AchievementCardProps> = ({ title, learned, pct }) => {
  const { colors, radius, spacing } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.primary, borderRadius: radius.lg, padding: spacing.xl }]}>
      <View style={styles.brandRow}>
        <Logo size={26} style={{ borderRadius: 8 }} />
        <Text variant="label" color="onPrimary">ANVIKSHA</Text>
        <View style={styles.flex} />
        <View style={[styles.scorePill, { backgroundColor: colors.onPrimary, borderRadius: radius.pill }]}>
          <Text variant="label" style={{ color: colors.primary }}>{`${pct}%`}</Text>
        </View>
      </View>

      <Text variant="label" color="onPrimary" style={{ marginTop: spacing.lg, opacity: 0.8 }}>
        CHAPTER COMPLETE
      </Text>
      <Text variant="h2" color="onPrimary" style={{ marginTop: spacing.xs }}>{title}</Text>

      {!!learned?.length && (
        <View style={{ marginTop: spacing.md, gap: spacing.xs }}>
          {learned.slice(0, 4).map(k => (
            <View key={k} style={styles.bullet}>
              <Text variant="body" color="onPrimary" style={{ opacity: 0.9 }}>•</Text>
              <Text variant="body" color="onPrimary" style={[styles.flex, { opacity: 0.9 }]}>{k}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={[styles.footer, { borderTopColor: colors.onPrimary, marginTop: spacing.lg, paddingTop: spacing.md }]}>
        <Text variant="caption" color="onPrimary" style={{ opacity: 0.85 }}>
          Learn AI the fun way · on Google Play
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { width: 340 },
  flex: { flex: 1 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  scorePill: { paddingHorizontal: 10, paddingVertical: 3 },
  bullet: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  footer: { borderTopWidth: StyleSheet.hairlineWidth, opacity: 0.9 },
});

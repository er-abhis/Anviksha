import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Card, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';

export interface LessonCardData {
  worldTitle: string;
  title: string;
  chapter: number;
  minutes: number;
  xp: number;
  status: 'done' | 'locked' | 'open';
  percent?: number;
}

/**
 * Compact lesson card for Home carousels (Continue / Recommended). Fixed-ish
 * height so cards line up in a snapping row. Reuses the shared Card + Text.
 */
export const LessonCard: React.FC<{ data: LessonCardData; onPress?: () => void }> = ({
  data,
  onPress,
}) => {
  const { colors, radius, spacing } = useTheme();
  const percent = data.percent || (data.status === 'done' ? 100 : 0);
  const meta =
    percent >= 100
      ? { icon: 'checkmark-circle', label: '100% Complete', color: colors.success }
      : percent > 0
      ? { icon: 'play-circle', label: `${percent}% Resume`, color: colors.primary }
      : { icon: 'play-circle', label: 'Start', color: colors.primary };

  return (
    <Card
      onPress={onPress}
      elevation="md"
      glow={percent > 0 && percent < 100}
      style={styles.card}
    >
      <View style={styles.headRow}>
        <View style={[styles.chapterPill, { backgroundColor: colors.primaryMuted, borderRadius: radius.pill }]}>
          <Text variant="caption" color="primary">{`Chapter ${data.chapter}`}</Text>
        </View>
        <Icon name={meta.icon} size={18} color={meta.color} />
      </View>
      <Text variant="label" color="textSecondary" numberOfLines={1} style={{ marginTop: spacing.xs }}>
        {data.worldTitle}
      </Text>
      <Text variant="bodyStrong" numberOfLines={2} style={styles.title}>
        {data.title}
      </Text>

      {/* Mini Progress Bar */}
      <View style={{ height: 3, backgroundColor: colors.border, borderRadius: radius.pill, marginTop: spacing.xs, overflow: 'hidden' }}>
        <View style={{ height: '100%', width: `${percent}%`, backgroundColor: meta.color, borderRadius: radius.pill }} />
      </View>

      <View style={[styles.footer, { marginTop: spacing.xs }]}>
        <View style={styles.metaItem}>
          <Icon name="time-outline" size={12} color={colors.textTertiary} />
          <Text variant="caption" color="textTertiary" style={{ fontSize: 11 }}>{`${data.minutes} min`}</Text>
        </View>
        <View style={styles.metaItem}>
          <Icon name="flash-outline" size={12} color={colors.xp} />
          <Text variant="caption" color="textTertiary" style={{ fontSize: 11 }}>{`${data.xp} XP`}</Text>
        </View>
        <View style={styles.flex} />
        <Text variant="label" style={{ color: meta.color, fontSize: 11, fontWeight: '700' }}>{meta.label}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: { minHeight: 118, justifyContent: 'flex-start' },
  flex: { flex: 1 },
  headRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chapterPill: { paddingHorizontal: 6, paddingVertical: 2 },
  title: { marginTop: 2, minHeight: 32 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
});

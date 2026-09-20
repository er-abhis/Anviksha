import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { GlassCard, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { Spotlight } from '../../../content';

/**
 * Renders the daily rotating spotlight (concept / did-you-know / try-this).
 * Content comes from `dailySpotlight`; this is purely presentational.
 */
export const SpotlightCard: React.FC<{ item: Spotlight; onPress?: () => void }> = ({
  item,
  onPress,
}) => {
  const { colors, spacing } = useTheme();

  const icon = item.kind === 'tryThis' ? 'play' : item.kind === 'didYouKnow' ? 'bulb' : item.term.icon;
  const heading = item.kind === 'tryThis' ? item.lesson.title : item.term.name;
  const body =
    item.kind === 'tryThis'
      ? item.lesson.description
      : item.kind === 'didYouKnow'
      ? item.term.example
      : item.term.simple;
  const cta = item.kind === 'tryThis' ? 'Start chapter' : 'Open glossary';

  return (
    <GlassCard elevation="lg" onPress={onPress}>
      <View style={styles.head}>
        <View style={[styles.icon, { backgroundColor: colors.primaryMuted }]}>
          <Icon name={icon} size={18} color={colors.primary} />
        </View>
        <Text variant="bodyStrong" style={styles.flex} numberOfLines={2}>{heading}</Text>
      </View>
      <Text variant="caption" color="textSecondary" style={{ marginTop: spacing.xs, lineHeight: 18 }}>
        {body}
      </Text>
      <View style={[styles.ctaRow, { marginTop: spacing.sm }]}>
        <Text variant="label" color="primary">{cta}</Text>
        <Icon name="arrow-forward" size={14} color={colors.primary} />
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  icon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  ctaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});

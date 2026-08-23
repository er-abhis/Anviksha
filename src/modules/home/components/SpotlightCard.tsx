import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Card, Text } from '../../../components';
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
    <Card elevation="md" onPress={onPress}>
      <View style={styles.head}>
        <View style={[styles.icon, { backgroundColor: colors.primaryMuted }]}>
          <Icon name={icon} size={22} color={colors.primary} />
        </View>
        <Text variant="bodyStrong" style={styles.flex} numberOfLines={2}>{heading}</Text>
      </View>
      <Text variant="body" color="textSecondary" style={{ marginTop: spacing.sm }}>
        {body}
      </Text>
      <View style={[styles.ctaRow, { marginTop: spacing.md }]}>
        <Text variant="label" color="primary">{cta}</Text>
        <Icon name="arrow-forward" size={16} color={colors.primary} />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  ctaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});

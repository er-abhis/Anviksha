import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Card, Header, Screen, SectionTitle, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { RESOURCES, Resource } from '../../../content/resources';
import { openExternal } from '../../../utils/appLinks';

/**
 * "Learn More" — curated external references for topics Anviksha introduces but
 * doesn't cover in full depth. Every item opens the real source in the system
 * browser and is clearly marked as external (not internal Anviksha content).
 */
export const LearnMoreScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const navigation = useNavigation();

  return (
    <Screen scroll contentContainerStyle={{ gap: spacing.xl }}>
      <Header title="Learn More" onBack={() => navigation.goBack()} />

      <View style={[styles.note, { backgroundColor: colors.surfaceAlt }]}>
        <Icon name="open-outline" size={16} color={colors.textSecondary} />
        <Text variant="caption" color="textSecondary" style={styles.flex}>
          These are trusted external sites and open in your browser — they’re not part of Anviksha.
        </Text>
      </View>

      {RESOURCES.map(cat => (
        <View key={cat.title}>
          <SectionTitle title={cat.title} />
          <Text variant="caption" color="textTertiary" style={{ marginBottom: spacing.sm }}>
            {cat.blurb}
          </Text>
          <View style={{ gap: spacing.sm }}>
            {cat.items.map(item => (
              <ResourceRow key={item.url} item={item} />
            ))}
          </View>
        </View>
      ))}
    </Screen>
  );
};

const ResourceRow: React.FC<{ item: Resource }> = ({ item }) => {
  const { colors, radius, spacing } = useTheme();
  return (
    <Card
      elevation="sm"
      onPress={() => openExternal(item.url)}
      accessibilityRole="link"
      accessibilityLabel={`${item.label}, opens ${item.source} in browser`}
    >
      <View style={styles.row}>
        <View style={[styles.icon, { backgroundColor: colors.primaryMuted, borderRadius: radius.md }]}>
          <Icon name="globe-outline" size={20} color={colors.primary} />
        </View>
        <View style={styles.flex}>
          <Text variant="bodyStrong" numberOfLines={2}>{item.label}</Text>
          <Text variant="caption" color="textTertiary" style={{ marginTop: 2 }}>{item.source}</Text>
        </View>
        <Icon name="open-outline" size={18} color={colors.textTertiary} style={{ marginLeft: spacing.sm }} />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  note: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
});

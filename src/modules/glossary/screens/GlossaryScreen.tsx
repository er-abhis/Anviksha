import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { EmptyState, GlassCard, Header, Screen, SearchBar, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { useAchievementsStore } from '../../../store';
import { GLOSSARY, GlossaryTerm, glossaryTerm } from '../../../content';

/** Rotating hints shown as the placeholder — only while the field is idle. */
const SEARCH_HINTS = [
  'Try: What is AGI?',
  'Search for machine learning',
  'Explore generative AI',
  'Learn about neural networks',
  'What’s an AI agent?',
];

export const GlossaryScreen: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const navigation = useNavigation();
  const unlock = useAchievementsStore(s => s.unlock);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<string | null>(null);
  const [hint, setHint] = useState(0);

  useEffect(() => {
    unlock('glossary-curious', Date.now());
  }, [unlock]);

  // Cycle the hint index; the display gate below keeps it static while typing.
  useEffect(() => {
    const id = setInterval(() => setHint(h => h + 1), 3500);
    return () => clearInterval(id);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GLOSSARY;
    return GLOSSARY.filter(
      t =>
        t.name.toLowerCase().includes(q) ||
        t.simple.toLowerCase().includes(q) ||
        t.technical.toLowerCase().includes(q),
    );
  }, [query]);

  // Rotate the placeholder hint only while the field is idle (empty query).
  const idle = query.length === 0;
  const placeholder = idle ? SEARCH_HINTS[hint % SEARCH_HINTS.length] : 'Search terms…';
  const suggestions = GLOSSARY.slice(0, 6);

  return (
    <Screen scroll contentContainerStyle={{ gap: spacing.md }}>
      <Header title="AI Glossary" onBack={() => navigation.goBack()} />

      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder={placeholder}
        autoCorrect={false}
        accessibilityLabel="Search glossary terms"
      />

      {results.length === 0 ? (
        <View style={{ marginTop: spacing.xl, gap: spacing.md }}>
          <EmptyState
            icon="search-outline"
            title="No terms found"
            message={`Nothing matches “${query.trim()}”. Try one of these:`}
          />
          <View style={styles.suggestRow}>
            {suggestions.map(t => (
              <Pressable
                key={t.slug}
                onPress={() => {
                  setQuery(t.name);
                  setOpen(t.slug);
                }}
                style={[styles.suggestChip, { borderColor: colors.border, borderRadius: radius.pill }]}
                accessibilityRole="button"
                accessibilityLabel={`Show ${t.name}`}
              >
                <Icon name={t.icon} size={14} color={colors.primary} />
                <Text variant="caption" color="primary">{t.name}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : (
        results.map((term, i) => (
          <Animated.View
            key={term.slug}
            entering={FadeInDown.delay(i * 50).springify().damping(16)}
          >
            <TermCard
              term={term}
              expanded={open === term.slug}
              onToggle={() => setOpen(open === term.slug ? null : term.slug)}
              onRelated={slug => setOpen(slug)}
            />
          </Animated.View>
        ))
      )}
    </Screen>
  );
};

const TermCard: React.FC<{
  term: GlossaryTerm;
  expanded: boolean;
  onToggle: () => void;
  onRelated: (slug: string) => void;
}> = ({ term, expanded, onToggle, onRelated }) => {
  const { colors, radius, spacing } = useTheme();
  return (
    <GlassCard elevation="sm" onPress={onToggle}>
      <View style={styles.termHead}>
        <View style={[styles.termIcon, { backgroundColor: colors.primaryMuted, borderRadius: radius.md }]}>
          <Icon name={term.icon} size={20} color={colors.primary} />
        </View>
        <View style={styles.flex}>
          <Text variant="bodyStrong">{term.name}</Text>
          <Text variant="caption" color="textSecondary" numberOfLines={expanded ? undefined : 2}>
            {term.simple}
          </Text>
        </View>
        <Icon name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textTertiary} />
      </View>

      {expanded && (
        <View style={{ gap: spacing.md, marginTop: spacing.md }}>
          <Field label="Technical meaning" value={term.technical} />
          <Field label="Example" value={term.example} />
          {term.related.length > 0 && (
            <View style={{ gap: spacing.xs }}>
              <Text variant="caption" color="textTertiary">RELATED</Text>
              <View style={styles.relatedRow}>
                {term.related.map(slug => {
                  const rt = glossaryTerm(slug);
                  if (!rt) return null;
                  return (
                    <Pressable
                      key={slug}
                      onPress={() => onRelated(slug)}
                      style={[styles.relatedChip, { borderColor: colors.border, borderRadius: radius.pill }]}
                    >
                      <Text variant="caption" color="primary">{rt.name}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      )}
    </GlassCard>
  );
};

const Field: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={{ gap: 2 }}>
    <Text variant="caption" color="textTertiary">{label.toUpperCase()}</Text>
    <Text variant="body" color="textSecondary">{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  flex: { flex: 1 },
  suggestRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  suggestChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1 },
  termHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  termIcon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  relatedRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  relatedChip: { paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1 },
});

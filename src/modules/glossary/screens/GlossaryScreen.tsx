import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Card, Header, Screen, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { useAchievementsStore } from '../../../store';
import { GLOSSARY, GlossaryTerm, glossaryTerm } from '../../../content';

export const GlossaryScreen: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const navigation = useNavigation();
  const unlock = useAchievementsStore(s => s.unlock);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    unlock('glossary-curious', Date.now());
  }, [unlock]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GLOSSARY;
    return GLOSSARY.filter(
      t => t.name.toLowerCase().includes(q) || t.simple.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <Screen scroll contentContainerStyle={{ gap: spacing.md }}>
      <Header title="AI Glossary" onBack={() => navigation.goBack()} />

      <View style={[styles.search, { backgroundColor: colors.surfaceAlt, borderRadius: radius.md }]}>
        <Icon name="search" size={18} color={colors.textTertiary} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search terms…"
          placeholderTextColor={colors.textTertiary}
          style={[styles.input, { color: colors.text }]}
          autoCorrect={false}
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')} hitSlop={8}>
            <Icon name="close-circle" size={18} color={colors.textTertiary} />
          </Pressable>
        )}
      </View>

      {results.length === 0 ? (
        <Text variant="body" color="textSecondary" center style={{ marginTop: spacing.xl }}>
          No terms match “{query}”.
        </Text>
      ) : (
        results.map(term => (
          <TermCard
            key={term.slug}
            term={term}
            expanded={open === term.slug}
            onToggle={() => setOpen(open === term.slug ? null : term.slug)}
            onRelated={slug => setOpen(slug)}
          />
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
    <Card elevation="sm" onPress={onToggle}>
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
    </Card>
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
  search: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, height: 44 },
  input: { flex: 1, fontSize: 15, paddingVertical: 0 },
  termHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  termIcon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  relatedRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  relatedChip: { paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1 },
});

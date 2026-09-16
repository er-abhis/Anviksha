import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { EmptyState, GlassCard, Header, Screen, SearchBar, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { GLOSSARY, LESSONS } from '../../../content';
import { SIMS } from '../../brain/data';

type Kind = 'Lesson' | 'Glossary' | 'Simulation';

interface Row {
  key: string;
  kind: Kind;
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}

const has = (q: string, ...fields: (string | undefined)[]) =>
  fields.some(f => f?.toLowerCase().includes(q));

export const SearchScreen: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const navigation = useNavigation();
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();

  const sections = useMemo(() => {
    if (!q) return [];
    const lessons: Row[] = LESSONS.filter(l => has(q, l.title, l.subtitle, l.description)).map(l => ({
      key: `lesson-${l.id}`,
      kind: 'Lesson',
      icon: 'book-outline',
      title: l.title,
      subtitle: l.subtitle,
      onPress: () => navigation.navigate('Lesson', { lessonId: l.id }),
    }));
    const glossary: Row[] = GLOSSARY.filter(t => has(q, t.name, t.simple, t.technical)).map(t => ({
      key: `glossary-${t.slug}`,
      kind: 'Glossary',
      icon: t.icon,
      title: t.name,
      subtitle: t.simple,
      // Glossary has no per-term route — GlossaryScreen expands inline, so we
      // navigate to it (mirrors the only existing glossary target).
      onPress: () => navigation.navigate('Glossary'),
    }));
    const sims: Row[] = SIMS.filter(s => has(q, s.title, s.tagline, s.concept)).map(s => ({
      key: `sim-${s.id}`,
      kind: 'Simulation',
      icon: s.icon,
      title: s.title,
      subtitle: s.tagline,
      onPress: () => navigation.navigate('BrainSim', { simId: s.id }),
    }));
    return [
      { title: 'Lessons', data: lessons },
      { title: 'Glossary', data: glossary },
      { title: 'Simulations', data: sims },
    ].filter(s => s.data.length > 0);
  }, [q, navigation]);

  const total = sections.reduce((n, s) => n + s.data.length, 0);

  return (
    <Screen scroll contentContainerStyle={{ gap: spacing.md }}>
      <Header title="Search" onBack={() => navigation.goBack()} />

      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="Search lessons, terms, sims…"
        autoCorrect={false}
        autoFocus
        accessibilityLabel="Search everything"
      />

      {!q ? (
        <View style={{ marginTop: spacing.xl }}>
          <EmptyState
            icon="search-outline"
            title="Search everything"
            message="Find lessons, glossary terms, and simulations."
          />
        </View>
      ) : total === 0 ? (
        <View style={{ marginTop: spacing.xl }}>
          <EmptyState
            icon="search-outline"
            title="No matches"
            message={`Nothing matches “${query.trim()}”.`}
          />
        </View>
      ) : (
        sections.map(section => (
          <View key={section.title} style={{ gap: spacing.sm }}>
            <Text variant="caption" color="textTertiary">{section.title.toUpperCase()}</Text>
            {section.data.map(row => (
              <GlassCard key={row.key} elevation="sm" onPress={row.onPress}>
                <View style={styles.row}>
                  <View style={[styles.icon, { backgroundColor: colors.primaryMuted, borderRadius: radius.md }]}>
                    <Icon name={row.icon} size={20} color={colors.primary} />
                  </View>
                  <View style={styles.flex}>
                    <Text variant="bodyStrong">{row.title}</Text>
                    <Text variant="caption" color="textSecondary" numberOfLines={2}>{row.subtitle}</Text>
                  </View>
                  <View style={[styles.tag, { borderColor: colors.border, borderRadius: radius.pill }]}>
                    <Text variant="caption" color="textTertiary">{row.kind}</Text>
                  </View>
                </View>
              </GlassCard>
            ))}
          </View>
        ))
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1 },
});

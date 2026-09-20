import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  EmptyState,
  GlassCard,
  Gradient,
  Header,
  ProgressBar,
  Screen,
  SearchBar,
  Text,
} from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { RootStackParamList } from '../../../navigation/types';
import { useProgressStore } from '../../../store';
import {
  WORLDS,
  lessonsForWorld,
  worldProgress,
  worldSummary,
} from '../../../content';
import { Difficulty } from '../../../content/types';

const DIFFICULTY: Record<Difficulty, { label: string; icon: string }> = {
  beginner: { label: 'Beginner', icon: 'leaf-outline' },
  intermediate: { label: 'Intermediate', icon: 'trending-up-outline' },
  advanced: { label: 'Advanced', icon: 'flame-outline' },
};

export const WorldsScreen: React.FC = () => {
  const { colors, radius, spacing, elevation } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const completed = useProgressStore(s => s.completed);
  const [query, setQuery] = useState('');

  const worlds = useMemo(() => {
    const sorted = [...WORLDS].sort((a, b) => a.order - b.order);
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter(w => w.title.toLowerCase().includes(q));
  }, [query]);

  return (
    <Screen scroll contentContainerStyle={{ gap: spacing.md }}>
      <Header title="Explore Topics" onBack={() => navigation.goBack()} />

      {/* Hero Banner */}
      <Animated.View>
        <GlassCard elevation="glow" padded={false} style={{ borderRadius: radius.xl, overflow: 'hidden' }}>
          <Gradient colors={gradients.cool} style={StyleSheet.absoluteFill} />
          <View style={{ padding: spacing.lg, gap: spacing.xs }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Icon name="planet-outline" size={18} color="#FFFFFF" />
              <Text variant="label" color="textInverse" style={{ opacity: 0.9, letterSpacing: 1 }}>
                LEARNING WORLDS
              </Text>
            </View>
            <Text variant="h2" color="textInverse">
              Explore AI Topics
            </Text>
            <Text variant="caption" color="textInverse" style={{ opacity: 0.92, lineHeight: 16 }}>
              Every topic is open — pick any world and learn at your own pace with interactive lessons, quizzes, and simulations.
            </Text>
          </View>
        </GlassCard>
      </Animated.View>

      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="Search topics…"
        accessibilityLabel="Search topics"
      />

      {worlds.length === 0 ? (
        <EmptyState
          icon="search-outline"
          title="No topics found"
          message={`Nothing matches “${query.trim()}”. Try another search.`}
        />
      ) : (
        worlds.map((world, i) => {
          const lessons = lessonsForWorld(world.id);
          const summary = worldSummary(world.id);
          const progress = worldProgress(world.id, completed);
          const doneCount = lessons.filter(l => l.id in completed).length;
          const diff = DIFFICULTY[summary.difficulty];

          const state =
            doneCount === 0
              ? 'new'
              : doneCount >= lessons.length && lessons.length > 0
              ? 'done'
              : 'progress';
          const cta =
            state === 'new'
              ? 'Start Learning'
              : state === 'done'
              ? 'Revisit lessons'
              : 'Continue Learning';

          const accentColor = world.gradient ? world.gradient[0] : colors.primary;

          return (
            <Animated.View key={world.id}>
              <GlassCard
                elevation="glow"
                style={{
                  borderColor: accentColor + '44',
                  borderWidth: 1,
                  borderRadius: radius.lg,
                }}
                onPress={() => navigation.navigate('WorldDetail', { worldId: world.id })}
              >
                <View style={[styles.row, { gap: spacing.sm }]}>
                  <Gradient
                    colors={world.gradient}
                    style={{ ...styles.badge, borderRadius: radius.md, ...elevation.glow }}
                  >
                    <Icon name={world.icon} size={22} color="#FFFFFF" />
                  </Gradient>
                  <View style={styles.flex}>
                    <View style={styles.titleRow}>
                      <Text variant="bodyStrong" style={styles.flex}>{world.title}</Text>
                      {state === 'done' && (
                        <View style={[styles.donePill, { backgroundColor: colors.success, borderRadius: radius.pill }]}>
                          <Icon name="checkmark" size={10} color="#FFFFFF" />
                          <Text variant="caption" color="textInverse" style={{ fontSize: 10, fontWeight: '700' }}>Completed</Text>
                        </View>
                      )}
                      {state === 'progress' && (
                        <View style={[styles.donePill, { backgroundColor: colors.accent, borderRadius: radius.pill }]}>
                          <Icon name="flash" size={10} color="#FFFFFF" />
                          <Text variant="caption" color="textInverse" style={{ fontSize: 10, fontWeight: '700' }}>In Progress</Text>
                        </View>
                      )}
                    </View>
                    <Text variant="caption" color="textSecondary" numberOfLines={2} style={{ fontSize: 11, lineHeight: 15, marginTop: 2 }}>
                      {world.description || world.subtitle}
                    </Text>
                  </View>
                </View>

                {lessons.length > 0 && (
                  <>
                    <View style={styles.metaRow}>
                      <Meta icon={diff.icon} label={diff.label} color={accentColor} />
                      <Meta icon="book-outline" label={`${summary.lessonCount} Lessons`} color={colors.textSecondary} />
                      <Meta icon="time-outline" label={`${summary.minutes} min`} color={colors.textSecondary} />
                      <Meta icon="star" label={`${summary.xp} XP`} color={colors.coins} />
                    </View>

                    <View style={{ marginTop: spacing.sm, gap: 2 }}>
                      <View style={styles.progressLabels}>
                        <Text variant="caption" color="textSecondary" style={{ fontSize: 11 }}>
                          {state === 'done'
                            ? `Earned ${summary.xp} XP`
                            : state === 'new'
                            ? 'Not started'
                            : 'In progress'}
                        </Text>
                        <Text variant="caption" color="textSecondary" style={{ fontSize: 11, fontWeight: '600' }}>
                          {`${doneCount} / ${summary.lessonCount}`}
                        </Text>
                      </View>
                      <ProgressBar progress={progress} fillColor={state === 'done' ? 'success' : 'primary'} height={6} />
                    </View>
                  </>
                )}

                <View style={[styles.ctaRow, { marginTop: spacing.sm }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: accentColor + '18', paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill }}>
                    <Text variant="label" style={{ color: accentColor, fontSize: 11, fontWeight: '700' }}>{cta}</Text>
                    <Icon name="arrow-forward" size={13} color={accentColor} />
                  </View>
                </View>
              </GlassCard>
            </Animated.View>
          );
        })
      )}
    </Screen>
  );
};

const Meta: React.FC<{ icon: string; label: string; color?: string }> = ({ icon, label, color }) => {
  const { colors, radius, spacing } = useTheme();
  return (
    <View
      style={[
        styles.metaChip,
        { backgroundColor: (color ? color + '15' : colors.surfaceAlt), borderRadius: radius.pill, paddingHorizontal: spacing.xs },
      ]}
    >
      <Icon name={icon} size={11} color={color || colors.textSecondary} />
      <Text variant="caption" style={{ fontSize: 10, color: color || colors.textSecondary, fontWeight: color ? '600' : '400' }}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  flex: { flex: 1 },
  badge: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  donePill: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: 6, paddingVertical: 2 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 8 },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingVertical: 3 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  ctaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});

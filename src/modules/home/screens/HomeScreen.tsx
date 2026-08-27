import React from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme, useThemeMode } from '../../../theme/ThemeProvider';
import { useResponsive } from '../../../hooks/useResponsive';
import { CONTENT_MAX_WIDTH } from '../../../constants/layout';
import {
  AnimatedBlobs,
  Carousel,
  EmptyState,
  GlassCard,
  Gradient,
  IconButton,
  Logo,
  SectionTitle,
  Text,
  XPBadge,
} from '../../../components';
import { RootStackParamList } from '../../../navigation/types';
import { useAchievementsStore, useDrawerStore, useProgressStore } from '../../../store';
import {
  BADGES,
  Lesson,
  World,
  buildDailyChallenge,
  currentWorld,
  dailySpotlight,
  getWorld,
  isLessonUnlocked,
  lessonsForWorld,
  todayISO,
  worldProgress,
  WORLDS,
} from '../../../content';
import { DailyChallengeCard } from '../components/DailyChallengeCard';
import { CurrentWorldCard } from '../components/CurrentWorldCard';
import { LessonCard } from '../components/LessonCard';
import { SpotlightCard } from '../components/SpotlightCard';
import { AchievementChip } from '../components/AchievementChip';
import { ActivityRow } from '../components/ActivityRow';

export const HomeScreen: React.FC = () => {
  const { colors, spacing, radius, gradients, elevation } = useTheme();
  const mode = useThemeMode();
  const { isTablet } = useResponsive();
  const tabBarHeight = useBottomTabBarHeight();
  const openDrawer = useDrawerStore(s => s.show);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { xp, coins, level, streakDays, completed, activity } =
    useProgressStore();
  const dailyCompletedDate = useProgressStore(s => s.dailyCompletedDate);
  const unlocked = useAchievementsStore(s => s.unlocked);

  const world = currentWorld(completed);
  const dailyDone = dailyCompletedDate === todayISO();
  const daily = buildDailyChallenge(todayISO(), completed);
  const spotlight = dailySpotlight(todayISO(), completed);
  const unlockedAchievements = BADGES.filter(a => unlocked[a.slug]);

  // Continue: incomplete chapters of the current world (immediate next first).
  const continueLessons = lessonsForWorld(world.id).filter(l => !(l.id in completed));
  // Recommended: the opening chapter of each OTHER world — new topics to try.
  const recommended: Lesson[] = WORLDS.filter(w => w.id !== world.id)
    .sort((a, b) => a.order - b.order)
    .map(w => lessonsForWorld(w.id)[0])
    .filter(Boolean)
    .slice(0, 8);
  // Explore: every world as a category.
  const exploreWorlds = [...WORLDS].sort((a, b) => a.order - b.order);

  const openLesson = (id: string) => navigation.navigate('LessonIntro', { lessonId: id });
  const openWorld = (id: string) => navigation.navigate('WorldDetail', { worldId: id });

  const lessonStatus = (l: Lesson): 'done' | 'locked' | 'open' =>
    l.id in completed ? 'done' : isLessonUnlocked(l, completed) ? 'open' : 'locked';

  const renderLesson = (l: Lesson) => {
    const w = getWorld(l.worldId);
    return (
      <LessonCard
        data={{
          worldTitle: w?.title ?? '',
          title: l.title,
          chapter: l.order,
          minutes: l.estimatedMinutes,
          xp: l.xp,
          status: lessonStatus(l),
        }}
        onPress={() => openLesson(l.id)}
      />
    );
  };

  const renderWorld = (w: World, eyebrow: string) => (
    <CurrentWorldCard
      eyebrow={eyebrow}
      data={{
        title: w.title,
        subtitle: w.subtitle,
        progress: worldProgress(w.id, completed),
        gradient: w.gradient,
        locked: false,
      }}
      onPress={() => openWorld(w.id)}
    />
  );

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.fill, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <AnimatedBlobs intensity={0.6} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingVertical: spacing.lg,
            gap: spacing.xxl,
            paddingBottom: tabBarHeight + spacing.lg,
            maxWidth: isTablet ? CONTENT_MAX_WIDTH : undefined,
          },
        ]}
      >
        {/* Greeting + stats */}
        <Padded>
          <Animated.View
            style={[styles.hero, { borderRadius: radius.xl }, elevation.glow]}
          >
            <Gradient
              colors={gradients.brand}
              style={StyleSheet.absoluteFill}
              borderRadius={radius.xl}
            />
            <Gradient
              colors={gradients.sheen}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.heroSheen}
              borderRadius={radius.xl}
              pointerEvents="none"
            />
            <View style={[styles.heroInner, { padding: spacing.xl }]}>
              <View style={styles.headerRow}>
                <Pressable
                  onPress={() => openDrawer()}
                  accessibilityRole="button"
                  accessibilityLabel="Open menu"
                  hitSlop={8}
                >
                  <Logo size={36} style={styles.brandMark} />
                </Pressable>
                <View style={styles.flex}>
                  <Text variant="label" color="textInverse" style={styles.heroEyebrow}>
                    Welcome back
                  </Text>
                  <Text variant="h1" color="textInverse">Ready to explore?</Text>
                </View>
                <IconButton
                  name="settings-outline"
                  accessibilityLabel="Settings"
                  onPress={() => navigation.navigate('Settings')}
                />
              </View>

              <View style={[styles.stats, { gap: spacing.sm, marginTop: spacing.lg }]}>
                <XPBadge value={xp} kind="xp" />
                <XPBadge value={coins} kind="coins" />
                <XPBadge value={streakDays} kind="streak" />
                <View style={styles.flex} />
                <View style={[styles.levelPill, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  <Icon name="ribbon" size={15} color={colors.textInverse} />
                  <Text variant="label" color="textInverse">{`Level ${level}`}</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        </Padded>

        {/* 1 — Continue Learning */}
        <Animated.View>
          <Padded>
            <SectionTitle
              title="Continue Learning"
              actionLabel={continueLessons.length ? 'View all' : undefined}
              onAction={continueLessons.length ? () => openWorld(world.id) : undefined}
            />
          </Padded>
          {continueLessons.length ? (
            <Carousel
              data={continueLessons}
              keyExtractor={l => l.id}
              renderItem={renderLesson}
            />
          ) : (
            <Padded>
              <EmptyState
                icon="trophy-outline"
                title="You're all caught up!"
                message="You've completed every chapter. Explore a new topic below."
                actionLabel="Explore worlds"
                onAction={() => navigation.navigate('Worlds')}
              />
            </Padded>
          )}
        </Animated.View>

        {/* 2 — Daily Challenge (the daily hook) */}
        <Animated.View>
        <Padded>
          <SectionTitle title="Daily Challenge" />
          <DailyChallengeCard
            data={{
              title: 'Today’s challenge',
              description: dailyDone
                ? 'Nice work — you’ve completed today’s challenge.'
                : `${daily.questionIds.length} quick questions from your unlocked lessons. Earn up to ${daily.xpReward} XP.`,
              xpReward: daily.xpReward,
              completed: dailyDone,
            }}
            onStart={() => navigation.navigate('DailyChallenge')}
          />
        </Padded>
        </Animated.View>

        {/* Daily spotlight — rotates concept / did-you-know / try-this by date */}
        <Animated.View>
        <Padded>
          <SectionTitle title={spotlight.title} />
          <SpotlightCard
            item={spotlight}
            onPress={() =>
              spotlight.kind === 'tryThis'
                ? openLesson(spotlight.lesson.id)
                : navigation.navigate('Glossary')
            }
          />
        </Padded>
        </Animated.View>

        {/* 3 — Recommended for You */}
        {recommended.length > 0 && (
          <View>
            <Padded>
              <SectionTitle
                title="Recommended for You"
                actionLabel="See all"
                onAction={() => navigation.navigate('Worlds')}
              />
            </Padded>
            <Carousel
              data={recommended}
              keyExtractor={l => l.id}
              renderItem={renderLesson}
            />
          </View>
        )}

        {/* 4 — Explore Topics */}
        <View>
          <Padded>
            <SectionTitle
              title="Explore Topics"
              actionLabel="View all"
              onAction={() => navigation.navigate('Worlds')}
            />
          </Padded>
          <Carousel
            data={exploreWorlds}
            keyExtractor={w => w.id}
            renderItem={w => renderWorld(w, 'EXPLORE')}
            maxItemWidth={300}
          />
        </View>

        {/* 5 — Interactive AI Activity */}
        <Padded>
          <SectionTitle title="Interactive AI Activity" />
          <GlassCard elevation="glow" onPress={() => navigation.navigate('BuildAI')}>
            <View style={styles.rowGap}>
              <View style={[styles.activityIcon, { backgroundColor: colors.primaryMuted, borderRadius: radius.md }]}>
                <Icon name="construct" size={24} color={colors.primary} />
              </View>
              <View style={styles.flex}>
                <Text variant="bodyStrong">Build the AI</Text>
                <Text variant="caption" color="textSecondary">
                  Assemble real AI architectures — drag components into the right pipeline.
                </Text>
              </View>
              <Icon name="chevron-forward" size={18} color={colors.textTertiary} />
            </View>
          </GlassCard>
        </Padded>

        {/* 6 — Progress & Achievements */}
        <View>
          <Padded>
            <SectionTitle
              title="Progress & Achievements"
              actionLabel="See all"
              onAction={() => navigation.navigate('Main', { screen: 'Achievements' })}
            />
          </Padded>
          {unlockedAchievements.length === 0 ? (
            <Padded>
              <EmptyState
                icon="trophy-outline"
                title="No achievements yet"
                message="Complete challenges and lessons to earn your first badge."
              />
            </Padded>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: spacing.md, paddingHorizontal: spacing.lg }}
            >
              {unlockedAchievements.map(a => (
                <AchievementChip
                  key={a.slug}
                  item={{ id: a.slug, title: a.title, icon: a.icon, unlocked: true }}
                />
              ))}
            </ScrollView>
          )}
        </View>

        {/* AI Glossary */}
        <Padded>
          <GlassCard elevation="md" onPress={() => navigation.navigate('Glossary')}>
            <View style={styles.rowGap}>
              <View style={[styles.glossaryIcon, { backgroundColor: colors.primaryMuted, borderRadius: radius.md }]}>
                <Icon name="book" size={22} color={colors.primary} />
              </View>
              <View style={styles.flex}>
                <Text variant="bodyStrong">AI Glossary</Text>
                <Text variant="caption" color="textSecondary">
                  Look up any term — in plain words and technical detail
                </Text>
              </View>
              <Icon name="chevron-forward" size={18} color={colors.textTertiary} />
            </View>
          </GlassCard>
        </Padded>

        {/* Learn More — external references */}
        <Padded>
          <GlassCard elevation="md" onPress={() => navigation.navigate('LearnMore')}>
            <View style={styles.rowGap}>
              <View style={[styles.glossaryIcon, { backgroundColor: colors.primaryMuted, borderRadius: radius.md }]}>
                <Icon name="library" size={22} color={colors.primary} />
              </View>
              <View style={styles.flex}>
                <Text variant="bodyStrong">Learn More</Text>
                <Text variant="caption" color="textSecondary">
                  Trusted courses, docs and research — opens in your browser
                </Text>
              </View>
              <Icon name="open-outline" size={18} color={colors.textTertiary} />
            </View>
          </GlassCard>
        </Padded>

        {/* Recent Activity */}
        <Padded>
          <SectionTitle title="Recent Activity" />
          {activity.length === 0 ? (
            <EmptyState
              icon="time-outline"
              title="No activity yet"
              message="Your completed challenges and lessons will show up here."
            />
          ) : (
            activity.map(a => (
              <ActivityRow
                key={a.id}
                item={{ id: a.id, label: a.label, detail: a.detail, icon: a.icon }}
              />
            ))
          )}
        </Padded>
      </ScrollView>
    </SafeAreaView>
  );
};

/** Horizontal page padding for non-carousel content (carousels bleed edge-to-edge). */
const Padded: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { spacing } = useTheme();
  return <View style={{ paddingHorizontal: spacing.lg }}>{children}</View>;
};

const styles = StyleSheet.create({
  fill: { flex: 1 },
  flex: { flex: 1 },
  content: { width: '100%', alignSelf: 'center' },
  hero: {},
  heroInner: {},
  heroSheen: { position: 'absolute', top: 0, left: 0, right: 0, height: '60%' },
  heroEyebrow: { letterSpacing: 1, opacity: 0.9 },
  glossaryIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  activityIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  rowGap: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  brandMark: { borderRadius: 10 },
  stats: { flexDirection: 'row', alignItems: 'center' },
  levelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
});

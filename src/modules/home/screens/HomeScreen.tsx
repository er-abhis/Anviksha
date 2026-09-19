import React, { useMemo } from 'react';
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
import {
  conceptsMastered,
  dueForReview,
  simsCompletedCount,
  useAchievementsStore,
  useBrainStore,
  useDrawerStore,
  useProgressStore,
} from '../../../store';
import { CASES, SIMS, missionForDay } from '../../brain/data';
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
  const { isTablet, cellWidthPercent } = useResponsive();
  const tabBarHeight = useBottomTabBarHeight();
  const openDrawer = useDrawerStore(s => s.show);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { xp, coins, level, streakDays, completed, activity } =
    useProgressStore();
  const dailyCompletedDate = useProgressStore(s => s.dailyCompletedDate);
  const unlocked = useAchievementsStore(s => s.unlocked);

  // AI Brain playground state
  const simsDone = useBrainStore(simsCompletedCount);
  const mastered = useBrainStore(conceptsMastered);
  const simsCompletedMap = useBrainStore(s => s.simsCompleted);
  const casesState = useBrainStore(s => s.cases);
  const concepts = useBrainStore(s => s.concepts);
  const due = useMemo(() => dueForReview(concepts, Date.now()), [concepts]);
  const mission = missionForDay(todayISO());

  // Show only 4 curated simulations on Homepage
  const quickSims = [
    'neural-network',
    'embedding-space',
    'attention-map',
    'temperature-lab',
  ]
    .map(id => SIMS.find(s => s.id === id)!)
    .filter(Boolean);

  const arenaCase = CASES.find(c => !casesState[c.id]?.solved) ?? CASES[0];
  const openMission = () =>
    mission.kind === 'sim'
      ? navigation.navigate('BrainSim', { simId: mission.targetId })
      : navigation.navigate('Detective', { caseId: mission.targetId });

  const reviewSim = due.length ? SIMS.find(s => s.concept === due[0]) : undefined;

  const world = currentWorld(completed);
  const dailyDone = dailyCompletedDate === todayISO();
  const daily = buildDailyChallenge(todayISO(), completed);
  const spotlight = dailySpotlight(todayISO(), completed);
  const unlockedAchievements = BADGES.filter(a => unlocked[a.slug]);

  // Continue: incomplete chapters of current world
  const continueLessons = lessonsForWorld(world.id).filter(l => !(l.id in completed));
  // Recommended: opening chapter of each other world
  const recommended: Lesson[] = WORLDS.filter(w => w.id !== world.id)
    .sort((a, b) => a.order - b.order)
    .map(w => lessonsForWorld(w.id)[0])
    .filter(Boolean)
    .slice(0, 8);

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
      <AnimatedBlobs intensity={0.5} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingVertical: spacing.lg,
            gap: spacing.xl,
            paddingBottom: tabBarHeight + spacing.xl,
            maxWidth: isTablet ? CONTENT_MAX_WIDTH : undefined,
          },
        ]}
      >
        {/* ================= HUB 1: HERO & DASHBOARD OVERVIEW ================= */}
        <Padded>
          <Animated.View
            style={[styles.hero, { borderRadius: radius.xl }, elevation.glow]}
          >
            <Gradient
              colors={gradients.brand}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
              borderRadius={radius.xl}
            />
            <View style={[styles.heroInner, { padding: spacing.xl }]}>
              <View style={styles.headerRow}>
                <Pressable
                  onPress={() => openDrawer()}
                  accessibilityRole="button"
                  accessibilityLabel="Open menu"
                  hitSlop={8}
                >
                  <Logo size={38} style={styles.brandMark} />
                </Pressable>
                <View style={styles.flex}>
                  <Text variant="label" color="textInverse" style={styles.heroEyebrow}>
                    ANVIKSHA AI LAB
                  </Text>
                  <Text variant="h1" color="textInverse">Learn AI by Playing</Text>
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

        {/* Primary Interactive AI Brain Banner */}
        <Padded>
          <GlassCard elevation="glow" onPress={() => navigation.navigate('Brain')} padded={false} style={styles.brainCard}>
            <Gradient colors={gradients.cool} style={StyleSheet.absoluteFill} borderRadius={radius.lg} />
            <View style={styles.brainInner}>
              <View style={styles.brainTop}>
                <View style={styles.brainIconContainer}>
                  <Text style={styles.brainEmoji}>🧠</Text>
                </View>
                <View style={styles.flex}>
                  <Text variant="label" color="textInverse" style={{ opacity: 0.9, letterSpacing: 1 }}>
                    INSIDE THE AI BRAIN
                  </Text>
                  <Text variant="h2" color="textInverse">
                    {SIMS.length + CASES.length}+ interactive AI simulations
                  </Text>
                </View>
              </View>
              <View style={styles.brainCtaRow}>
                <View style={[styles.brainCta, { borderRadius: radius.pill }]}>
                  <Text variant="button" color="primary">
                    {simsDone > 0 ? 'Continue Exploring' : 'Launch AI Playground'}
                  </Text>
                  <Icon name="arrow-forward" size={16} color={colors.primary} />
                </View>
              </View>
            </View>
          </GlassCard>
        </Padded>

        {/* Progress Snapshot Grid */}
        <Padded>
          <SectionTitle
            title="Your Progress"
            actionLabel="Details"
            onAction={() => navigation.navigate('Main', { screen: 'Profile' })}
          />
          <View style={styles.progressGrid}>
            <ProgressTileCard icon="flash" value={`${xp} XP`} label="Total Experience" tint={colors.xp} widthPercent={cellWidthPercent} />
            <ProgressTileCard icon="ribbon" value={`Level ${level}`} label="Mastery Tier" tint={colors.primary} widthPercent={cellWidthPercent} />
            <ProgressTileCard icon="flask" value={`${simsDone}/${SIMS.length} Sims`} label="Interactive Labs" tint={colors.accent} widthPercent={cellWidthPercent} />
            <ProgressTileCard icon="sparkles" value={`${mastered} Concepts`} label="Concepts Mastered" tint={colors.accentAlt} widthPercent={cellWidthPercent} />
          </View>
        </Padded>

        {/* ================= HUB 2: INTERACTIVE AI PLAYGROUND ================= */}
        <Padded>
          <SectionTitle
            title="Quick Playground"
            actionLabel={`All ${SIMS.length} sims`}
            onAction={() => navigation.navigate('Brain')}
          />
          <View style={styles.quickGrid}>
            {quickSims.map(s => (
              <Pressable
                key={s.id}
                onPress={() => navigation.navigate('BrainSim', { simId: s.id })}
                style={({ pressed }) => [styles.quickCell, { width: cellWidthPercent as any, opacity: pressed ? 0.75 : 1 }]}
              >
                <GlassCard elevation="md" style={styles.quickCardInner}>
                  <View style={styles.quickRow2}>
                    <View style={[styles.quickIcon, { backgroundColor: colors.primaryMuted, borderRadius: radius.md }]}>
                      <Icon name={s.icon} size={22} color={colors.primary} />
                    </View>
                    {simsCompletedMap[s.id] && (
                      <View style={[styles.doneBadge, { backgroundColor: colors.success + '22' }]}>
                        <Icon name="checkmark-circle" size={14} color={colors.success} />
                      </View>
                    )}
                  </View>
                  <Text variant="bodyStrong" numberOfLines={1} style={{ marginTop: spacing.sm }}>
                    {s.title}
                  </Text>
                  <Text variant="caption" color="textSecondary" numberOfLines={1} style={{ marginTop: 2 }}>
                    {s.concept}
                  </Text>
                </GlassCard>
              </Pressable>
            ))}
          </View>

          {/* View All 20 Simulations Action Banner */}
          <GlassCard
            elevation="sm"
            onPress={() => navigation.navigate('Brain')}
            style={[styles.allSimsBanner, { marginTop: spacing.md, backgroundColor: colors.surface }]}
          >
            <View style={styles.rowBetweenFlex}>
              <View style={styles.rowGap}>
                <View style={[styles.quickIcon, { backgroundColor: colors.accentMuted, borderRadius: radius.md }]}>
                  <Icon name="grid-outline" size={20} color={colors.accent} />
                </View>
                <View>
                  <Text variant="bodyStrong">Explore All {SIMS.length} Interactive Sims</Text>
                  <Text variant="caption" color="textSecondary">Deep-dive into models, transformers, and ML labs</Text>
                </View>
              </View>
              <Icon name="arrow-forward" size={18} color={colors.primary} />
            </View>
          </GlassCard>
        </Padded>

        {/* Today's Mission */}
        <Padded>
          <SectionTitle title="Today’s Mission" />
          <GlassCard elevation="md" onPress={openMission}>
            <View style={styles.rowGap}>
              <View style={[styles.activityIcon, { backgroundColor: colors.primaryMuted, borderRadius: radius.md }]}>
                <Icon name={mission.kind === 'sim' ? 'flask' : 'search'} size={24} color={colors.primary} />
              </View>
              <View style={styles.flex}>
                <Text variant="label" color="accent">
                  {mission.kind === 'sim' ? '2–4 MIN EXPERIMENT' : 'DETECTIVE CASE'}
                </Text>
                <Text variant="bodyStrong">{mission.title}</Text>
                <Text variant="caption" color="textSecondary" numberOfLines={1}>
                  {mission.blurb}
                </Text>
              </View>
              <Icon name="chevron-forward" size={18} color={colors.textTertiary} />
            </View>
          </GlassCard>
        </Padded>

        {/* Spaced Revision Nudge */}
        {reviewSim && (
          <Padded>
            <GlassCard elevation="md" onPress={() => navigation.navigate('BrainSim', { simId: reviewSim.id })} style={{ borderColor: colors.warning + '66' }}>
              <View style={styles.rowGap}>
                <View style={[styles.activityIcon, { backgroundColor: colors.warning + '22', borderRadius: radius.md }]}>
                  <Icon name="refresh" size={22} color={colors.warning} />
                </View>
                <View style={styles.flex}>
                  <Text variant="bodyStrong">🔁 Review {reviewSim.concept}</Text>
                  <Text variant="caption" color="textSecondary">Due for revision — revisit to lock it in.</Text>
                </View>
                <Icon name="chevron-forward" size={18} color={colors.textTertiary} />
              </View>
            </GlassCard>
          </Padded>
        )}

        {/* ================= HUB 3: LEARNING JOURNEY & WORLDS ================= */}
        <Padded>
          <SectionTitle title="Current Topic" />
          {renderWorld(world, 'CURRENT WORLD')}
        </Padded>

        {/* Continue Learning Chapters */}
        <View>
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
                message="You've completed every chapter in this world. Explore a new topic below."
                actionLabel="Explore worlds"
                onAction={() => navigation.navigate('Worlds')}
              />
            </Padded>
          )}
        </View>

        {/* Daily Challenge Card */}
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

        {/* Daily Spotlight */}
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

        {/* Recommended Worlds */}
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

        {/* Explore All Topics */}
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

        {/* ================= HUB 4: CHALLENGES & RESOURCES ================= */}
        <Padded>
          <SectionTitle title="Challenge Arena" />
          <GlassCard elevation="md" onPress={() => navigation.navigate('Detective', { caseId: arenaCase.id })}>
            <View style={styles.rowGap}>
              <Text style={styles.arenaEmoji}>{arenaCase.emoji}</Text>
              <View style={styles.flex}>
                <Text variant="label" color="accent">AI DETECTIVE 🕵️</Text>
                <Text variant="bodyStrong">{arenaCase.title}</Text>
                <Text variant="caption" color="textSecondary">Investigate the scenario and name the flaw.</Text>
              </View>
              <Icon name="chevron-forward" size={18} color={colors.textTertiary} />
            </View>
          </GlassCard>
        </Padded>

        <Padded>
          <SectionTitle title="Interactive AI Builder" />
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

        {/* Achievements */}
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

        {/* Resources: AI Glossary & Learn More */}
        <Padded style={{ gap: spacing.md }}>
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

const Padded: React.FC<{ children: React.ReactNode; style?: any }> = ({ children, style }) => {
  const { spacing } = useTheme();
  return <View style={[{ paddingHorizontal: spacing.lg }, style]}>{children}</View>;
};

const ProgressTileCard: React.FC<{
  icon: string;
  value: string;
  label: string;
  tint: string;
  widthPercent: string;
}> = ({ icon, value, label, tint, widthPercent }) => {
  const { colors, radius, spacing } = useTheme();
  return (
    <GlassCard
      elevation="sm"
      style={[
        styles.progressTileCard,
        {
          width: widthPercent as any,
          backgroundColor: colors.surface,
          borderColor: colors.glassBorder,
          borderRadius: radius.lg,
          padding: spacing.md,
        },
      ]}
    >
      <View style={styles.progressRowHeader}>
        <View style={[styles.progressIconBox, { backgroundColor: tint + '18' }]}>
          <Icon name={icon} size={20} color={tint} />
        </View>
      </View>
      <Text variant="h2" style={{ color: tint, marginTop: 6, fontSize: 18 }}>
        {value}
      </Text>
      <Text variant="caption" color="textSecondary" style={{ marginTop: 2 }}>
        {label}
      </Text>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  fill: { flex: 1 },
  flex: { flex: 1 },
  content: { width: '100%', alignSelf: 'center' },
  hero: {},
  heroInner: {},
  heroEyebrow: { letterSpacing: 1.2, opacity: 0.9 },
  glossaryIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  activityIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  rowGap: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  rowBetweenFlex: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 4 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  brandMark: { borderRadius: 10 },
  stats: { flexDirection: 'row', alignItems: 'center' },
  levelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  brainCard: { overflow: 'hidden' },
  brainInner: { padding: 20, gap: 16 },
  brainTop: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  brainIconContainer: { width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  brainEmoji: { fontSize: 28 },
  brainCtaRow: { flexDirection: 'row' },
  brainCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  quickCell: { width: '48%' },
  quickCardInner: { padding: 14 },
  quickRow2: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  quickIcon: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
  doneBadge: { padding: 4, borderRadius: 999 },
  progressGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  progressTileCard: { minHeight: 92, justifyContent: 'center' },
  progressRowHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  progressIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  allSimsBanner: { padding: 12 },
  arenaEmoji: { fontSize: 34 },
});

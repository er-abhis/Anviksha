import React, { useMemo, useState } from 'react';
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
  GlobalSearchModal,
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
import { useTranslation } from '../../../i18n/useTranslation';

const QUICK_SIM_GRADIENTS: Record<string, readonly string[]> = {
  'neural-network': ['#FF2E93', '#7C5CFF'],
  'embedding-space': ['#06D6C4', '#3B82F6'],
  'attention-map': ['#F59E0B', '#FF5FA2'],
  'temperature-lab': ['#12D18E', '#06D6C4'],
};

export const HomeScreen: React.FC = () => {
  const { colors, spacing, radius, gradients, elevation } = useTheme();
  const mode = useThemeMode();
  const { t } = useTranslation();
  const { isTablet, cellWidthPercent } = useResponsive();
  const tabBarHeight = useBottomTabBarHeight();
  const openDrawer = useDrawerStore(s => s.show);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [searchOpen, setSearchOpen] = useState(false);

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
            paddingVertical: spacing.md,
            gap: spacing.md,
            paddingBottom: tabBarHeight + spacing.lg,
            maxWidth: isTablet ? CONTENT_MAX_WIDTH : undefined,
          },
        ]}
      >
        {/* ================= TOP CLEAN HEADER ================= */}
        <Padded style={{ paddingVertical: spacing.xs }}>
          <View style={styles.cleanHeader}>
            <Pressable
              onPress={() => openDrawer()}
              accessibilityRole="button"
              accessibilityLabel="Open menu"
              hitSlop={8}
            >
              <Logo size={32} style={styles.brandMark} />
            </Pressable>
            <View style={styles.headerTitleWrap}>
              <Text variant="h3" style={{ fontWeight: '800', letterSpacing: 0.5 }}>
                Anviksha AI
              </Text>
            </View>
            <IconButton
              name="search-outline"
              accessibilityLabel="Global Search"
              onPress={() => setSearchOpen(true)}
            />
          </View>
        </Padded>

        {/* ================= SECTION 1 (TOP HERO): TODAY'S LEARNING / CONTINUE WHERE YOU LEFT OFF ================= */}
        <Padded>
          <View
            style={[styles.hero, { borderRadius: radius.xl }, elevation.glow]}
          >
            <Gradient
              colors={world.gradient || gradients.brand}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
              borderRadius={radius.xl}
            />
            <View style={{ padding: spacing.lg, gap: spacing.sm }}>
              <View style={styles.heroBadgeRow}>
                <View style={styles.primaryTag}>
                  <Text variant="caption" color="textInverse" style={{ fontWeight: '800', fontSize: 10, letterSpacing: 0.8 }}>
                    CONTINUE LEARNING · WORLD {world.order}
                  </Text>
                </View>
                <Text variant="caption" color="textInverse" style={{ opacity: 0.9, fontWeight: '700' }}>
                  {Math.round(worldProgress(world.id, completed) * 100)}% DONE
                </Text>
              </View>

              <Text variant="h2" color="textInverse" style={{ marginTop: 2 }}>
                {world.title}
              </Text>
              <Text variant="caption" color="textInverse" style={{ opacity: 0.92, fontSize: 13, lineHeight: 18 }}>
                {world.subtitle}
              </Text>

              {/* Target Lesson Action Card */}
              {continueLessons[0] && (
                <View style={styles.nextLessonBox}>
                  <View style={styles.flex}>
                    <Text variant="caption" color="textInverse" style={{ opacity: 0.8, fontSize: 11, textTransform: 'uppercase' }}>
                      Next Chapter To Complete
                    </Text>
                    <Text variant="bodyStrong" color="textInverse" numberOfLines={1} style={{ fontSize: 15 }}>
                      {`Ch ${continueLessons[0].order}: ${continueLessons[0].title}`}
                    </Text>
                  </View>
                  <View style={styles.xpPillMini}>
                    <Icon name="flash" size={12} color="#FACC15" />
                    <Text variant="caption" color="textInverse" style={{ fontWeight: '700', fontSize: 11 }}>
                      {`+${continueLessons[0].xp} XP`}
                    </Text>
                  </View>
                </View>
              )}

              {/* BIG PRIMARY CTA BUTTON: START / CONTINUE */}
              <Pressable
                onPress={() => continueLessons[0] ? openLesson(continueLessons[0].id) : openWorld(world.id)}
                style={({ pressed }) => [
                  styles.heroCtaBtn,
                  { opacity: pressed ? 0.85 : 1 }
                ]}
              >
                <Icon name="play" size={18} color={colors.primary} />
                <Text variant="bodyStrong" style={{ color: colors.primary, fontSize: 15, fontWeight: '800' }}>
                  {continueLessons[0] ? "▶ Continue Learning" : "▶ Start Chapter 1"}
                </Text>
              </Pressable>
            </View>
          </View>
        </Padded>

        {/* Quick User Stats Row */}
        <Padded style={{ marginTop: -spacing.xs }}>
          <View style={[styles.statsRowPill, { backgroundColor: colors.surfaceAlt, borderRadius: radius.lg, padding: spacing.xs, borderColor: colors.glassBorder, borderWidth: 1 }]}>
            <XPBadge value={xp} kind="xp" />
            <XPBadge value={coins} kind="coins" />
            <XPBadge value={streakDays} kind="streak" />
            <View style={styles.flex} />
            <View style={[styles.levelPill, { backgroundColor: colors.primaryMuted }]}>
              <Icon name="ribbon" size={14} color={colors.primary} />
              <Text variant="label" color="primary">{`Level ${level}`}</Text>
            </View>
          </View>
        </Padded>

        {/* ================= BOLD FEATURED HIGHLIGHTS GRID ================= */}
        <Padded>
          <SectionTitle
            title={t('featured_hubs')}
            subtitle="Explore our top interactive experiences"
          />
          <View style={styles.featuredGrid}>
            {/* Hub 1: AI Arcade */}
            <Pressable
              onPress={() => navigation.navigate('Main', { screen: 'Games' })}
              style={({ pressed }) => [styles.featuredCard, { opacity: pressed ? 0.85 : 1 }]}
            >
              <GlassCard elevation="glow" padded={false} style={styles.featuredCardInner}>
                <Gradient colors={gradients.brand} style={StyleSheet.absoluteFill} borderRadius={radius.lg} />
                <View style={styles.featuredPadding}>
                  <View style={styles.featuredHeader}>
                    <View style={styles.featuredIconWrap}>
                      <Icon name="game-controller" size={20} color="#FFFFFF" />
                    </View>
                    <View style={styles.liveTag}>
                      <Text variant="caption" color="textInverse" style={{ fontSize: 10, fontWeight: '700' }}>10+ GAMES</Text>
                    </View>
                  </View>
                  <Text variant="h3" color="textInverse" numberOfLines={1} style={{ marginTop: spacing.xs, fontSize: 15 }}>
                    AI Arcade
                  </Text>
                  <Text variant="caption" color="textInverse" style={{ opacity: 0.9, marginTop: 2, fontSize: 11 }} numberOfLines={2}>
                    Vector Shooter, Neural Pong & MythBusters
                  </Text>
                </View>
              </GlassCard>
            </Pressable>

            {/* Hub 2: AI Architecture Lab */}
            <Pressable
              onPress={() => navigation.navigate('BuildAI')}
              style={({ pressed }) => [styles.featuredCard, { opacity: pressed ? 0.85 : 1 }]}
            >
              <GlassCard elevation="glow" padded={false} style={styles.featuredCardInner}>
                <Gradient colors={gradients.warm} style={StyleSheet.absoluteFill} borderRadius={radius.lg} />
                <View style={styles.featuredPadding}>
                  <View style={styles.featuredHeader}>
                    <View style={styles.featuredIconWrap}>
                      <Icon name="construct" size={20} color="#FFFFFF" />
                    </View>
                    <View style={styles.liveTag}>
                      <Text variant="caption" color="textInverse" style={{ fontSize: 10, fontWeight: '700' }}>16 BLOCKS</Text>
                    </View>
                  </View>
                  <Text variant="h3" color="textInverse" numberOfLines={1} style={{ marginTop: spacing.xs, fontSize: 15 }}>
                    AI Architecture Lab
                  </Text>
                  <Text variant="caption" color="textInverse" style={{ opacity: 0.9, marginTop: 2, fontSize: 11 }} numberOfLines={2}>
                    Build Chatbots, Voice AIs & RAG Search
                  </Text>
                </View>
              </GlassCard>
            </Pressable>

            {/* Hub 3: Inside the AI Brain */}
            <Pressable
              onPress={() => navigation.navigate('Brain')}
              style={({ pressed }) => [styles.featuredCard, { opacity: pressed ? 0.85 : 1 }]}
            >
              <GlassCard elevation="glow" padded={false} style={styles.featuredCardInner}>
                <Gradient colors={gradients.cool} style={StyleSheet.absoluteFill} borderRadius={radius.lg} />
                <View style={styles.featuredPadding}>
                  <View style={styles.featuredHeader}>
                    <View style={styles.featuredIconWrap}>
                      <Text style={{ fontSize: 18 }}>🧠</Text>
                    </View>
                    <View style={styles.liveTag}>
                      <Text variant="caption" color="textInverse" style={{ fontSize: 10, fontWeight: '700' }}>22 SIMS</Text>
                    </View>
                  </View>
                  <Text variant="h3" color="textInverse" numberOfLines={1} style={{ marginTop: spacing.xs, fontSize: 15 }}>
                    Neural Playground
                  </Text>
                  <Text variant="caption" color="textInverse" style={{ opacity: 0.9, marginTop: 2, fontSize: 11 }} numberOfLines={2}>
                    Attention Heatmaps & Sandbox
                  </Text>
                </View>
              </GlassCard>
            </Pressable>

            {/* Hub 4: AI Detective */}
            <Pressable
              onPress={() => navigation.navigate('Detective', { caseId: arenaCase.id })}
              style={({ pressed }) => [styles.featuredCard, { opacity: pressed ? 0.85 : 1 }]}
            >
              <GlassCard elevation="glow" padded={false} style={styles.featuredCardInner}>
                <Gradient colors={gradients.success} style={StyleSheet.absoluteFill} borderRadius={radius.lg} />
                <View style={styles.featuredPadding}>
                  <View style={styles.featuredHeader}>
                    <View style={styles.featuredIconWrap}>
                      <Text style={{ fontSize: 18 }}>🕵️</Text>
                    </View>
                    <View style={styles.liveTag}>
                      <Text variant="caption" color="textInverse" style={{ fontSize: 10, fontWeight: '700' }}>MYSTERY CASES</Text>
                    </View>
                  </View>
                  <Text variant="h3" color="textInverse" numberOfLines={1} style={{ marginTop: spacing.xs, fontSize: 15 }}>
                    AI Detective
                  </Text>
                  <Text variant="caption" color="textInverse" style={{ opacity: 0.9, marginTop: 2, fontSize: 11 }} numberOfLines={2}>
                    Investigate flawed AI output scenarios
                  </Text>
                </View>
              </GlassCard>
            </Pressable>
          </View>
        </Padded>

        {/* Progress Snapshot Grid */}
        <Padded>
          <SectionTitle
            title={t('your_progress')}
            actionLabel="Details"
            onAction={() => navigation.navigate('Main', { screen: 'Profile' })}
          />
          <View style={styles.progressGrid}>
            <View style={[styles.progressCell, { width: cellWidthPercent as any }]}>
              <ProgressTileCard icon="flash" value={`${xp} XP`} label="Total Experience" gradient={gradients.brand} onPress={() => navigation.navigate('Main', { screen: 'Profile' })} />
            </View>
            <View style={[styles.progressCell, { width: cellWidthPercent as any }]}>
              <ProgressTileCard icon="ribbon" value={`Level ${level}`} label="Mastery Tier" gradient={gradients.warm} onPress={() => navigation.navigate('Main', { screen: 'Profile' })} />
            </View>
            <View style={[styles.progressCell, { width: cellWidthPercent as any }]}>
              <ProgressTileCard icon="flask" value={`${simsDone}/${SIMS.length} Sims`} label="Interactive Labs" gradient={gradients.cool} onPress={() => navigation.navigate('Brain')} />
            </View>
            <View style={[styles.progressCell, { width: cellWidthPercent as any }]}>
              <ProgressTileCard icon="sparkles" value={`${mastered} Concepts`} label="Concepts Mastered" gradient={gradients.success} onPress={() => navigation.navigate('Glossary')} />
            </View>
          </View>
        </Padded>

        {/* ================= HUB 2: INTERACTIVE AI PLAYGROUND ================= */}
        <Padded>
          <SectionTitle
            title={t('quick_playground')}
            actionLabel={`All ${SIMS.length} sims`}
            onAction={() => navigation.navigate('Brain')}
          />
          <View style={styles.quickGrid}>
            {quickSims.map((s, idx) => {
              const grad = QUICK_SIM_GRADIENTS[s.id] ?? gradients.cool;
              const isDone = Boolean(simsCompletedMap[s.id]);
              return (
                <View
                  key={s.id}
                  style={[styles.quickCell, { width: cellWidthPercent as any }]}
                >
                  <GlassCard
                    elevation="glow"
                    padded={false}
                    onPress={() => navigation.navigate('BrainSim', { simId: s.id })}
                    style={styles.quickCardInner}
                  >
                    <Gradient
                      colors={grad}
                      style={StyleSheet.absoluteFill}
                      borderRadius={radius.lg}
                    />
                    <View style={styles.quickCardPadding}>
                      <View style={styles.quickRow2}>
                        <View style={styles.quickIconWrap}>
                          <Icon name={s.icon} size={18} color="#FFFFFF" />
                        </View>
                        {isDone && (
                          <View style={styles.doneBadgeWhite}>
                            <Icon name="checkmark-circle" size={14} color="#FFFFFF" />
                          </View>
                        )}
                      </View>
                      <Text variant="bodyStrong" color="textInverse" numberOfLines={1} style={{ marginTop: spacing.xs, fontSize: 14 }}>
                        {s.title}
                      </Text>
                      <Text variant="caption" color="textInverse" numberOfLines={1} style={{ opacity: 0.9, marginTop: 2, fontSize: 11 }}>
                        {s.concept}
                      </Text>
                    </View>
                  </GlassCard>
                </View>
              );
            })}
          </View>

          {/* View All 20 Simulations Action Banner */}
          <GlassCard
            elevation="glow"
            padded={false}
            onPress={() => navigation.navigate('Brain')}
            style={[styles.allSimsBanner, { marginTop: spacing.md, height: 60 }]}
          >
            <Gradient
              colors={gradients.brand}
              style={StyleSheet.absoluteFill}
              borderRadius={radius.lg}
            />
            <View style={styles.allSimsPadding}>
              <View style={styles.rowGap}>
                <View style={styles.quickIconWrap}>
                  <Icon name="grid-outline" size={20} color="#FFFFFF" />
                </View>
                <View>
                  <Text variant="bodyStrong" color="textInverse" style={{ fontSize: 14 }}>
                    Explore All {SIMS.length} Interactive Sims
                  </Text>
                  <Text variant="caption" color="textInverse" style={{ opacity: 0.9, fontSize: 11 }}>
                    Deep-dive into models, transformers, and ML labs
                  </Text>
                </View>
              </View>
              <Icon name="arrow-forward" size={18} color="#FFFFFF" />
            </View>
          </GlassCard>
        </Padded>

        {/* Today's Mission & Daily Challenge */}
        <Padded>
          <SectionTitle title={t('daily_mission')} />
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

        {/* Daily Challenge Card */}
        <Padded>
          <SectionTitle title={t('daily_challenge')} />
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

      {/* Global Command / Instant Search Modal */}
      <GlobalSearchModal visible={searchOpen} onClose={() => setSearchOpen(false)} />
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
  gradient: readonly string[];
  onPress?: () => void;
}> = ({ icon, value, label, gradient, onPress }) => {
  const { radius } = useTheme();
  return (
    <GlassCard
      elevation="glow"
      padded={false}
      onPress={onPress}
      style={styles.progressCardInner}
    >
      <Gradient
        colors={gradient}
        style={StyleSheet.absoluteFill}
        borderRadius={radius.lg}
      />
      <View style={styles.progressInnerPadding}>
        <View style={styles.progressRowHeader}>
          <View style={styles.progressIconBox}>
            <Icon name={icon} size={16} color="#FFFFFF" />
          </View>
        </View>
        <Text variant="bodyStrong" color="textInverse" style={{ marginTop: 4, fontSize: 16, fontWeight: '700' }}>
          {value}
        </Text>
        <Text variant="caption" color="textInverse" style={{ opacity: 0.9, marginTop: 1, fontSize: 11 }} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  cleanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  headerTitleWrap: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  primaryTag: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  nextLessonBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 4,
  },
  xpPillMini: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  heroCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginTop: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  statsRowPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandMark: { borderRadius: 8 },
  stats: { flexDirection: 'row', alignItems: 'center' },
  levelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  brainCard: { overflow: 'hidden' },
  brainInner: { padding: 12, gap: 10 },
  brainTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brainIconContainer: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  brainEmoji: { fontSize: 20 },
  brainCtaRow: { flexDirection: 'row' },
  brainCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickCell: { width: '48%' },
  quickCardInner: { overflow: 'hidden', height: 105 },
  quickCardPadding: { padding: 12, flex: 1, justifyContent: 'space-between' },
  quickRow2: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  quickIconWrap: { width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  doneBadgeWhite: { backgroundColor: 'rgba(255,255,255,0.25)', padding: 3, borderRadius: 999 },
  allSimsBanner: { overflow: 'hidden' },
  allSimsPadding: { paddingHorizontal: 12, paddingVertical: 10, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  arenaEmoji: { fontSize: 28 },
  progressGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  progressCell: { width: '48%' },
  progressCardInner: { overflow: 'hidden', height: 85 },
  progressInnerPadding: { padding: 10, flex: 1, justifyContent: 'space-between' },
  progressRowHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  progressIconBox: { width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  featuredGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  featuredCard: { width: '48%' },
  featuredCardInner: { overflow: 'hidden', height: 130 },
  featuredPadding: { padding: 12, flex: 1, justifyContent: 'space-between' },
  featuredHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  featuredIconWrap: { width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  liveTag: { backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 999 },
});

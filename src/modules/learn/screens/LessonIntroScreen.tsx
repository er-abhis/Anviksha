import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  Button,
  Card,
  EmptyState,
  Gradient,
  IconButton,
  ProgressBar,
  Screen,
  Text,
} from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { RootStackParamList } from '../../../navigation/types';
import { useProgressStore } from '../../../store';
import {
  blockingLesson,
  getLesson,
  getWorld,
  isLessonInteractiveUnlocked,
  lessonsForWorld,
} from '../../../content';
import { Lesson } from '../../../content/types';

/** Varied fallback lines so intros never feel copy-pasted when a lesson
 *  doesn't author its own `motivation`. Picked deterministically per lesson. */
const MOTIVATION_POOL = [
  'Every AI expert started exactly where you are now.',
  "You're one step closer to understanding how ChatGPT really works.",
  'Curiosity is the only prerequisite. Let’s begin.',
  'Small steps today, real AI intuition tomorrow.',
  'The best way to understand AI is to play with it — let’s go.',
  'This is where the fun part of AI begins.',
  'Master this, and the next chapter gets easier.',
  'Big ideas, made simple. You’ve got this.',
  'A few minutes here changes how you see AI forever.',
  'Learn it once, use it everywhere.',
  'You’re building a mental model the pros rely on.',
  'Ready to level up your AI thinking? Let’s dive in.',
];

const DIFFICULTY_META: Record<Lesson['difficulty'], { label: string; icon: string }> = {
  beginner: { label: 'Beginner', icon: 'leaf-outline' },
  intermediate: { label: 'Intermediate', icon: 'trending-up-outline' },
  advanced: { label: 'Advanced', icon: 'flame-outline' },
};

const pickMotivation = (lesson: Lesson): string => {
  if (lesson.motivation) return lesson.motivation;
  // Stable per-lesson index from the id — same lesson always shows the same line.
  let h = 0;
  for (let i = 0; i < lesson.id.length; i++) h = (h * 31 + lesson.id.charCodeAt(i)) | 0;
  return MOTIVATION_POOL[Math.abs(h) % MOTIVATION_POOL.length];
};

export const LessonIntroScreen: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'LessonIntro'>>();
  const lesson = getLesson(route.params.lessonId);
  const completed = useProgressStore(s => s.completed);

  if (!lesson) {
    return (
      <Screen>
        <EmptyState title="Chapter not found" actionLabel="Back" onAction={() => navigation.goBack()} />
      </Screen>
    );
  }

  const world = getWorld(lesson.worldId);
  const gradient = world?.gradient ?? [colors.primary, colors.accent];
  const isDone = lesson.id in completed;
  const unlocked = isLessonInteractiveUnlocked(lesson, completed);
  const blocker = unlocked ? undefined : blockingLesson(lesson, completed);
  const diff = DIFFICULTY_META[lesson.difficulty];

  const siblings = lessonsForWorld(lesson.worldId);
  const position = siblings.findIndex(l => l.id === lesson.id) + 1;
  const worldDone = siblings.filter(l => l.id in completed).length;

  const start = () => navigation.navigate('Lesson', { lessonId: lesson.id });

  return (
    <Screen scroll padded={false} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
      {/* ---------- Hero ---------- */}
      <View>
        <Gradient colors={gradient} style={styles.hero}>
          <IconButton
            name="chevron-back"
            accessibilityLabel="Go back"
            onPress={() => navigation.goBack()}
            style={styles.back}
            color="textInverse"
            background="transparent"
          />
          {/* decorative rings */}
          <View style={[styles.ring, styles.ringA]} />
          <View style={[styles.ring, styles.ringB]} />

          <Animated.View entering={FadeInDown.duration(400)} style={styles.heroInner}>
            <View style={styles.heroBadge}>
              <Icon name={world?.icon ?? 'sparkles'} size={30} color="#FFFFFF" />
            </View>
            <Text variant="label" color="textInverse" style={styles.chapterKicker}>
              {`CHAPTER ${lesson.order}`}
            </Text>
            <Text variant="display" color="textInverse">{lesson.title}</Text>
            <Text variant="body" color="textInverse" style={styles.heroSub}>
              {lesson.subtitle}
            </Text>

            <View style={styles.chipRow}>
              <HeroChip icon={diff.icon} label={diff.label} />
              <HeroChip icon="time-outline" label={`${lesson.estimatedMinutes} min`} />
              <HeroChip icon="star" label={`Earn ${lesson.xp} XP`} />
            </View>

            {siblings.length > 0 && (
              <View style={styles.progressWrap}>
                <View style={styles.progressLabels}>
                  <Text variant="caption" color="textInverse" style={styles.dim}>
                    {`Lesson ${position} of ${siblings.length}`}
                  </Text>
                  <Text variant="caption" color="textInverse" style={styles.dim}>
                    {`${worldDone}/${siblings.length} complete`}
                  </Text>
                </View>
                <ProgressBar
                  progress={siblings.length ? worldDone / siblings.length : 0}
                  trackColor="overlay"
                  fillColor="textInverse"
                />
              </View>
            )}
          </Animated.View>
        </Gradient>
      </View>

      {/* ---------- Body ---------- */}
      <View style={styles.body}>
        <Intro delay={80} icon="reader-outline" title="Overview">
          <Text variant="body" color="textSecondary">{lesson.description}</Text>
        </Intro>

        <Intro delay={140} icon="bulb-outline" title="Why this matters">
          <Card elevation="sm">
            <Text variant="body">{lesson.explanation ?? lesson.realWorld}</Text>
          </Card>
        </Intro>

        <Intro delay={200} icon="map-outline" title="What you’ll learn">
          <Card elevation="sm">
            <View style={{ gap: spacing.sm }}>
              {lesson.objectives.map(o => (
                <View key={o} style={styles.check}>
                  <View style={[styles.checkDot, { backgroundColor: colors.primaryMuted, borderRadius: radius.pill }]}>
                    <Icon name="checkmark" size={13} color={colors.primary} />
                  </View>
                  <Text variant="body" style={styles.flex}>{o}</Text>
                </View>
              ))}
            </View>
          </Card>
        </Intro>

        <Intro delay={260} icon="earth-outline" title="Real-world applications">
          <Card elevation="sm">
            <Text variant="body">{lesson.realWorld}</Text>
          </Card>
        </Intro>

        <Intro delay={320} icon="ribbon-outline" title="Skills you’ll gain">
          <Card elevation="md" style={{ backgroundColor: colors.primaryMuted }}>
            <Text variant="bodyStrong" color="primary" style={{ marginBottom: spacing.sm }}>
              After this chapter you’ll be able to:
            </Text>
            <View style={{ gap: spacing.sm }}>
              {lesson.keyTakeaways.map(k => (
                <View key={k} style={styles.check}>
                  <Icon name="sparkles" size={15} color={colors.primary} style={{ marginTop: 3 }} />
                  <Text variant="body" style={styles.flex}>{k}</Text>
                </View>
              ))}
            </View>
          </Card>
        </Intro>

        {/* ---------- Motivation ---------- */}
        <Animated.View entering={FadeInDown.delay(380).duration(400)}>
          <Gradient colors={gradient} style={[styles.motivation, { borderRadius: radius.lg }]}>
            <Icon name="rocket-outline" size={22} color="#FFFFFF" />
            <Text variant="h3" color="textInverse" center style={{ marginTop: spacing.sm }}>
              {pickMotivation(lesson)}
            </Text>
          </Gradient>
        </Animated.View>

        {/* ---------- Start / Locked ---------- */}
        <Animated.View entering={FadeInDown.delay(440).duration(400)} style={{ gap: spacing.sm }}>
          {isDone && (
            <View style={styles.doneRow}>
              <Icon name="checkmark-circle" size={16} color={colors.success} />
              <Text variant="label" color="success">You’ve completed this chapter</Text>
            </View>
          )}
          {unlocked ? (
            <>
              <Button
                label={isDone ? 'Review the lesson' : 'Start learning'}
                onPress={start}
                fullWidth
                right={<Icon name="arrow-forward" size={18} color={colors.onPrimary} />}
              />
              <Text variant="caption" color="textTertiary" center>
                {`Complete the interactive lesson and quiz to earn ${lesson.xp} XP.`}
              </Text>
            </>
          ) : (
            <View
              style={[
                styles.lockCard,
                { borderRadius: radius.lg, backgroundColor: colors.surfaceAlt, borderColor: colors.border },
              ]}
            >
              <View style={[styles.lockIcon, { backgroundColor: colors.primaryMuted, borderRadius: radius.pill }]}>
                <Icon name="lock-closed" size={20} color={colors.primary} />
              </View>
              <Text variant="bodyStrong" center>
                Complete the previous chapter to unlock the interactive learning experience.
              </Text>
              <Button label="Start learning" disabled onPress={() => {}} fullWidth />
              {blocker && (
                <Text variant="caption" color="textTertiary" center>
                  {`Finish Chapter ${blocker.order} — “${blocker.title}” — first.`}
                </Text>
              )}
            </View>
          )}
        </Animated.View>
      </View>
    </Screen>
  );
};

const HeroChip: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <View style={styles.heroChip}>
    <Icon name={icon} size={13} color="#FFFFFF" />
    <Text variant="caption" color="textInverse">{label}</Text>
  </View>
);

const Intro: React.FC<{
  delay: number;
  icon: string;
  title: string;
  children: React.ReactNode;
}> = ({ delay, icon, title, children }) => {
  const { colors, spacing } = useTheme();
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400)} style={{ gap: spacing.sm }}>
      <View style={styles.head}>
        <Icon name={icon} size={16} color={colors.primary} />
        <Text variant="label" color="primary">{title.toUpperCase()}</Text>
      </View>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  hero: {
    paddingTop: 56,
    paddingBottom: 28,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  back: { position: 'absolute', top: 44, left: 8, zIndex: 2 },
  ring: { position: 'absolute', borderRadius: 999, borderWidth: 40, borderColor: 'rgba(255,255,255,0.06)' },
  ringA: { width: 220, height: 220, top: -80, right: -60 },
  ringB: { width: 140, height: 140, bottom: -50, left: -30 },
  heroInner: { gap: 8 },
  heroBadge: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  chapterKicker: { opacity: 0.85, letterSpacing: 1 },
  heroSub: { opacity: 0.9, marginTop: 2 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  heroChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  progressWrap: { marginTop: 18, gap: 6 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  dim: { opacity: 0.85 },
  body: { padding: 20, gap: 24 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  check: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  checkDot: { width: 22, height: 22, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  motivation: { alignItems: 'center', padding: 24, overflow: 'hidden' },
  doneRow: { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center' },
  lockCard: { alignItems: 'center', gap: 12, padding: 24, borderWidth: StyleSheet.hairlineWidth },
  lockIcon: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});

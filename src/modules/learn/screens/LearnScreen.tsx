import React, { useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  FadeInRight,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme, useThemeMode } from '../../../theme/ThemeProvider';
import {
  AICopilotModal,
  AITelemetryBar,
  AnimatedBlobs,
  GlassCard,
  Gradient,
  Logo,
  Text,
  XPBadge,
} from '../../../components';
import { RootStackParamList } from '../../../navigation/types';
import { useProgressStore } from '../../../store';
import {
  WORLDS,
  currentWorld,
  isLessonUnlocked,
  lessonsForWorld,
  worldProgress,
} from '../../../content';

/** The 4-step lesson loop labels */
const STEPS = [
  { key: 'discover', label: 'Discover', icon: 'bulb-outline' },
  { key: 'experiment', label: 'Experiment', icon: 'flask-outline' },
  { key: 'understand', label: 'Understand', icon: 'eye-outline' },
  { key: 'challenge', label: 'Challenge', icon: 'trophy-outline' },
] as const;

export const LearnScreen: React.FC = () => {
  const { colors, spacing, radius, gradients, elevation } = useTheme();
  const mode = useThemeMode();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [copilotOpen, setCopilotOpen] = React.useState(false);

  const { xp, streakDays, level, completed } = useProgressStore();

  const world = currentWorld(completed);
  const continueLessons = lessonsForWorld(world.id).filter(
    l => !(l.id in completed),
  );
  const nextLesson = continueLessons[0];
  const worldPct = Math.round(worldProgress(world.id, completed) * 100);

  // Count which "step" within 4-step loop this lesson maps to (cycle through steps)
  const totalDone = Object.keys(completed).length;
  const currentStepIndex = totalDone % 4;

  const sortedWorlds = useMemo(
    () => [...WORLDS].sort((a, b) => a.order - b.order),
    [],
  );

  const openLesson = (id: string) =>
    navigation.navigate('LessonIntro', { lessonId: id });
  const openWorld = (id: string) =>
    navigation.navigate('WorldDetail', { worldId: id });

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.fill, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <AnimatedBlobs intensity={0.4} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {
            paddingVertical: spacing.md,
            gap: spacing.lg,
            paddingBottom: tabBarHeight + spacing.xl,
          },
        ]}>
        {/* ── TOP HEADER ── */}
        <View style={[styles.header, { paddingHorizontal: spacing.lg }]}>
          <Logo size={32} style={{ borderRadius: 8 }} />
          <View style={styles.headerCenter}>
            <Text variant="h3" style={{ fontWeight: '800' }}>
              Your AI Journey
            </Text>
            <Text
              variant="caption"
              color="textSecondary"
              style={{ fontSize: 11, marginTop: 1 }}>
              Master AI by experimenting &amp; solving challenges
            </Text>
          </View>
          <Pressable
            onPress={() => setCopilotOpen(true)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              backgroundColor: colors.primaryMuted,
              borderColor: colors.accent,
              borderWidth: 1,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: radius.pill,
            }}>
            <Text style={{ fontSize: 13 }}>🤖</Text>
            <Text variant="caption" color="accent" style={{ fontWeight: '800', fontSize: 10 }}>
              COPILOT
            </Text>
          </Pressable>
        </View>

        {/* ── LIVE TELEMETRY STRIP ── */}
        <View style={{ paddingHorizontal: spacing.lg, marginTop: -spacing.xs }}>
          <AITelemetryBar />
        </View>

        {/* ── QUICK STATS STRIP ── */}
        <Animated.View
          entering={FadeInDown.delay(50).springify()}
          style={{ paddingHorizontal: spacing.lg }}>
          <View
            style={[
              styles.statsRow,
              {
                backgroundColor: colors.surfaceAlt,
                borderRadius: radius.lg,
                borderColor: colors.glassBorder,
                padding: spacing.xs,
              },
            ]}>
            <XPBadge value={xp} kind="xp" />
            <XPBadge value={streakDays} kind="streak" />
            <View style={styles.spacer} />
            <View
              style={[
                styles.levelPill,
                { backgroundColor: colors.primaryMuted },
              ]}>
              <Icon name="ribbon" size={13} color={colors.primary} />
              <Text variant="label" color="primary">{`Level ${level}`}</Text>
            </View>
          </View>
        </Animated.View>

        {/* ── PRIMARY HERO: CONTINUE JOURNEY ── */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={{ paddingHorizontal: spacing.lg }}>
          {/* App purpose tagline */}
          <Text
            variant="caption"
            color="textSecondary"
            style={[styles.tagline, { marginBottom: spacing.sm }]}>
            🎯 Learn AI by doing — not by reading boring theory
          </Text>

          <Pressable
            onPress={() =>
              nextLesson ? openLesson(nextLesson.id) : openWorld(world.id)
            }
            style={({ pressed }) => [{ opacity: pressed ? 0.92 : 1 }]}
            accessibilityRole="button"
            accessibilityLabel="Continue your AI learning journey">
            <View
              style={[
                styles.heroCard,
                { borderRadius: radius.xl, overflow: 'hidden' },
                elevation.glow,
              ]}>
              <Gradient
                colors={world.gradient || gradients.brand}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
                borderRadius={radius.xl}
              />
              <View style={{ padding: spacing.lg, gap: spacing.md }}>
                {/* World badge */}
                <View style={styles.worldBadgeRow}>
                  <View style={styles.worldBadge}>
                    <Text
                      variant="caption"
                      color="textInverse"
                      style={{
                        fontWeight: '800',
                        fontSize: 9,
                        letterSpacing: 1.2,
                      }}>
                      YOUR CURRENT TOPIC · WORLD {world.order}
                    </Text>
                  </View>
                  <Text
                    variant="caption"
                    color="textInverse"
                    style={{ fontWeight: '700', opacity: 0.9 }}>
                    {worldPct}% done
                  </Text>
                </View>

                {/* World title */}
                <View>
                  <Text
                    variant="h2"
                    color="textInverse"
                    style={{ marginTop: 2 }}>
                    {world.title}
                  </Text>
                  <Text
                    variant="caption"
                    color="textInverse"
                    style={{ opacity: 0.88, marginTop: 4, lineHeight: 17 }}>
                    {world.subtitle}
                  </Text>
                </View>

                {/* 4-Step Lesson Engine Progress */}
                <View
                  style={[
                    styles.stepLoopRow,
                    {
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      borderRadius: radius.md,
                      padding: spacing.sm,
                    },
                  ]}>
                  {STEPS.map((step, i) => {
                    const isActive = i === currentStepIndex;
                    const isDone = i < currentStepIndex;
                    return (
                      <View key={step.key} style={styles.stepItem}>
                        <View
                          style={[
                            styles.stepDot,
                            {
                              backgroundColor: isDone
                                ? 'rgba(255,255,255,0.9)'
                                : isActive
                                ? '#FFFFFF'
                                : 'rgba(255,255,255,0.2)',
                              borderWidth: isActive ? 2 : 0,
                              borderColor: 'rgba(255,255,255,0.6)',
                            },
                          ]}>
                          <Icon
                            name={isDone ? 'checkmark' : step.icon}
                            size={10}
                            color={
                              isDone || isActive
                                ? colors.primary
                                : 'rgba(255,255,255,0.5)'
                            }
                          />
                        </View>
                        <Text
                          variant="caption"
                          color="textInverse"
                          style={{
                            fontSize: 9,
                            fontWeight: isActive ? '800' : '500',
                            opacity: isActive ? 1 : isDone ? 0.8 : 0.5,
                          }}>
                          {step.label}
                        </Text>
                      </View>
                    );
                  })}
                </View>

                {/* Next lesson preview */}
                {nextLesson && (
                  <View
                    style={[
                      styles.nextLessonBox,
                      { borderRadius: radius.md },
                    ]}>
                    <View style={styles.spacer}>
                      <Text
                        variant="caption"
                        color="textInverse"
                        style={{ opacity: 0.75, fontSize: 10, textTransform: 'uppercase' }}>
                        Next up
                      </Text>
                      <Text
                        variant="bodyStrong"
                        color="textInverse"
                        numberOfLines={1}
                        style={{ fontSize: 14 }}>
                        {`Ch ${nextLesson.order}: ${nextLesson.title}`}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.xpChip,
                        { backgroundColor: 'rgba(255,255,255,0.2)' },
                      ]}>
                      <Icon name="flash" size={11} color="#FACC15" />
                      <Text
                        variant="caption"
                        color="textInverse"
                        style={{ fontWeight: '700', fontSize: 10 }}>
                        {`+${nextLesson.xp} XP`}
                      </Text>
                    </View>
                  </View>
                )}

                {/* PRIMARY CTA */}
                <Pressable
                  onPress={() =>
                    nextLesson
                      ? openLesson(nextLesson.id)
                      : openWorld(world.id)
                  }
                  style={({ pressed }) => [
                    styles.ctaBtn,
                    { opacity: pressed ? 0.9 : 1 },
                  ]}>
                  <Icon
                    name={nextLesson ? 'play-circle' : 'rocket'}
                    size={20}
                    color={colors.primary}
                  />
                  <Text
                    variant="bodyStrong"
                    style={{
                      color: colors.primary,
                      fontSize: 15,
                      fontWeight: '800',
                    }}>
                    {nextLesson
                      ? 'Continue Journey →'
                      : 'Start Chapter 1 →'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </Animated.View>

        {/* ── VISUAL PROGRESS TRAIL MAP ── */}
        <Animated.View
          entering={FadeInDown.delay(180).springify()}
          style={{ paddingHorizontal: spacing.lg }}>
          <Text
            variant="bodyStrong"
            style={{ marginBottom: spacing.sm, fontSize: 15 }}>
            Your Learning Trail
          </Text>

          {sortedWorlds.map((w, idx) => {
            const wProgress = worldProgress(w.id, completed);
            const pct = Math.round(wProgress * 100);
            const lessons = lessonsForWorld(w.id);
            const isCurrentWorld = w.id === world.id;
            const isCompleted = pct === 100;
            const isLocked = false;

            const nodeColor = isCompleted
              ? '#12D18E'
              : isCurrentWorld
              ? w.gradient?.[0] ?? colors.primary
              : isLocked
              ? colors.textTertiary
              : colors.textSecondary;

            return (
              <Animated.View
                key={w.id}
                entering={FadeInRight.delay(idx * 60).springify()}>
                {/* Connector line above (except first) */}
                {idx > 0 && (
                  <View style={styles.connectorWrap}>
                    <View
                      style={[
                        styles.connector,
                        {
                          backgroundColor: isLocked
                            ? colors.border
                            : nodeColor + '55',
                        },
                      ]}
                    />
                  </View>
                )}

                <Pressable
                  onPress={() => !isLocked && openWorld(w.id)}
                  disabled={isLocked}
                  accessibilityRole="button"
                  accessibilityLabel={`${w.title}${isLocked ? ', locked' : ''}`}
                  style={({ pressed }) => [
                    { opacity: pressed ? 0.85 : 1 },
                  ]}>
                  <GlassCard
                    elevation={isCurrentWorld ? 'glow' : 'sm'}
                    padded={false}
                    style={[
                      styles.trailNode,
                      {
                        borderRadius: radius.lg,
                        borderColor: isCurrentWorld
                          ? nodeColor + '88'
                          : isCompleted
                          ? '#12D18E55'
                          : colors.border,
                        borderWidth: isCurrentWorld ? 2 : 1,
                        backgroundColor: isCurrentWorld
                          ? nodeColor + '12'
                          : 'transparent',
                      },
                    ]}>
                    <View
                      style={[styles.trailRow, { padding: spacing.md }]}>
                      {/* Node indicator */}
                      <View
                        style={[
                          styles.trailNodeDot,
                          {
                            backgroundColor: isLocked
                              ? colors.border
                              : nodeColor,
                          },
                        ]}>
                        {isCompleted ? (
                          <Icon
                            name="checkmark"
                            size={14}
                            color="#FFFFFF"
                          />
                        ) : isLocked ? (
                          <Icon
                            name="lock-closed"
                            size={13}
                            color={colors.textTertiary}
                          />
                        ) : (
                          <Text
                            style={{
                              fontSize: 12,
                              fontWeight: '800',
                              color: '#FFFFFF',
                            }}>
                            {w.order}
                          </Text>
                        )}
                      </View>

                      {/* World info */}
                      <View style={styles.spacer}>
                        <View style={styles.trailTitleRow}>
                          <Text
                            variant="bodyStrong"
                            color={
                              isLocked ? 'textTertiary' : 'text'
                            }
                            style={{ fontSize: 14 }}
                            numberOfLines={1}>
                            {w.title}
                          </Text>
                          {isCurrentWorld && (
                            <View
                              style={[
                                styles.currentChip,
                                { backgroundColor: nodeColor + '22' },
                              ]}>
                              <Text
                                variant="caption"
                                style={{
                                  color: nodeColor,
                                  fontSize: 9,
                                  fontWeight: '800',
                                }}>
                                IN PROGRESS
                              </Text>
                            </View>
                          )}
                          {isCompleted && (
                            <View
                              style={[
                                styles.currentChip,
                                { backgroundColor: '#12D18E22' },
                              ]}>
                              <Text
                                variant="caption"
                                style={{
                                  color: '#12D18E',
                                  fontSize: 9,
                                  fontWeight: '800',
                                }}>
                                ✓ DONE
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text
                          variant="caption"
                          color="textSecondary"
                          style={{ marginTop: 2, fontSize: 11 }}
                          numberOfLines={1}>
                          {isLocked
                            ? 'Complete earlier worlds to unlock'
                            : `${lessons.length} lessons · ${pct}% complete`}
                        </Text>
                        {/* Mini progress bar */}
                        {!isLocked && (
                          <View
                            style={[
                              styles.miniBarBg,
                              {
                                backgroundColor: colors.border,
                                borderRadius: radius.pill,
                                marginTop: 6,
                              },
                            ]}>
                            <View
                              style={[
                                styles.miniBarFill,
                                {
                                  width: `${pct}%` as any,
                                  backgroundColor: nodeColor,
                                  borderRadius: radius.pill,
                                },
                              ]}
                            />
                          </View>
                        )}
                      </View>

                      {/* Chevron / lock icon */}
                      <Icon
                        name={
                          isLocked
                            ? 'chevron-forward'
                            : 'chevron-forward'
                        }
                        size={16}
                        color={
                          isLocked
                            ? colors.border
                            : colors.textTertiary
                        }
                      />
                    </View>
                  </GlassCard>
                </Pressable>
              </Animated.View>
            );
          })}
        </Animated.View>
      </ScrollView>
      <AICopilotModal
        visible={copilotOpen}
        onClose={() => setCopilotOpen(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  fill: { flex: 1 },
  scroll: { flexGrow: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerCenter: { flex: 1, marginLeft: 2 },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  spacer: { flex: 1 },
  levelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tagline: {
    textAlign: 'center',
    fontSize: 12,
    fontStyle: 'italic',
  },
  heroCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  worldBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  worldBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  stepLoopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  stepItem: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextLessonBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.22)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  xpChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  connectorWrap: {
    alignItems: 'center',
    paddingVertical: 2,
  },
  connector: {
    width: 2,
    height: 16,
    borderRadius: 1,
  },
  trailNode: {
    overflow: 'hidden',
  },
  trailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trailNodeDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trailTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  currentChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
  },
  miniBarBg: {
    height: 4,
    width: '100%',
  },
  miniBarFill: {
    height: 4,
  },
});

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  Card,
  GlassCard,
  Gradient,
  Screen,
  SectionTitle,
  Text,
} from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { RootStackParamList } from '../../../navigation/types';
import { useProgressStore } from '../../../store';
import {
  Activity,
  LESSONS,
  WORLDS,
  isLessonUnlocked,
} from '../../../content';
import { useTranslation } from '../../../i18n/useTranslation';

/** How each activity kind presents as a "sim" in the launcher. */
const KIND_META: Record<Activity['kind'], { icon: string; tag: string }> = {
  sequence: { icon: 'git-commit-outline', tag: 'Predict' },
  bucket: { icon: 'file-tray-stacked-outline', tag: 'Sort' },
  slider: { icon: 'options-outline', tag: 'Tune' },
  steps: { icon: 'swap-vertical-outline', tag: 'Arrange' },
};

export const PlaygroundScreen: React.FC = () => {
  const { colors, spacing, radius, gradients, elevation } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const completed = useProgressStore(s => s.completed);
  const xp = useProgressStore(s => s.xp);
  const level = useProgressStore(s => s.level);

  const unlockedCount = LESSONS.filter(l => isLessonUnlocked(l, completed)).length;

  return (
    <Screen scroll contentContainerStyle={{ gap: spacing.xl, paddingBottom: tabBarHeight + spacing.lg }}>
      {/* Hero Banner */}
      <Animated.View>
        <GlassCard elevation="glow" padded={false} style={{ borderRadius: radius.xl, overflow: 'hidden' }}>
          <Gradient colors={gradients.cool} style={StyleSheet.absoluteFill} />
          <View style={{ padding: spacing.xl, gap: spacing.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Icon name="game-controller-outline" size={18} color="#FFFFFF" />
              <Text variant="label" color="textInverse" style={{ opacity: 0.95, letterSpacing: 1 }}>
                INTERACTIVE PLAYGROUND
              </Text>
            </View>
            <Text variant="h1" color="textInverse">
              Hands-on AI Arcade
            </Text>
            <Text variant="body" color="textInverse" style={styles.heroCopy}>
              Interactive mini-sims and games for every AI topic. Poke the models, tune hyper-parameters, and watch real-time reactions.
            </Text>

            <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs, flexWrap: 'wrap' }}>
              <View style={{ backgroundColor: 'rgba(255,255,255,0.22)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: radius.pill, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Icon name="flask-outline" size={13} color="#FFFFFF" />
                <Text variant="label" color="textInverse" style={{ fontSize: 11 }}>{`${unlockedCount}/${LESSONS.length} Sims Unlocked`}</Text>
              </View>
              <View style={{ backgroundColor: 'rgba(255,255,255,0.22)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: radius.pill, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Icon name="star" size={13} color="#FFFFFF" />
                <Text variant="label" color="textInverse" style={{ fontSize: 11 }}>{`Lvl ${level} · ${xp} XP`}</Text>
              </View>
            </View>
          </View>
        </GlassCard>
      </Animated.View>

      {/* Featured: Inside the AI Brain — interactive sims + detective */}
      <Animated.View>
        <GlassCard
          elevation="glow"
          padded={false}
          onPress={() => navigation.navigate('Brain')}
          style={{
            borderRadius: radius.xl,
            overflow: 'hidden',
            borderWidth: 1.5,
            borderColor: '#7C5CFF88',
            backgroundColor: 'rgba(124, 92, 255, 0.22)',
          }}
        >
          <View style={{ padding: spacing.lg, gap: spacing.sm }}>
            <View style={styles.simRow}>
              <Gradient colors={['#7C5CFF', '#06D6C4']} style={[styles.featuredIcon, { borderRadius: radius.md, ...elevation.glow }]}>
                <Icon name="hardware-chip" size={24} color="#FFFFFF" />
              </Gradient>
              <View style={styles.textCol}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text variant="bodyStrong" style={{ fontSize: 16 }}>Inside the AI Brain</Text>
                  <View style={{ backgroundColor: '#7C5CFF33', paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill }}>
                    <Text variant="caption" style={{ color: '#9B85FF', fontSize: 9, fontWeight: '800' }}>🎮 SIMS & CASES</Text>
                  </View>
                </View>
                <Text variant="caption" color="textSecondary" numberOfLines={2} style={{ marginTop: 2 }}>
                  20 interactive simulations + AI Detective cases. Learn model weights, embeddings, attention maps & temperature hands-on.
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 4 }}>
              <View style={{ backgroundColor: '#7C5CFF', paddingHorizontal: 14, paddingVertical: 6, borderRadius: radius.pill, flexDirection: 'row', alignItems: 'center', gap: 4, ...elevation.glow }}>
                <Text variant="label" color="onPrimary" style={{ fontSize: 11, fontWeight: '700' }}>Launch Sims 🚀</Text>
                <Icon name="arrow-forward" size={13} color="#FFFFFF" />
              </View>
            </View>
          </View>
        </GlassCard>
      </Animated.View>

      {/* Featured: Build the AI game */}
      <Animated.View>
        <GlassCard
          elevation="glow"
          padded={false}
          onPress={() => navigation.navigate('BuildAI')}
          style={{
            borderRadius: radius.xl,
            overflow: 'hidden',
            borderWidth: 1.5,
            borderColor: '#FF2E9388',
            backgroundColor: 'rgba(255, 46, 147, 0.22)',
          }}
        >
          <View style={{ padding: spacing.lg, gap: spacing.sm }}>
            <View style={styles.simRow}>
              <Gradient colors={['#FF2E93', '#F59E0B']} style={[styles.featuredIcon, { borderRadius: radius.md, ...elevation.glow }]}>
                <Icon name="construct" size={24} color="#FFFFFF" />
              </Gradient>
              <View style={styles.textCol}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text variant="bodyStrong" style={{ fontSize: 16 }}>Build the AI</Text>
                  <View style={{ backgroundColor: '#FF2E9333', paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill }}>
                    <Text variant="caption" style={{ color: '#FF5FA2', fontSize: 9, fontWeight: '800' }}>🛠️ ARCHITECTURE</Text>
                  </View>
                </View>
                <Text variant="caption" color="textSecondary" numberOfLines={2} style={{ marginTop: 2 }}>
                  Assemble real production AI architectures block-by-block. Connect LLMs, Vector DBs, RAG pipelines, and security guardrails.
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 4 }}>
              <View style={{ backgroundColor: '#FF2E93', paddingHorizontal: 14, paddingVertical: 6, borderRadius: radius.pill, flexDirection: 'row', alignItems: 'center', gap: 4, ...elevation.glow }}>
                <Text variant="label" color="onPrimary" style={{ fontSize: 11, fontWeight: '700' }}>Build Now 🛠️</Text>
                <Icon name="arrow-forward" size={13} color="#FFFFFF" />
              </View>
            </View>
          </View>
        </GlassCard>
      </Animated.View>

      {/* Featured: What Would You Build? */}
      <Animated.View>
        <GlassCard
          elevation="glow"
          padded={false}
          onPress={() => navigation.navigate('WhatToBuild')}
          style={{
            borderRadius: radius.xl,
            overflow: 'hidden',
            borderWidth: 1.5,
            borderColor: '#06D6C488',
            backgroundColor: 'rgba(6, 214, 196, 0.22)',
          }}
        >
          <View style={{ padding: spacing.lg, gap: spacing.sm }}>
            <View style={styles.simRow}>
              <Gradient colors={['#06D6C4', '#3B82F6']} style={[styles.featuredIcon, { borderRadius: radius.md, ...elevation.glow }]}>
                <Icon name="bulb" size={24} color="#FFFFFF" />
              </Gradient>
              <View style={styles.textCol}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text variant="bodyStrong" style={{ fontSize: 16 }}>What Would You Build?</Text>
                  <View style={{ backgroundColor: '#06D6C433', paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill }}>
                    <Text variant="caption" style={{ color: '#06D6C4', fontSize: 9, fontWeight: '800' }}>🔍 STACK DISCOVERY</Text>
                  </View>
                </View>
                <Text variant="caption" color="textSecondary" numberOfLines={2} style={{ marginTop: 2 }}>
                  Select product requirements and discover real-world AI tech stacks used by top tech companies.
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 4 }}>
              <View style={{ backgroundColor: '#06D6C4', paddingHorizontal: 14, paddingVertical: 6, borderRadius: radius.pill, flexDirection: 'row', alignItems: 'center', gap: 4, ...elevation.glow }}>
                <Text variant="label" color="onPrimary" style={{ fontSize: 11, fontWeight: '700', color: '#000000' }}>Explore Stack 🔍</Text>
                <Icon name="arrow-forward" size={13} color="#000000" />
              </View>
            </View>
          </View>
        </GlassCard>
      </Animated.View>

      {/* Quick actions */}
      <Animated.View style={[styles.quickRow, { gap: spacing.md }]}>
        <QuickCard
          icon="sparkles"
          label="Daily Challenge"
          tag="⚡ +50 XP REWARDS"
          grad={['#F59E0B', '#FF5FA2']}
          color="#F59E0B"
          bgColor="rgba(245, 158, 11, 0.2)"
          borderColor="rgba(245, 158, 11, 0.65)"
          onPress={() => navigation.navigate('DailyChallenge')}
        />
        <QuickCard
          icon="book"
          label="AI Glossary"
          tag="📖 DEFINITIONS"
          grad={['#A855F7', '#7C5CFF']}
          color="#A855F7"
          bgColor="rgba(168, 85, 247, 0.2)"
          borderColor="rgba(168, 85, 247, 0.65)"
          onPress={() => navigation.navigate('Glossary')}
        />
      </Animated.View>

      {/* World Interactive Simulations */}
      {WORLDS.map((world, wi) => {
        const sims = LESSONS.filter(l => l.worldId === world.id);
        if (sims.length === 0) return null;
        const worldGrad = world.gradient ?? ['#7C5CFF', '#06D6C4'];
        const worldAccent = worldGrad[0];

        return (
          <Animated.View key={world.id} style={{ marginTop: spacing.md, gap: spacing.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Gradient colors={worldGrad} style={{ width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={world.icon} size={16} color="#FFFFFF" />
              </Gradient>
              <Text variant="bodyStrong" style={{ fontSize: 16 }}>{world.title}</Text>
            </View>

            <View style={{ gap: spacing.sm }}>
              {sims.map(lesson => {
                const meta = KIND_META[lesson.activity.kind];
                const locked = !isLessonUnlocked(lesson, completed);
                return (
                  <Pressable
                    key={lesson.id}
                    disabled={locked}
                    accessibilityRole="button"
                    accessibilityLabel={`${lesson.activity.title}${locked ? ', locked' : ''}`}
                    onPress={() =>
                      navigation.navigate('Simulations', { lessonId: lesson.id })
                    }
                    style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                  >
                    <GlassCard
                      elevation={locked ? 'sm' : 'glow'}
                      padded={false}
                      style={{
                        borderRadius: radius.lg,
                        overflow: 'hidden',
                        backgroundColor: locked ? 'rgba(255,255,255,0.04)' : worldAccent + '18',
                        borderColor: locked ? colors.border : worldAccent + '66',
                        borderWidth: 1.5,
                        flexDirection: 'row',
                      }}
                    >
                      {/* Left Gradient Accent Line */}
                      {!locked && (
                        <Gradient colors={worldGrad} style={{ width: 5 }} />
                      )}
                      <View style={[styles.simRow, { flex: 1, padding: spacing.md }]}>
                        {locked ? (
                          <View style={[styles.simIcon, { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: radius.md }]}>
                            <Icon name="lock-closed" size={20} color={colors.textTertiary} />
                          </View>
                        ) : (
                          <Gradient colors={worldGrad} style={[styles.simIcon, { borderRadius: radius.md, ...elevation.glow }]}>
                            <Icon name={meta.icon} size={20} color="#FFFFFF" />
                          </Gradient>
                        )}
                        <View style={styles.textCol}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Text
                              variant="bodyStrong"
                              color={locked ? 'textTertiary' : 'text'}
                              numberOfLines={1}
                            >
                              {lesson.activity.title}
                            </Text>
                            {!locked && (
                              <View style={{ backgroundColor: worldAccent + '33', paddingHorizontal: 6, paddingVertical: 2, borderRadius: radius.pill }}>
                                <Text variant="caption" style={{ color: worldAccent, fontSize: 9, fontWeight: '800' }}>{meta.tag.toUpperCase()}</Text>
                              </View>
                            )}
                          </View>
                          <Text variant="caption" color="textSecondary" numberOfLines={1} style={{ marginTop: 2 }}>
                            {locked ? 'Locked · finish earlier lessons to unlock' : lesson.title}
                          </Text>
                        </View>
                        {!locked ? (
                          <View style={{ backgroundColor: worldAccent, paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill, flexDirection: 'row', alignItems: 'center', gap: 4, ...elevation.glow }}>
                            <Text variant="label" style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '700' }}>Play ▶</Text>
                          </View>
                        ) : (
                          <View style={{ backgroundColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.pill }}>
                            <Text variant="caption" color="textTertiary" style={{ fontSize: 10 }}>Locked</Text>
                          </View>
                        )}
                      </View>
                    </GlassCard>
                  </Pressable>
                );
              })}
            </View>
          </Animated.View>
        );
      })}
    </Screen>
  );
};

const QuickCard: React.FC<{
  icon: string;
  label: string;
  tag: string;
  grad: readonly [string, string];
  color: string;
  bgColor: string;
  borderColor: string;
  onPress: () => void;
}> = ({ icon, label, tag, grad, color, bgColor, borderColor, onPress }) => {
  const { radius, elevation } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.flex, { opacity: pressed ? 0.75 : 1 }]}
    >
      <GlassCard
        elevation="glow"
        padded={false}
        style={{
          borderRadius: radius.xl,
          overflow: 'hidden',
          backgroundColor: bgColor,
          borderColor: borderColor,
          borderWidth: 1.5,
          padding: 14,
        }}
      >
        <View style={{ gap: 10 }}>
          <Gradient colors={grad} style={[styles.quickIcon, { borderRadius: radius.md, ...elevation.glow }]}>
            <Icon name={icon} size={22} color="#FFFFFF" />
          </Gradient>
          <View>
            <Text variant="bodyStrong" style={{ fontSize: 15 }}>{label}</Text>
            <Text variant="caption" style={{ color: color, fontSize: 10, fontWeight: '800', marginTop: 2 }}>{tag}</Text>
          </View>
        </View>
      </GlassCard>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  textCol: { flex: 1, minWidth: 0, gap: 2 },
  heroCopy: { opacity: 0.92, marginTop: 4, lineHeight: 18 },
  quickRow: { flexDirection: 'row' },
  quickIcon: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  featuredIcon: { width: 52, height: 52, alignItems: 'center', justifyContent: 'center' },
  simRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  simIcon: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});


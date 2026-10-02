import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  AICopilotModal,
  AITelemetryBar,
  GlassCard,
  Gradient,
  Screen,
  SectionTitle,
  Text,
} from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { RootStackParamList } from '../../../navigation/types';
import { useProgressStore } from '../../../store';
import { LESSONS, isLessonUnlocked } from '../../../content';
import { CASES, SIMS } from '../../brain/data';
import { useBrainStore } from '../../../store';

/** A single tool card in the Sandbox hub. */
const SandboxCard: React.FC<{
  title: string;
  description: string;
  icon: string;
  tag: string;
  gradient: readonly string[];
  borderColor: string;
  onPress: () => void;
}> = ({ title, description, icon, tag, gradient, borderColor, onPress }) => {
  const { radius, elevation, spacing } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}>
      <GlassCard
        elevation="glow"
        padded={false}
        style={[
          styles.sandboxCard,
          {
            borderRadius: radius.xl,
            overflow: 'hidden',
            borderColor,
            borderWidth: 1.5,
          },
        ]}>
        <View style={{ padding: spacing.lg, gap: spacing.sm }}>
          <View style={styles.cardHeaderRow}>
            <Gradient
              colors={gradient}
              style={[
                styles.cardIcon,
                { borderRadius: radius.md, ...elevation.glow },
              ]}>
              <Icon name={icon} size={24} color="#FFFFFF" />
            </Gradient>
            <View
              style={[
                styles.tagPill,
                { backgroundColor: gradient[0] + '25' },
              ]}>
              <Text
                variant="caption"
                style={{
                  color: gradient[0],
                  fontSize: 9,
                  fontWeight: '800',
                }}>
                {tag}
              </Text>
            </View>
          </View>
          <Text variant="bodyStrong" style={{ fontSize: 16 }}>
            {title}
          </Text>
          <Text
            variant="caption"
            color="textSecondary"
            numberOfLines={2}
            style={{ lineHeight: 17 }}>
            {description}
          </Text>
          <View style={styles.launchRow}>
            <View
              style={[
                styles.launchBtn,
                { backgroundColor: gradient[0], ...elevation.glow },
              ]}>
              <Text
                variant="label"
                style={{
                  color: '#FFFFFF',
                  fontSize: 11,
                  fontWeight: '700',
                }}>
                Open →
              </Text>
            </View>
          </View>
        </View>
      </GlassCard>
    </Pressable>
  );
};

export const SandboxScreen: React.FC = () => {
  const { colors, spacing, radius, gradients, elevation } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [copilotOpen, setCopilotOpen] = React.useState(false);

  const completed = useProgressStore(s => s.completed);
  const casesState = useBrainStore(s => s.cases);
  const unlockedCount = LESSONS.filter(l => isLessonUnlocked(l, completed)).length;
  const arenaCase = CASES.find(c => !casesState[c.id]?.solved) ?? CASES[0];

  const TOOLS = [
    {
      title: 'Neural Playground',
      description:
        'Run 22+ interactive AI simulations — attention heatmaps, weight sliders, embedding spaces, and more. Watch models "think" in real time.',
      icon: 'hardware-chip',
      tag: '🧠 22 SIMULATIONS',
      gradient: ['#7C5CFF', '#06D6C4'] as const,
      borderColor: '#7C5CFF55',
      onPress: () => navigation.navigate('Brain'),
    },
    {
      title: 'AI Detective',
      description:
        'Investigate scenarios where AI went wrong. Identify hallucinations, bias, and reasoning failures. Earn your detective badge.',
      icon: 'search',
      tag: '🕵️ MYSTERY CASES',
      gradient: ['#12D18E', '#3B82F6'] as const,
      borderColor: '#12D18E55',
      onPress: () => navigation.navigate('Detective', { caseId: arenaCase.id }),
    },
    {
      title: 'AI Architecture Lab',
      description:
        'Build real AI pipelines block-by-block — chatbots, RAG search, voice AI, and guardrails. See what production AI looks like.',
      icon: 'construct',
      tag: '🛠️ BUILD PIPELINES',
      gradient: ['#FF2E93', '#F59E0B'] as const,
      borderColor: '#FF2E9355',
      onPress: () => navigation.navigate('BuildAI'),
    },
    {
      title: 'AI Arcade',
      description:
        'Play 10+ AI-powered mini-games — Vector Shooter, Neural Pong, MythBusters. Fun that teaches real concepts.',
      icon: 'game-controller',
      tag: '🎮 10+ GAMES',
      gradient: gradients.brand as unknown as readonly string[],
      borderColor: '#FF2E9355',
      onPress: () => navigation.navigate('AIGames'),
    },
    {
      title: 'Tech Stack Discovery',
      description:
        'Select your product requirements and discover the real-world AI stacks used by leading tech companies.',
      icon: 'bulb',
      tag: '🔍 STACK EXPLORER',
      gradient: ['#06D6C4', '#3B82F6'] as const,
      borderColor: '#06D6C455',
      onPress: () => navigation.navigate('WhatToBuild'),
    },
    {
      title: 'Daily Challenge',
      description:
        'A quick 5-minute challenge from your unlocked lessons each day. Earn bonus XP and keep your streak alive.',
      icon: 'flash',
      tag: '⚡ +50 XP BONUS',
      gradient: ['#F59E0B', '#FF5FA2'] as const,
      borderColor: '#F59E0B55',
      onPress: () => navigation.navigate('DailyChallenge'),
    },
  ];

  return (
    <Screen
      scroll
      contentContainerStyle={{
        gap: spacing.lg,
        paddingBottom: tabBarHeight + spacing.xl,
      }}>
      {/* Live AI Telemetry Ticker */}
      <AITelemetryBar />
      {/* Hero Banner */}
      <Animated.View entering={FadeInDown.springify()}>
        <GlassCard
          elevation="glow"
          padded={false}
          style={{ borderRadius: radius.xl, overflow: 'hidden' }}>
          <Gradient colors={['#7C5CFF', '#FF2E93', '#F59E0B']} style={StyleSheet.absoluteFill} />
          <View style={{ padding: spacing.xl, gap: spacing.sm }}>
            <View style={styles.heroTagRow}>
              <Icon name="flask-outline" size={16} color="#FFFFFF" />
              <Text
                variant="label"
                color="textInverse"
                style={{ opacity: 0.95, letterSpacing: 1, fontSize: 11 }}>
                SANDBOX — FREEFORM EXPLORATION
              </Text>
            </View>
            <Text variant="h2" color="textInverse">
              Experiment Freely
            </Text>
            <Text
              variant="body"
              color="textInverse"
              style={{ opacity: 0.9, lineHeight: 20 }}>
              Explore AI concepts by doing. No pressure, no locked paths —
              just you and the tools.
            </Text>
            <View style={styles.statPillRow}>
              <View style={styles.statPill}>
                <Icon name="flask-outline" size={12} color="#FFFFFF" />
                <Text
                  variant="label"
                  color="textInverse"
                  style={{ fontSize: 11 }}>
                  {`${unlockedCount}/${LESSONS.length} Sims Unlocked`}
                </Text>
              </View>
              <View style={styles.statPill}>
                <Icon name="game-controller-outline" size={12} color="#FFFFFF" />
                <Text
                  variant="label"
                  color="textInverse"
                  style={{ fontSize: 11 }}>
                  {SIMS.length}+ Simulations
                </Text>
              </View>
            </View>
          </View>
        </GlassCard>
      </Animated.View>

      {/* Tool cards */}
      <SectionTitle
        title="Choose Your Playground"
        actionLabel={undefined}
      />
      <View style={{ gap: spacing.md }}>
        {TOOLS.slice(0, 3).map((tool, i) => (
          <Animated.View
            key={tool.title}
            entering={FadeInDown.delay(i * 80).springify()}>
            <SandboxCard {...tool} />
          </Animated.View>
        ))}
      </View>

      {/* Quick access row */}
      <SectionTitle
        title="Quick Access"
        actionLabel={undefined}
      />
      <View style={{ gap: spacing.md }}>
        {TOOLS.slice(3).map((tool, i) => (
          <Animated.View
            key={tool.title}
            entering={FadeInDown.delay((i + 3) * 80).springify()}>
            <SandboxCard {...tool} />
          </Animated.View>
        ))}
      </View>
      {/* AICopilotModal overlay */}
      <AICopilotModal
        visible={copilotOpen}
        onClose={() => setCopilotOpen(false)}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  sandboxCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardIcon: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  launchRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  launchBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
  },
  heroTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statPillRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
});

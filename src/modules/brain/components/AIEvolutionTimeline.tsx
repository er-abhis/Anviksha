import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { GlassCard } from '../../../components/GlassCard';
import { Text } from '../../../components/Text';
import { useTheme } from '../../../theme/ThemeProvider';

export interface Milestone {
  year: string;
  title: string;
  tag: string;
  impact: string;
  description: string;
  icon: string;
  color: string;
}

const MILESTONES: Milestone[] = [
  {
    year: '1958',
    title: 'The Perceptron Invention',
    tag: '1st Artificial Neuron',
    impact: 'First hardware implementation of a single-layer neural network capable of basic linear classification.',
    description: 'Frank Rosenblatt built the Mark I Perceptron at Cornell Aeronautical Laboratory, laying the foundations for modern artificial neural networks.',
    icon: 'hardware-chip-outline',
    color: '#6366F1',
  },
  {
    year: '1986',
    title: 'Backpropagation Algorithm',
    tag: 'Gradient Training',
    impact: 'Allowed multi-layer neural networks to learn representations by propagating errors backwards.',
    description: 'Rumelhart, Hinton, and Williams published the backpropagation breakthrough, solving the XOR limit of single Perceptrons.',
    icon: 'git-branch-outline',
    color: '#EC4899',
  },
  {
    year: '2012',
    title: 'AlexNet ImageNet Breakthrough',
    tag: 'GPU Deep Learning',
    impact: 'Proved GPU-accelerated Convolutional Neural Networks (CNNs) drastically outperform classical computer vision.',
    description: 'Alex Krizhevsky, Ilya Sutskever, and Geoffrey Hinton won ImageNet by a massive 10.8% margin, igniting the modern Deep Learning era.',
    icon: 'image-outline',
    color: '#10B981',
  },
  {
    year: '2017',
    title: 'Attention Is All You Need',
    tag: 'Transformer Architecture',
    impact: 'Replaced recurrent neural networks (RNNs) with self-attention, enabling parallel processing of text.',
    description: 'Google researchers introduced the Transformer, the foundational architecture behind all modern Large Language Models (LLMs).',
    icon: 'sparkles-outline',
    color: '#F59E0B',
  },
  {
    year: '2022',
    title: 'ChatGPT & Consumer LLMs',
    tag: 'Generative AI Boom',
    impact: 'RLHF-tuned GPT-3.5 brought conversational AI to 100M users in 2 months.',
    description: 'Demonstrated natural dialogue, code generation, and instruction-following to the global public.',
    icon: 'chatbubbles-outline',
    color: '#8B5CF6',
  },
  {
    year: '2024',
    title: 'Multimodal & 2M Context',
    tag: 'Native Vision & Video RAG',
    impact: 'Models process entire codebases, 1-hour videos, and instant multimodal voice streams natively.',
    description: 'Gemini 1.5 Pro introduced 2,000,000 token context windows, while Claude 3.5 Sonnet redefined software coding benchmarks.',
    icon: 'layers-outline',
    color: '#06B6D4',
  },
  {
    year: '2025-2026',
    title: 'Pure RL & Reasoning Era',
    tag: 'Chain-of-Thought & Open Weights',
    impact: 'DeepSeek-R1 proved pure RL without human supervised tuning achieves frontier reasoning at 95% lower cost.',
    description: 'Open-weights models achieved parity with closed APIs, opening the era of local edge deployment and autonomous agent execution.',
    icon: 'rocket-outline',
    color: '#3B82F6',
  },
];

export const AIEvolutionTimeline: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const [activeIdx, setActiveIdx] = useState<number>(MILESTONES.length - 1);

  const active = MILESTONES[activeIdx];

  return (
    <GlassCard elevation="glow" style={{ borderRadius: radius.xl, padding: spacing.md, gap: spacing.sm }}>
      {/* Title Header */}
      <View style={styles.titleRow}>
        <Icon name="time-outline" size={20} color={colors.accent} />
        <Text variant="h3" style={{ fontSize: 15, fontWeight: '800' }}>
          AI History & Evolution Timeline
        </Text>
      </View>
      <Text variant="caption" color="textSecondary" style={{ fontSize: 11 }}>
        From Perceptron (1958) to Transformer & Reasoning Agents (2026).
      </Text>

      {/* Horizontal Timeline Scroller */}
      <View style={[styles.timelineTrack, { backgroundColor: colors.surfaceAlt, borderRadius: radius.md }]}>
        {MILESTONES.map((m, idx) => {
          const isSelected = activeIdx === idx;
          return (
            <Pressable
              key={m.year}
              onPress={() => setActiveIdx(idx)}
              style={[
                styles.yearNode,
                {
                  backgroundColor: isSelected ? m.color : colors.surface,
                  borderColor: isSelected ? m.color : colors.border,
                  borderRadius: radius.pill,
                },
              ]}
            >
              <Text
                variant="caption"
                style={{
                  color: isSelected ? '#FFF' : colors.textSecondary,
                  fontWeight: isSelected ? '800' : '600',
                  fontSize: 10,
                }}
              >
                {m.year}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Active Milestone Card */}
      {active && (
        <Animated.View key={active.year} entering={FadeInDown.duration(200)}>
          <GlassCard
            elevation="sm"
            style={[styles.milestoneCard, { borderColor: active.color, borderRadius: radius.md }]}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconWrap, { backgroundColor: active.color + '22' }]}>
                <Icon name={active.icon} size={18} color={active.color} />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text variant="h3" style={{ fontSize: 15, fontWeight: '800' }}>
                    {active.title}
                  </Text>
                </View>
                <Text variant="caption" style={{ color: active.color, fontWeight: '700', fontSize: 10 }}>
                  {active.year} • {active.tag}
                </Text>
              </View>
            </View>

            <Text variant="bodyStrong" style={{ fontSize: 12, marginTop: 6 }}>
              💡 {active.impact}
            </Text>

            <Text variant="caption" color="textSecondary" style={{ fontSize: 11, lineHeight: 16, marginTop: 4 }}>
              {active.description}
            </Text>
          </GlassCard>
        </Animated.View>
      )}
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  timelineTrack: { flexDirection: 'row', padding: 6, gap: 6, justifyContent: 'space-between' },
  yearNode: { paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, alignItems: 'center' },
  milestoneCard: { padding: 12, gap: 2, borderWidth: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconWrap: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
});

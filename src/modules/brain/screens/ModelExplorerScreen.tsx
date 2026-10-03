import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { GlassCard } from '../../../components/GlassCard';
import { Text } from '../../../components/Text';
import { useTheme } from '../../../theme/ThemeProvider';

export interface AIModelSpec {
  id: string;
  name: string;
  creator: string;
  type: 'closed' | 'open' | 'reasoning';
  parameters: string;
  activeParameters?: string;
  architecture: 'MoE' | 'Dense';
  contextWindow: string;
  reasoningScore: number; // 0-100
  codingScore: number; // 0-100
  visionSupport: boolean;
  keyStrength: string;
  releaseDate: string;
  color: string;
  description: string;
}

const AI_MODELS: AIModelSpec[] = [
  {
    id: 'deepseek-r1',
    name: 'DeepSeek-R1',
    creator: 'DeepSeek AI',
    type: 'reasoning',
    parameters: '671B Total',
    activeParameters: '37B Active',
    architecture: 'MoE',
    contextWindow: '128,000 tokens',
    reasoningScore: 98,
    codingScore: 96,
    visionSupport: false,
    keyStrength: 'Reinforcement Learning CoT & Open-Weights Math',
    releaseDate: '2025',
    color: '#4F46E5',
    description: 'Pioneered pure RL training without human supervised fine-tuning, matching proprietary reasoning benchmarks at 95% lower inference cost.',
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek-V3',
    creator: 'DeepSeek AI',
    type: 'open',
    parameters: '671B Total',
    activeParameters: '37B Active',
    architecture: 'MoE',
    contextWindow: '128,000 tokens',
    reasoningScore: 94,
    codingScore: 95,
    visionSupport: false,
    keyStrength: 'Multi-head Latent Attention (MLA) & FP8 Speed',
    releaseDate: '2024',
    color: '#06B6D4',
    description: 'State-of-the-art open Mixture-of-Experts architecture utilizing MLA to compress KV cache size by 93%.',
  },
  {
    id: 'claude-35-sonnet',
    name: 'Claude 3.5 Sonnet',
    creator: 'Anthropic',
    type: 'closed',
    parameters: '~175B+ Estimated',
    architecture: 'Dense',
    contextWindow: '200,000 tokens',
    reasoningScore: 97,
    codingScore: 99,
    visionSupport: true,
    keyStrength: 'Artifact Generation, Code Debugging & Complex Analysis',
    releaseDate: '2024',
    color: '#D97706',
    description: 'Widely recognized as the premiere AI model for software engineering, nuance parsing, and structured artifact generation.',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    creator: 'OpenAI',
    type: 'closed',
    parameters: '~1.8T MoE (Est)',
    architecture: 'MoE',
    contextWindow: '128,000 tokens',
    reasoningScore: 95,
    codingScore: 94,
    visionSupport: true,
    keyStrength: 'Omni-Native Multimodal Real-Time Audio & Vision',
    releaseDate: '2024',
    color: '#10B981',
    description: 'Natively trained end-to-end across text, audio, and vision, enabling sub-300ms conversational audio responses.',
  },
  {
    id: 'gemini-15-pro',
    name: 'Gemini 1.5 Pro',
    creator: 'Google DeepMind',
    type: 'closed',
    parameters: 'MoE Architecture',
    architecture: 'MoE',
    contextWindow: '2,000,000 tokens',
    reasoningScore: 93,
    codingScore: 92,
    visionSupport: true,
    keyStrength: '2 Million Token Context Window & Multimodal Video RAG',
    releaseDate: '2024',
    color: '#8B5CF6',
    description: 'Features the largest context window in existence, processing 1 hour of video or 30,000 lines of codebase in a single prompt.',
  },
  {
    id: 'llama-33-70b',
    name: 'Llama 3.3 70B',
    creator: 'Meta AI',
    type: 'open',
    parameters: '70 Billion',
    architecture: 'Dense',
    contextWindow: '128,000 tokens',
    reasoningScore: 89,
    codingScore: 88,
    visionSupport: false,
    keyStrength: 'Open-Weights Benchmark Standard for On-Premise',
    releaseDate: '2024',
    color: '#EC4899',
    description: 'Delivers performance matching flagship closed models while allowing full local deployment and custom fine-tuning.',
  },
];

export const ModelExplorerScreen: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'reasoning' | 'open' | 'closed'>('all');
  const [selectedModel, setSelectedModel] = useState<AIModelSpec | null>(AI_MODELS[0]);

  const filteredModels = AI_MODELS.filter((m) => {
    if (selectedFilter === 'all') return true;
    return m.type === selectedFilter;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderColor: colors.border }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, { backgroundColor: colors.surfaceAlt, borderRadius: radius.sm }]}
          hitSlop={8}
        >
          <Icon name="arrow-back" size={20} color={colors.text} />
        </Pressable>
        <View style={styles.headerTitleWrap}>
          <Text variant="h3" style={{ fontSize: 16, fontWeight: '800' }}>
            AI Model Landscape & Specs
          </Text>
          <Text variant="caption" color="textSecondary" style={{ fontSize: 11 }}>
            Compare LLMs, parameters, context windows & benchmarks
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}>
        {/* Category Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {[
            { key: 'all', label: '🌐 All Frontier Models' },
            { key: 'reasoning', label: '🧠 Reasoning (CoT)' },
            { key: 'open', label: '🔓 Open Weights' },
            { key: 'closed', label: '🔒 Proprietary API' },
          ].map((tab) => {
            const active = selectedFilter === tab.key;
            return (
              <Pressable
                key={tab.key}
                onPress={() => setSelectedFilter(tab.key as any)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: active ? colors.primary : colors.surfaceAlt,
                    borderRadius: radius.pill,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  variant="caption"
                  style={{
                    color: active ? colors.onPrimary : colors.textSecondary,
                    fontWeight: active ? '700' : '600',
                  }}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Dense vs MoE Learning Banner */}
        <GlassCard elevation="sm" style={{ padding: 14, borderRadius: radius.md, gap: 6 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Icon name="hardware-chip-outline" size={18} color={colors.primary} />
            <Text variant="bodyStrong" style={{ fontSize: 13, fontWeight: '700' }}>
              Architecture Spotlight: MoE vs Dense
            </Text>
          </View>
          <Text variant="caption" color="textSecondary" style={{ fontSize: 11, lineHeight: 16 }}>
            • <Text style={{ fontWeight: '700', color: colors.text }}>Dense Models</Text>: Every single parameter activates for every token (e.g. Llama 70B uses all 70B weights per token).{'\n'}
            • <Text style={{ fontWeight: '700', color: colors.text }}>Mixture of Experts (MoE)</Text>: Uses router networks to route tokens to specialized expert sub-networks (e.g. DeepSeek-V3 routes to 37B active weights out of 671B total).
          </Text>
        </GlassCard>

        {/* Model Cards Grid */}
        <Text variant="bodyStrong" style={{ fontWeight: '800', marginTop: 4 }}>
          Frontier Models Matrix ({filteredModels.length})
        </Text>

        {filteredModels.map((model, idx) => {
          const isSelected = selectedModel?.id === model.id;
          return (
            <Animated.View key={model.id} entering={FadeInDown.delay(idx * 60).duration(300)}>
              <GlassCard
                elevation={isSelected ? 'glow' : 'sm'}
                onPress={() => setSelectedModel(isSelected ? null : model)}
                style={[
                  styles.modelCard,
                  {
                    borderColor: isSelected ? model.color : colors.border,
                    borderRadius: radius.lg,
                  },
                ]}
              >
                {/* Header */}
                <View style={styles.modelHeader}>
                  <View style={{ flex: 1, gap: 2 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <View style={[styles.dot, { backgroundColor: model.color }]} />
                      <Text variant="h3" style={{ fontSize: 16, fontWeight: '800' }}>
                        {model.name}
                      </Text>
                    </View>
                    <Text variant="caption" color="textTertiary" style={{ fontSize: 11 }}>
                      by {model.creator} • Released {model.releaseDate}
                    </Text>
                  </View>

                  <View style={[styles.badge, { backgroundColor: model.color + '22' }]}>
                    <Text variant="caption" style={{ color: model.color, fontWeight: '800', fontSize: 10 }}>
                      {model.architecture}
                    </Text>
                  </View>
                </View>

                {/* Specs Row */}
                <View style={[styles.specGrid, { backgroundColor: colors.surfaceAlt, borderRadius: radius.md }]}>
                  <View style={styles.specItem}>
                    <Text variant="caption" color="textTertiary" style={{ fontSize: 10 }}>
                      Parameters
                    </Text>
                    <Text variant="caption" style={{ fontWeight: '800', fontSize: 11, marginTop: 2 }}>
                      {model.parameters}
                    </Text>
                  </View>

                  <View style={styles.specDivider} />

                  <View style={styles.specItem}>
                    <Text variant="caption" color="textTertiary" style={{ fontSize: 10 }}>
                      Context Window
                    </Text>
                    <Text variant="caption" style={{ fontWeight: '800', fontSize: 11, marginTop: 2 }}>
                      {model.contextWindow}
                    </Text>
                  </View>

                  <View style={styles.specDivider} />

                  <View style={styles.specItem}>
                    <Text variant="caption" color="textTertiary" style={{ fontSize: 10 }}>
                      Vision
                    </Text>
                    <Text variant="caption" style={{ fontWeight: '800', fontSize: 11, marginTop: 2 }}>
                      {model.visionSupport ? '✅ Native' : '❌ Text Only'}
                    </Text>
                  </View>
                </View>

                {/* Benchmarks Bars */}
                <View style={{ gap: 6, marginTop: 4 }}>
                  <View style={styles.barRow}>
                    <Text variant="caption" color="textSecondary" style={{ fontSize: 10, width: 95 }}>
                      Reasoning (CoT):
                    </Text>
                    <View style={[styles.barTrack, { backgroundColor: colors.surfaceAlt }]}>
                      <View
                        style={[
                          styles.barFill,
                          { width: `${model.reasoningScore}%`, backgroundColor: model.color },
                        ]}
                      />
                    </View>
                    <Text variant="caption" style={{ fontSize: 10, fontWeight: '700', width: 30, textAlign: 'right' }}>
                      {model.reasoningScore}%
                    </Text>
                  </View>

                  <View style={styles.barRow}>
                    <Text variant="caption" color="textSecondary" style={{ fontSize: 10, width: 95 }}>
                      Coding & Math:
                    </Text>
                    <View style={[styles.barTrack, { backgroundColor: colors.surfaceAlt }]}>
                      <View
                        style={[
                          styles.barFill,
                          { width: `${model.codingScore}%`, backgroundColor: colors.primary },
                        ]}
                      />
                    </View>
                    <Text variant="caption" style={{ fontSize: 10, fontWeight: '700', width: 30, textAlign: 'right' }}>
                      {model.codingScore}%
                    </Text>
                  </View>
                </View>

                {/* Expanded Details */}
                {isSelected && (
                  <View style={[styles.expandedContent, { borderColor: colors.border, marginTop: 8 }]}>
                    <Text variant="caption" color="textSecondary" style={{ fontSize: 12, lineHeight: 17 }}>
                      {model.description}
                    </Text>
                    <View style={[styles.strengthChip, { backgroundColor: colors.primaryMuted }]}>
                      <Icon name="star" size={12} color={colors.primary} />
                      <Text variant="caption" style={{ color: colors.primary, fontWeight: '700', fontSize: 11, flex: 1 }}>
                        Key Power: {model.keyStrength}
                      </Text>
                    </View>
                  </View>
                )}
              </GlassCard>
            </Animated.View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    gap: 10,
  },
  backBtn: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  headerTitleWrap: { flex: 1 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1 },
  modelCard: { padding: 14, gap: 10 },
  modelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  dot: { width: 8, height: 8, borderRadius: 4 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  specGrid: { flexDirection: 'row', padding: 8, alignItems: 'center', justifyContent: 'space-around' },
  specItem: { alignItems: 'center', flex: 1 },
  specDivider: { width: 1, height: 20, backgroundColor: 'rgba(255,255,255,0.1)' },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  barTrack: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
  expandedContent: { paddingTop: 10, borderTopWidth: 1, gap: 8 },
  strengthChip: { flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 6, gap: 6 },
});

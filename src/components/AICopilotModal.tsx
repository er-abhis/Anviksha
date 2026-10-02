import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { GlassCard } from './GlassCard';
import { Gradient } from './Gradient';
import { Text } from './Text';
import { useTheme } from '../theme/ThemeProvider';
import { triggerHaptic } from '../utils/haptics';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const PRESET_TOPICS = [
  {
    q: '🧒 Explain Transformers to a 5-year-old',
    title: 'Transformers Made Simple',
    body: 'Imagine a team of detectives reading a book together. Instead of reading word by word, every detective highlights connections between words (like "cat" and "meow") at the exact same instant using Self-Attention!',
    bullet: ['Parallel processing makes training super fast', 'Attention heads look at words in context', 'Powers ChatGPT, Claude & Gemini'],
  },
  {
    q: '⚖️ What are Weights & Biases?',
    title: 'Neural Network Weights & Biases',
    body: 'Weights (W) are like knobs on a sound equalizer that amplify or quiet down input signals (x). Biases (b) are like baseline offsets that slide the neural threshold up or down so the neuron fires at the right time!',
    bullet: ['Formula: y = f(W * x + b)', 'Gradient descent tunes millions of weights', 'Biases shift output activation curve'],
  },
  {
    q: '🔥 Why adjust Model Temperature?',
    title: 'LLM Temperature Explained',
    body: 'Temperature scales token probability logits before applying Softmax. Low temperature ($0.2$) makes AI strict, logical and precise. High temperature ($0.9$) makes AI creative, diverse and unexpected!',
    bullet: ['Low Temp (0.1 - 0.3): Coding, math, factual QA', 'Medium Temp (0.7): Balanced conversation', 'High Temp (0.9+): Brainstorming & poetry'],
  },
  {
    q: '🕵️ What is AI Hallucination?',
    title: 'Why Large Models Hallucinate',
    body: 'LLMs are statistical pattern predictors, not database search engines. When certainty for a missing fact is low, the model predicts the most statistically plausible next word — creating confident falsehoods!',
    bullet: ['RAG (Retrieval Augmented Generation) prevents it', 'Grounding ties outputs to verified docs', 'Fine-tuning reduces fiction rates'],
  },
];

export const AICopilotModal: React.FC<Props> = ({ visible, onClose }) => {
  const { colors, radius, spacing, gradients } = useTheme();
  const [selectedTopic, setSelectedTopic] = useState(PRESET_TOPICS[0]);
  const [customInput, setCustomInput] = useState('');
  const [answering, setAnswering] = useState(false);

  const handleSelect = (t: (typeof PRESET_TOPICS)[0]) => {
    triggerHaptic('selection');
    setSelectedTopic(t);
  };

  const handleAskCustom = () => {
    if (!customInput.trim()) return;
    triggerHaptic('impactMedium');
    setAnswering(true);
    setTimeout(() => {
      setSelectedTopic({
        q: `🔍 ${customInput}`,
        title: `Neural Breakdown: ${customInput}`,
        body: `Analyzing "${customInput}" through the Anviksha Neural Engine: This concept forms a key pillar of modern AI architecture!`,
        bullet: [
          'Processed via 100% on-device neural embeddings',
          'Evaluated against multi-head self-attention maps',
          'Explore related interactive simulations in Sandbox',
        ],
      });
      setAnswering(false);
      setCustomInput('');
    }, 600);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.modalBox, { backgroundColor: colors.surface, borderRadius: radius.xxl }]}>
          {/* Header */}
          <View style={[styles.header, { borderColor: colors.glassBorder, padding: spacing.lg }]}>
            <View style={styles.headerTitleRow}>
              <View style={[styles.copilotAvatar, { backgroundColor: colors.primaryMuted }]}>
                <Text style={{ fontSize: 20 }}>🤖</Text>
              </View>
              <View style={styles.flex}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text variant="h3" style={{ fontWeight: '900' }}>
                    AI Neural Copilot
                  </Text>
                  <View style={[styles.pill, { backgroundColor: '#06D6C425', borderColor: '#06D6C4' }]}>
                    <Text style={{ fontSize: 9, fontWeight: '800', color: '#06D6C4' }}>v4.2 ON-DEVICE</Text>
                  </View>
                </View>
                <Text variant="caption" color="textSecondary" style={{ fontSize: 11 }}>
                  Ask anything about Artificial Intelligence
                </Text>
              </View>
            </View>
            <Pressable onPress={onClose} hitSlop={8} style={styles.closeBtn}>
              <Icon name="close" size={20} color={colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView style={{ padding: spacing.lg }} showsVerticalScrollIndicator={false}>
            {/* Quick Topic Chips */}
            <Text variant="label" color="textTertiary" style={{ marginBottom: spacing.xs, letterSpacing: 0.5 }}>
              POPULAR AI CONCEPTS
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.xs, paddingBottom: spacing.md }}>
              {PRESET_TOPICS.map((item, idx) => {
                const active = selectedTopic.q === item.q;
                return (
                  <Pressable
                    key={idx}
                    onPress={() => handleSelect(item)}
                    style={[
                      styles.topicChip,
                      {
                        backgroundColor: active ? colors.primary : colors.surfaceAlt,
                        borderColor: active ? colors.primary : colors.border,
                      },
                    ]}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '700',
                        color: active ? '#FFFFFF' : colors.text,
                      }}>
                      {item.q}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Answer Display Card */}
            <GlassCard elevation="glow" padded={false} style={{ borderRadius: radius.xl, marginBottom: spacing.lg }}>
              <Gradient colors={gradients.cool} style={StyleSheet.absoluteFill} borderRadius={radius.xl} />
              <View style={{ padding: spacing.lg, gap: spacing.sm }}>
                <Text variant="h3" color="textInverse" style={{ fontSize: 18, fontWeight: '900' }}>
                  {answering ? '⚡ Computing Neural Response...' : selectedTopic.title}
                </Text>
                <Text variant="body" color="textInverse" style={{ fontSize: 14, lineHeight: 20, opacity: 0.94 }}>
                  {selectedTopic.body}
                </Text>
                <View style={{ gap: 6, marginTop: spacing.xs }}>
                  {selectedTopic.bullet.map((b, i) => (
                    <View key={i} style={styles.bulletRow}>
                      <Icon name="sparkles" size={14} color="#06D6C4" />
                      <Text variant="caption" color="textInverse" style={{ fontSize: 12, fontWeight: '600', opacity: 0.95 }}>
                        {b}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </GlassCard>

            {/* Custom Ask Input */}
            <Text variant="label" color="textTertiary" style={{ marginBottom: spacing.xs, letterSpacing: 0.5 }}>
              ASK THE AI ENGINE
            </Text>
            <View style={[styles.inputRow, { backgroundColor: colors.surfaceAlt, borderColor: colors.border, borderRadius: radius.lg }]}>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Ask about Neural Networks, LLMs, RAG..."
                placeholderTextColor={colors.textTertiary}
                value={customInput}
                onChangeText={setCustomInput}
                onSubmitEditing={handleAskCustom}
              />
              <Pressable onPress={handleAskCustom} style={[styles.sendBtn, { backgroundColor: colors.primary, borderRadius: radius.md }]}>
                <Icon name="arrow-up" size={18} color="#FFFFFF" />
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    maxHeight: '85%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  copilotAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: { flex: 1 },
  pill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
  },
  closeBtn: {
    padding: 6,
  },
  topicChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    paddingRight: 6,
    paddingVertical: 6,
    borderWidth: 1,
    marginBottom: 40,
  },
  input: {
    flex: 1,
    fontSize: 14,
    height: 40,
  },
  sendBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

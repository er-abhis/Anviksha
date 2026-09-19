import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';
import { GlassCard } from './GlassCard';
import { RootStackParamList } from '../navigation/types';
import { SIMS } from '../modules/brain/data';
import { WORLDS } from '../content';

interface SearchResult {
  id: string;
  title: string;
  category: string;
  icon: string;
  color: string;
  onPress: () => void;
}

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<Props> = ({ visible, onClose }) => {
  const { colors, spacing, radius } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [query, setQuery] = useState('');

  if (!visible) return null;

  const q = query.trim().toLowerCase();

  // Index catalog of items
  const results: SearchResult[] = [];

  // 1. Simulations (20 Sims)
  SIMS.forEach(sim => {
    if (!q || sim.title.toLowerCase().includes(q) || sim.description.toLowerCase().includes(q) || sim.category.toLowerCase().includes(q)) {
      results.push({
        id: `sim-${sim.id}`,
        title: sim.title,
        category: `Simulation · ${sim.category}`,
        icon: 'analytics-outline',
        color: colors.primary,
        onPress: () => {
          onClose();
          navigation.navigate('BrainSim', { simId: sim.id });
        },
      });
    }
  });

  // 2. Games (10 Games)
  const gameItems = [
    { id: 'prompt', title: 'Prompt Master', cat: 'Game · Prompt Eng', icon: 'sparkles-outline', color: '#7C5CFF' },
    { id: 'stack', title: 'AI Stack Builder', cat: 'Game · Architecture', icon: 'construct-outline', color: '#06D6C4' },
    { id: 'overfit', title: 'Overfitting Defender', cat: 'Game · Model Tuning', icon: 'shield-checkmark-outline', color: '#FF5FA2' },
    { id: 'myths', title: 'AI MythBusters', cat: 'Game · Trivia', icon: 'flame-outline', color: '#F59E0B' },
    { id: 'quiz', title: 'Neuron Rush Quiz', cat: 'Game · Speed Quiz', icon: 'flash-outline', color: '#3B82F6' },
    { id: 'detective', title: 'Hallucination Detective', cat: 'Game · RAG Grounding', icon: 'search-outline', color: '#A855F7' },
    { id: 'vram', title: 'GPU VRAM Optimizer', cat: 'Game · Hardware', icon: 'hardware-chip-outline', color: '#10B981' },
    { id: 'sculptor', title: 'Neural Layer Sculptor', cat: 'Game · Deep Learning', icon: 'cube-outline', color: '#EC4899' },
    { id: 'streamer', title: 'LLM Token Decoder Engine', cat: 'Game · Decoding', icon: 'flash-outline', color: '#FACC15' },
    { id: 'vector', title: 'Vector CosSim Target', cat: 'Game · Vector Math', icon: 'navigate-outline', color: '#38BDF8' },
  ];

  gameItems.forEach(g => {
    if (!q || g.title.toLowerCase().includes(q) || g.cat.toLowerCase().includes(q)) {
      results.push({
        id: `game-${g.id}`,
        title: g.title,
        category: g.cat,
        icon: g.icon,
        color: g.color,
        onPress: () => {
          onClose();
          navigation.navigate('AIGames');
        },
      });
    }
  });

  // 3. Learning Worlds (11 Worlds)
  WORLDS.forEach(w => {
    if (!q || w.title.toLowerCase().includes(q) || w.summary.toLowerCase().includes(q)) {
      results.push({
        id: `world-${w.id}`,
        title: w.title,
        category: 'Learning World',
        icon: 'book-outline',
        color: colors.accent,
        onPress: () => {
          onClose();
          const firstLesson = w.lessons[0]?.id;
          if (firstLesson) {
            navigation.navigate('LessonIntro', { worldId: w.id, lessonId: firstLesson });
          }
        },
      });
    }
  });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
          <GlassCard elevation="glow" style={styles.card}>
            {/* Search Input Box */}
            <View style={[styles.searchBox, { backgroundColor: colors.surfaceAlt, borderRadius: radius.md, borderColor: colors.glassBorder }]}>
              <Icon name="search-outline" size={20} color={colors.primary} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search 20 Sims, 10 Games, Worlds & Concepts..."
                placeholderTextColor={colors.textTertiary}
                autoFocus
                style={[styles.input, { color: colors.text }]}
              />
              {query.length > 0 && (
                <Pressable onPress={() => setQuery('')}>
                  <Icon name="close-circle" size={18} color={colors.textTertiary} />
                </Pressable>
              )}
            </View>

            {/* Results Count Header */}
            <View style={styles.rowBetween}>
              <Text variant="caption" color="textSecondary">
                FOUND {results.length} RESULTS
              </Text>
              <Pressable onPress={onClose}>
                <Text variant="caption" color="primary" style={{ fontWeight: '700' }}>CLOSE</Text>
              </Pressable>
            </View>

            {/* Results Scroll List */}
            <ScrollView style={styles.resultsList} showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {results.map(r => (
                <Pressable
                  key={r.id}
                  onPress={r.onPress}
                  style={({ pressed }) => [
                    styles.resultRow,
                    { backgroundColor: colors.surface, borderRadius: radius.md, opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <View style={[styles.iconBox, { backgroundColor: r.color + '22', borderRadius: radius.md }]}>
                    <Icon name={r.icon} size={18} color={r.color} />
                  </View>
                  <View style={styles.flex}>
                    <Text variant="bodyStrong" color="text">{r.title}</Text>
                    <Text variant="caption" color="textSecondary">{r.category}</Text>
                  </View>
                  <Icon name="chevron-forward" size={16} color={colors.textTertiary} />
                </Pressable>
              ))}
              {results.length === 0 && (
                <View style={styles.emptyCenter}>
                  <Text variant="body" color="textSecondary">No matching simulations or games found.</Text>
                </View>
              )}
            </ScrollView>
          </GlassCard>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-start', paddingTop: 60, paddingHorizontal: 16 },
  modalContent: { width: '100%' },
  card: { gap: 12, padding: 16, maxHeight: 520 },
  searchBox: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: 46, gap: 8, borderWidth: StyleSheet.hairlineWidth },
  input: { flex: 1, fontSize: 14, paddingVertical: 0 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resultsList: { maxHeight: 400 },
  resultRow: { flexDirection: 'row', alignItems: 'center', padding: 10, gap: 10 },
  iconBox: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  emptyCenter: { padding: 24, alignItems: 'center' },
});

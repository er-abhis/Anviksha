import React, { useRef, useState } from 'react';
import { ScrollView, Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { GlassCard, Header, Screen, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { PromptMasterGame } from '../games/PromptMasterGame';
import { AIStackBuilderGame } from '../games/AIStackBuilderGame';
import { OverfittingDefenderGame } from '../games/OverfittingDefenderGame';
import { AIMythBustersGame } from '../games/AIMythBustersGame';
import { NeuronRushQuizGame } from '../games/NeuronRushQuizGame';
import { HallucinationDetectiveGame } from '../games/HallucinationDetectiveGame';
import { VRAMBudgetGame } from '../games/VRAMBudgetGame';
import { NeuralSculptorGame } from '../games/NeuralSculptorGame';
import { TokenStreamerGame } from '../games/TokenStreamerGame';
import { VectorShooterGame } from '../games/VectorShooterGame';

type GameId =
  | 'prompt'
  | 'stack'
  | 'overfit'
  | 'myths'
  | 'quiz'
  | 'detective'
  | 'vram'
  | 'sculptor'
  | 'streamer'
  | 'vector';

interface GameInfo {
  id: GameId;
  index: number;
  title: string;
  subtitle: string;
  tag: string;
  xp: string;
  icon: string;
  themeColor: string;
}

const GAMES: GameInfo[] = [
  {
    id: 'prompt',
    index: 1,
    title: 'Prompt Master',
    subtitle: 'Reverse engineer system prompts & output formats',
    tag: 'Prompt Eng',
    xp: '+50 XP',
    icon: 'sparkles-outline',
    themeColor: '#7C5CFF',
  },
  {
    id: 'stack',
    index: 2,
    title: 'AI Stack Builder',
    subtitle: 'Sequence RAG & LLM architecture layers in order',
    tag: 'Architecture',
    xp: '+60 XP',
    icon: 'construct-outline',
    themeColor: '#06D6C4',
  },
  {
    id: 'overfit',
    index: 3,
    title: 'Overfitting Defender',
    subtitle: 'Balance epochs, dropout & learning rates live',
    tag: 'Model Tuning',
    xp: '+70 XP',
    icon: 'shield-checkmark-outline',
    themeColor: '#FF5FA2',
  },
  {
    id: 'myths',
    index: 4,
    title: 'AI MythBusters',
    subtitle: 'Speed myth vs fact challenge with streak combos',
    tag: 'Trivia Blitz',
    xp: '+75 XP',
    icon: 'flame-outline',
    themeColor: '#F59E0B',
  },
  {
    id: 'quiz',
    index: 5,
    title: 'Neuron Rush Quiz',
    subtitle: '15-second timed quiz blitz for maximum points',
    tag: 'Speed Quiz',
    xp: '+80 XP',
    icon: 'flash-outline',
    themeColor: '#3B82F6',
  },
  {
    id: 'detective',
    index: 6,
    title: 'Hallucination Detective',
    subtitle: 'Spot ungrounded LLM claims against source text',
    tag: 'RAG & Safety',
    xp: '+90 XP',
    icon: 'search-outline',
    themeColor: '#A855F7',
  },
  {
    id: 'vram',
    index: 7,
    title: 'GPU VRAM Optimizer',
    subtitle: 'Fit model params & quantization without CUDA OOM',
    tag: 'Hardware Lab',
    xp: '+100 XP',
    icon: 'hardware-chip-outline',
    themeColor: '#10B981',
  },
  {
    id: 'sculptor',
    index: 8,
    title: 'Neural Layer Sculptor',
    subtitle: 'Sculpt hidden layers & activations for target tasks',
    tag: 'Deep Learning',
    xp: '+110 XP',
    icon: 'cube-outline',
    themeColor: '#EC4899',
  },
  {
    id: 'streamer',
    index: 9,
    title: 'LLM Token Decoder Engine',
    subtitle: 'Tune Temperature & Top-P sampling into the Golden Zone',
    tag: 'LLM Engine',
    xp: '+120 XP',
    icon: 'flash-outline',
    themeColor: '#FACC15',
  },
  {
    id: 'vector',
    index: 10,
    title: 'Vector CosSim Target',
    subtitle: 'Calculate high-dimensional Cosine Similarity alignment',
    tag: 'Vector Math',
    xp: '+130 XP',
    icon: 'navigate-outline',
    themeColor: '#38BDF8',
  },
];

export const AIGamesScreen: React.FC = () => {
  const { colors, spacing, radius } = useTheme();
  const navigation = useNavigation();
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const scrollRef = useRef<ScrollView>(null);

  const currentGame = GAMES[activeIdx];

  const handleSelectGame = (idx: number) => {
    setActiveIdx(idx);
    scrollRef.current?.scrollTo({ y: 350, animated: true });
  };

  const handlePrev = () => {
    if (activeIdx > 0) handleSelectGame(activeIdx - 1);
  };

  const handleNext = () => {
    if (activeIdx < GAMES.length - 1) handleSelectGame(activeIdx + 1);
  };

  // Animated dynamic theme glow style based on active game's color
  const dynamicGlowStyle = useAnimatedStyle(() => ({
    borderColor: withTiming(currentGame.themeColor, { duration: 300 }),
    backgroundColor: withTiming(currentGame.themeColor + '18', { duration: 300 }),
  }));

  return (
    <Screen ref={scrollRef} scroll contentContainerStyle={{ gap: spacing.md, paddingBottom: spacing.giant }}>
      <Header
        title="AI Arcade Games 🎮"
        subtitle="10 interactive games with live reactive UI ambiance"
        onBack={() => navigation.goBack()}
      />

      {/* Hero Badge Counter with Live Theme Shift */}
      <Animated.View
        style={[
          styles.heroBadgeRow,
          { borderRadius: radius.md, padding: 8, borderWidth: 1 },
          dynamicGlowStyle,
        ]}
      >
        <View style={[styles.countPill, { backgroundColor: currentGame.themeColor }]}>
          <Text variant="caption" color="onPrimary" style={{ fontWeight: '700', fontSize: 10 }}>
            {GAMES.length} GAMES UNLOCKED 🏆
          </Text>
        </View>
        <Text variant="caption" color="text" style={{ flex: 1, fontWeight: '600', fontSize: 11 }}>
          Vibe: <Text variant="caption" style={{ color: currentGame.themeColor, fontWeight: '700', fontSize: 11 }}>{currentGame.title}</Text>
        </Text>
      </Animated.View>

      {/* Horizontal Games Showcase Carousel */}
      <View style={{ gap: 4 }}>
        <Text variant="label" color="textSecondary" style={{ fontSize: 11 }}>
          EXPLORE ALL 10 ARCADE GAMES (SWIPE ➔):
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.carouselContainer, { gap: spacing.sm }]}
        >
          {GAMES.map((game, idx) => {
            const isActive = activeIdx === idx;
            return (
              <Pressable
                key={game.id}
                onPress={() => handleSelectGame(idx)}
                style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
              >
                <GlassCard
                  elevation={isActive ? 'glow' : 'sm'}
                  style={[
                    styles.gameCard,
                    {
                      width: 175,
                      borderRadius: radius.md,
                      borderColor: isActive ? game.themeColor : colors.glassBorder,
                      borderWidth: isActive ? 1.5 : StyleSheet.hairlineWidth,
                      backgroundColor: isActive ? colors.surfaceElevated : colors.surface,
                    },
                  ]}
                >
                  <View style={styles.cardHeader}>
                    <View style={[styles.iconBox, { backgroundColor: game.themeColor + '22', borderRadius: radius.sm }]}>
                      <Icon name={game.icon} size={18} color={game.themeColor} />
                    </View>
                    <View style={[styles.tagBadge, { backgroundColor: game.themeColor + '22' }]}>
                      <Text variant="caption" style={{ color: game.themeColor, fontSize: 9, fontWeight: '700' }}>{game.tag}</Text>
                    </View>
                  </View>

                  <Text variant="bodyStrong" color="text" numberOfLines={1} style={{ marginTop: 6, fontSize: 13 }}>
                    {game.index}. {game.title}
                  </Text>
                  <Text variant="caption" color="textSecondary" numberOfLines={2} style={{ height: 26, marginTop: 1, fontSize: 11, lineHeight: 13 }}>
                    {game.subtitle}
                  </Text>

                  <View style={[styles.cardFooter, { marginTop: 6 }]}>
                    <Text variant="caption" style={{ color: game.themeColor, fontWeight: '700', fontSize: 11 }}>
                      {game.xp}
                    </Text>
                    <View style={[styles.playBtnPill, { backgroundColor: isActive ? game.themeColor : colors.surfaceAlt }]}>
                      <Text variant="caption" style={{ color: isActive ? colors.onPrimary : colors.text, fontWeight: '700', fontSize: 10 }}>
                        {isActive ? 'Playing ▶' : 'Play'}
                      </Text>
                    </View>
                  </View>
                </GlassCard>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Active Game Arena Control Banner */}
      <Animated.View
        style={[
          styles.arenaHeader,
          { borderRadius: radius.md, padding: 8, borderWidth: 1 },
          dynamicGlowStyle,
        ]}
      >
        <Pressable
          disabled={activeIdx === 0}
          onPress={handlePrev}
          style={[styles.navArrowBtn, { opacity: activeIdx === 0 ? 0.3 : 1 }]}
        >
          <Icon name="chevron-back" size={18} color={colors.text} />
        </Pressable>

        <View style={styles.arenaTitleBox}>
          <Text variant="caption" style={{ color: currentGame.themeColor, fontWeight: '700', fontSize: 10 }} center>
            PLAYING GAME {currentGame.index} OF {GAMES.length}
          </Text>
          <Text variant="bodyStrong" color="text" center style={{ fontSize: 14 }}>
            {currentGame.title}
          </Text>
        </View>

        <Pressable
          disabled={activeIdx === GAMES.length - 1}
          onPress={handleNext}
          style={[styles.navArrowBtn, { opacity: activeIdx === GAMES.length - 1 ? 0.3 : 1 }]}
        >
          <Icon name="chevron-forward" size={18} color={colors.text} />
        </Pressable>
      </Animated.View>

      {/* Render Active Game */}
      <View key={currentGame.id}>
        {currentGame.id === 'prompt' && <PromptMasterGame />}
        {currentGame.id === 'stack' && <AIStackBuilderGame />}
        {currentGame.id === 'overfit' && <OverfittingDefenderGame />}
        {currentGame.id === 'myths' && <AIMythBustersGame />}
        {currentGame.id === 'quiz' && <NeuronRushQuizGame />}
        {currentGame.id === 'detective' && <HallucinationDetectiveGame />}
        {currentGame.id === 'vram' && <VRAMBudgetGame />}
        {currentGame.id === 'sculptor' && <NeuralSculptorGame />}
        {currentGame.id === 'streamer' && <TokenStreamerGame />}
        {currentGame.id === 'vector' && <VectorShooterGame />}
      </View>

      {/* Bottom 10-Game Switcher Dots */}
      <View style={[styles.bottomSwitchRow, { gap: 4 }]}>
        {GAMES.map((g, idx) => {
          const isActive = activeIdx === idx;
          return (
            <Pressable
              key={g.id}
              onPress={() => handleSelectGame(idx)}
              style={[
                styles.bottomDotBtn,
                {
                  backgroundColor: isActive ? g.themeColor : colors.surfaceAlt,
                  borderRadius: radius.pill,
                  paddingHorizontal: isActive ? 8 : 5,
                },
              ]}
            >
              <Text variant="caption" style={{ color: isActive ? colors.onPrimary : colors.textSecondary, fontSize: 10, fontWeight: '700' }}>
                {g.index}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  heroBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  countPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  carouselContainer: { paddingVertical: 2 },
  gameCard: { padding: 10, gap: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconBox: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  tagBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 999 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  playBtnPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  arenaHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  arenaTitleBox: { flex: 1, alignItems: 'center' },
  navArrowBtn: { padding: 6 },
  bottomSwitchRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', marginTop: 4 },
  bottomDotBtn: { paddingVertical: 4, alignItems: 'center', justifyContent: 'center' },
});

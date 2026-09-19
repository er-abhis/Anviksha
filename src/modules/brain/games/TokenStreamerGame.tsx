import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, GlassCard, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { useProgressStore } from '../../../store';

interface SamplingZone {
  temp: number;
  topP: number;
  outputPreview: string;
  status: 'REPETITIVE' | 'GOLDEN' | 'GIBBERISH';
  description: string;
}

export const TokenStreamerGame: React.FC = () => {
  const { colors, spacing, radius } = useTheme();
  const [temp, setTemp] = useState<number>(0.7);
  const [topP, setTopP] = useState<number>(0.9);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const addXp = useProgressStore(s => s.addXp);

  // Evaluate generation quality based on hyperparameter space
  let status: 'REPETITIVE' | 'GOLDEN' | 'GIBBERISH' = 'GOLDEN';
  let preview = 'The astronaut peered through the observation port as the aurora danced above Earth.';
  let description = 'Perfect balance! Temperature 0.7 + Top-P 0.9 yields creative, coherent token sampling.';

  if (temp <= 0.2) {
    status = 'REPETITIVE';
    preview = 'The astronaut saw the planet and the planet was blue and the planet was blue and the planet...';
    description = 'Repetitive loop! Low temperature causes greedy sampling to get trapped in token loops.';
  } else if (temp >= 1.2) {
    status = 'GIBBERISH';
    preview = 'The astronaut hyper-jumped banana sideways velocity orbital purple quantum waffle...';
    description = 'Hallucinatory gibberish! High temperature flattens token logits into noisy random choices.';
  }

  const isGolden = status === 'GOLDEN';

  const handleGenerate = () => {
    setSubmitted(true);
    if (isGolden) {
      setScore(s => s + 100);
    }
  };

  const handleFinish = () => {
    setCompleted(true);
    addXp(120);
  };

  const resetGame = () => {
    setTemp(0.7);
    setTopP(0.9);
    setSubmitted(false);
    setScore(0);
    setCompleted(false);
  };

  if (completed) {
    return (
      <GlassCard elevation="glow" style={styles.card}>
        <View style={styles.centerCol}>
          <Text style={styles.bigEmoji}>⚡</Text>
          <Text variant="h2" color="primary" style={{ marginTop: 8 }}>LLM Decoder Master!</Text>
          <Text variant="body" color="textSecondary" style={{ textAlign: 'center', marginTop: 4 }}>
            Successfully decoded token streams in the Golden Sampling Zone! Score: {score} pts. Earned +120 XP.
          </Text>
          <Button label="Stream Again ⚡" onPress={resetGame} style={{ marginTop: spacing.lg }} />
        </View>
      </GlassCard>
    );
  }

  return (
    <GlassCard elevation="md" style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: colors.accentMuted, borderRadius: radius.md }]}>
          <Icon name="flash-outline" size={24} color={colors.accent} />
        </View>
        <View style={styles.flex}>
          <Text variant="bodyStrong">Game 9: LLM Token Decoder Engine ⚡</Text>
          <Text variant="caption" color="textSecondary">
            Tune Temperature & Top-P into the Golden Zone to generate coherent prose!
          </Text>
        </View>
      </View>

      {/* Sampling Controls */}
      <Text variant="label" color="text">1. Sampling Temperature (Current: {temp.toFixed(1)}):</Text>
      <View style={styles.optRow}>
        {[0.1, 0.7, 1.4].map(t => (
          <Pressable
            key={t}
            disabled={submitted}
            onPress={() => setTemp(t)}
            style={[
              styles.optBtn,
              {
                backgroundColor: temp === t ? colors.primary : colors.surfaceAlt,
                borderRadius: radius.md,
              },
            ]}
          >
            <Text variant="bodyStrong" style={{ color: temp === t ? colors.onPrimary : colors.text }}>
              {t === 0.1 ? '0.1 (Strict)' : t === 0.7 ? '0.7 (Golden)' : '1.4 (Wild)'}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text variant="label" color="text">2. Nucleus Top-P Cutoff (Current: {topP.toFixed(1)}):</Text>
      <View style={styles.optRow}>
        {[0.5, 0.9, 1.0].map(p => (
          <Pressable
            key={p}
            disabled={submitted}
            onPress={() => setTopP(p)}
            style={[
              styles.optBtn,
              {
                backgroundColor: topP === p ? colors.primary : colors.surfaceAlt,
                borderRadius: radius.md,
              },
            ]}
          >
            <Text variant="bodyStrong" style={{ color: topP === p ? colors.onPrimary : colors.text }}>
              {p} Top-P
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Live Stream Generation Box */}
      <View style={[styles.streamBox, { backgroundColor: colors.surface, borderRadius: radius.md }]}>
        <View style={styles.rowBetween}>
          <Text variant="caption" color="textSecondary">GENERATED TOKEN STREAM:</Text>
          <View style={[styles.statusTag, { backgroundColor: isGolden ? colors.success + '22' : colors.warning + '22' }]}>
            <Text variant="caption" color={isGolden ? 'success' : 'warning'}>
              {status}
            </Text>
          </View>
        </View>
        <Text variant="body" color="text" style={styles.monoText}>
          "{preview}"
        </Text>
      </View>

      {!submitted ? (
        <Button label="Stream Token Sequence 🚀" onPress={handleGenerate} />
      ) : (
        <View style={[styles.resultBox, { backgroundColor: isGolden ? colors.success + '22' : colors.warning + '22', borderRadius: radius.md }]}>
          <Text variant="bodyStrong" color={isGolden ? 'success' : 'warning'}>
            {isGolden ? '🎯 Golden Sampling Zone Hit!' : '❌ Suboptimal Generation!'}
          </Text>
          <Text variant="caption" color="textSecondary" style={{ marginTop: 4 }}>
            {description}
          </Text>
          <Button label="Finish Decoder Challenge ➔" size="sm" onPress={handleFinish} style={{ marginTop: 8 }} />
        </View>
      )}
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  card: { gap: 12, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  optRow: { flexDirection: 'row', gap: 6 },
  optBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 10 },
  streamBox: { padding: 12, gap: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  monoText: { fontFamily: 'PlatformFont', fontSize: 13, lineHeight: 18, fontStyle: 'italic' },
  resultBox: { padding: 12 },
  centerCol: { alignItems: 'center', padding: 16 },
  bigEmoji: { fontSize: 50 },
});

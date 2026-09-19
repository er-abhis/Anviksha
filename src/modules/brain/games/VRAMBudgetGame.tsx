import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, GlassCard, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { useProgressStore } from '../../../store';

interface Scenario {
  id: number;
  gpuName: string;
  vramLimitGB: number;
  modelParamsBillion: number;
  targetContext: number; // e.g. 8192 tokens
}

const SCENARIOS: Scenario[] = [
  { id: 1, gpuName: 'NVIDIA RTX 4090 (24GB)', vramLimitGB: 24, modelParamsBillion: 13, targetContext: 8192 },
  { id: 2, gpuName: 'Consumer GPU (16GB)', vramLimitGB: 16, modelParamsBillion: 7, targetContext: 16384 },
  { id: 3, gpuName: 'Cloud Instance (40GB A100)', vramLimitGB: 40, modelParamsBillion: 70, targetContext: 4096 },
];

export const VRAMBudgetGame: React.FC = () => {
  const { colors, spacing, radius } = useTheme();
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [quant, setQuant] = useState<'FP16' | 'INT8' | 'INT4'>('FP16');
  const [context, setContext] = useState<2048 | 8192 | 16384>(2048);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const addXp = useProgressStore(s => s.addXp);
  const scenario = SCENARIOS[scenarioIdx];

  // Calculate VRAM required
  // Weights VRAM: FP16 = 2 bytes/param, INT8 = 1 byte/param, INT4 = 0.5 bytes/param
  const bytesPerParam = quant === 'FP16' ? 2 : quant === 'INT8' ? 1 : 0.5;
  const weightsGB = scenario.modelParamsBillion * bytesPerParam;
  const kvCacheGB = (context / 1024) * 0.5; // Rough estimate 0.5GB per 1k tokens for KV cache
  const overheadGB = 1.5; // CUDA context overhead
  const totalVRAM = Math.round((weightsGB + kvCacheGB + overheadGB) * 10) / 10;
  const isOOM = totalVRAM > scenario.vramLimitGB;

  const handleSubmit = () => {
    setSubmitted(true);
    if (!isOOM) {
      setScore(s => s + 100);
    }
  };

  const handleNext = () => {
    if (scenarioIdx + 1 < SCENARIOS.length) {
      setScenarioIdx(s => s + 1);
      setSubmitted(false);
      setQuant('FP16');
      setContext(2048);
    } else {
      setCompleted(true);
      addXp(100);
    }
  };

  const resetGame = () => {
    setScenarioIdx(0);
    setSubmitted(false);
    setQuant('FP16');
    setContext(2048);
    setScore(0);
    setCompleted(false);
  };

  if (completed) {
    return (
      <GlassCard elevation="glow" style={styles.card}>
        <View style={styles.centerCol}>
          <Text style={styles.bigEmoji}>💻</Text>
          <Text variant="h2" color="primary" style={{ marginTop: 8 }}>VRAM Architect Master!</Text>
          <Text variant="body" color="textSecondary" style={{ textAlign: 'center', marginTop: 4 }}>
            Successfully fitted all LLM architectures without CUDA OOM! Final Score: {score} pts. Earned +100 XP.
          </Text>
          <Button label="Optimize Again ⚡" onPress={resetGame} style={{ marginTop: spacing.lg }} />
        </View>
      </GlassCard>
    );
  }

  return (
    <GlassCard elevation="md" style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: colors.primaryMuted, borderRadius: radius.md }]}>
          <Icon name="hardware-chip-outline" size={24} color={colors.primary} />
        </View>
        <View style={styles.flex}>
          <Text variant="bodyStrong">Game 7: GPU VRAM Optimizer 💾</Text>
          <Text variant="caption" color="textSecondary">
            Fit the {scenario.modelParamsBillion}B model into {scenario.gpuName}! Scenario {scenarioIdx + 1}/{SCENARIOS.length}
          </Text>
        </View>
      </View>

      {/* Target Specs */}
      <View style={[styles.specBox, { backgroundColor: colors.surface, borderRadius: radius.md }]}>
        <View style={styles.rowBetween}>
          <Text variant="caption" color="textSecondary">Target GPU Limit:</Text>
          <Text variant="bodyStrong" color="primary">{scenario.vramLimitGB} GB VRAM</Text>
        </View>
        <View style={styles.rowBetween}>
          <Text variant="caption" color="textSecondary">Model Size:</Text>
          <Text variant="bodyStrong" color="text">{scenario.modelParamsBillion} Billion Parameters</Text>
        </View>
      </View>

      {/* Config Controls */}
      <Text variant="label" color="text">1. Select Quantization Precision:</Text>
      <View style={styles.optRow}>
        {(['FP16', 'INT8', 'INT4'] as const).map(q => (
          <Pressable
            key={q}
            disabled={submitted}
            onPress={() => setQuant(q)}
            style={[
              styles.optBtn,
              {
                backgroundColor: quant === q ? colors.primary : colors.surfaceAlt,
                borderRadius: radius.md,
              },
            ]}
          >
            <Text variant="bodyStrong" style={{ color: quant === q ? colors.onPrimary : colors.text }}>
              {q}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text variant="label" color="text">2. Select Target Context Window:</Text>
      <View style={styles.optRow}>
        {([2048, 8192, 16384] as const).map(c => (
          <Pressable
            key={c}
            disabled={submitted}
            onPress={() => setContext(c)}
            style={[
              styles.optBtn,
              {
                backgroundColor: context === c ? colors.primary : colors.surfaceAlt,
                borderRadius: radius.md,
              },
            ]}
          >
            <Text variant="bodyStrong" style={{ color: context === c ? colors.onPrimary : colors.text }}>
              {c / 1024}k Tokens
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Live Meter */}
      <View style={[styles.meterBox, { backgroundColor: colors.surface, borderRadius: radius.md }]}>
        <View style={styles.rowBetween}>
          <Text variant="label" color="text">Calculated VRAM Usage:</Text>
          <Text variant="h3" color={isOOM ? 'error' : 'success'}>
            {totalVRAM} / {scenario.vramLimitGB} GB
          </Text>
        </View>
        <View style={[styles.meterBarBg, { backgroundColor: colors.surfaceAlt, borderRadius: radius.pill }]}>
          <View
            style={[
              styles.meterBarFill,
              {
                width: `${Math.min(100, (totalVRAM / scenario.vramLimitGB) * 100)}%`,
                backgroundColor: isOOM ? colors.error : colors.success,
                borderRadius: radius.pill,
              },
            ]}
          />
        </View>
      </View>

      {!submitted ? (
        <Button label="Deploy Configuration 🚀" onPress={handleSubmit} />
      ) : (
        <View style={[styles.resultBox, { backgroundColor: isOOM ? colors.error + '22' : colors.success + '22', borderRadius: radius.md }]}>
          <Text variant="bodyStrong" color={isOOM ? 'error' : 'success'}>
            {isOOM ? '💥 CUDA Out Of Memory (OOM) Error!' : '🎉 Deployment Successful! Model Running smoothly!'}
          </Text>
          <Text variant="caption" color="textSecondary" style={{ marginTop: 4 }}>
            {isOOM
              ? 'Model weights + KV cache exceeded GPU capacity. Try INT4 or reducing context window.'
              : `Successfully allocated ${totalVRAM} GB (${Math.round((totalVRAM / scenario.vramLimitGB) * 100)}% GPU utilization).`}
          </Text>
          <Button label="Next Scenario ➔" size="sm" onPress={handleNext} style={{ marginTop: 8 }} />
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
  specBox: { padding: 12, gap: 6 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  optRow: { flexDirection: 'row', gap: 8 },
  optBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 10 },
  meterBox: { padding: 12, gap: 8 },
  meterBarBg: { height: 10, width: '100%', overflow: 'hidden' },
  meterBarFill: { height: '100%' },
  resultBox: { padding: 12 },
  centerCol: { alignItems: 'center', padding: 16 },
  bigEmoji: { fontSize: 50 },
});

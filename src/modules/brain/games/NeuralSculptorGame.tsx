import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, GlassCard, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { useProgressStore } from '../../../store';

interface TaskScenario {
  id: number;
  taskName: string;
  difficulty: string;
  targetAccuracy: number;
  description: string;
  hint: string;
}

const SCENARIOS: TaskScenario[] = [
  {
    id: 1,
    taskName: 'MNIST Handwritten Digits',
    difficulty: 'Easy',
    targetAccuracy: 95,
    description: 'Classify 28x28 grayscale images of handwritten digits (0-9).',
    hint: 'Requires 2 hidden layers with at least 64 neurons and GELU/ReLU activation.',
  },
  {
    id: 2,
    taskName: 'CIFAR-10 Object Recognition',
    difficulty: 'Medium',
    targetAccuracy: 88,
    description: 'Classify 32x32 color images across 10 natural categories (airplanes, cats, cars).',
    hint: 'Requires 3 hidden layers with 128+ neurons and Swish/GELU activation.',
  },
  {
    id: 3,
    taskName: 'Complex Medical MRI Segmentation',
    difficulty: 'Hard',
    targetAccuracy: 92,
    description: 'Segment multi-spectral brain MRI scans into tumor tissue regions.',
    hint: 'Requires 4 deep hidden layers with 256 neurons for high feature resolution.',
  },
];

export const NeuralSculptorGame: React.FC = () => {
  const { colors, spacing, radius } = useTheme();
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [layers, setLayers] = useState<number>(2);
  const [neurons, setNeurons] = useState<64 | 128 | 256>(64);
  const [activation, setActivation] = useState<'ReLU' | 'GELU' | 'Sigmoid' | 'Swish'>('GELU');
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const addXp = useProgressStore(s => s.addXp);
  const scenario = SCENARIOS[scenarioIdx];

  // Calculate live capacity & estimated accuracy
  let computedAccuracy = 50 + layers * 10 + (neurons / 64) * 8;
  if (activation === 'GELU' || activation === 'Swish') computedAccuracy += 8;
  if (activation === 'Sigmoid') computedAccuracy -= 12; // Vanishing gradient penalty
  if (layers > 3 && neurons === 64) computedAccuracy -= 10; // Bottleneck penalty
  computedAccuracy = Math.min(99, Math.max(35, Math.round(computedAccuracy)));

  const isSuccess = computedAccuracy >= scenario.targetAccuracy;

  const handleDeploy = () => {
    setSubmitted(true);
    if (isSuccess) {
      setScore(s => s + 100);
    }
  };

  const handleNext = () => {
    if (scenarioIdx + 1 < SCENARIOS.length) {
      setScenarioIdx(s => s + 1);
      setSubmitted(false);
      setLayers(2);
      setNeurons(64);
      setActivation('GELU');
    } else {
      setCompleted(true);
      addXp(110);
    }
  };

  const resetGame = () => {
    setScenarioIdx(0);
    setSubmitted(false);
    setLayers(2);
    setNeurons(64);
    setActivation('GELU');
    setScore(0);
    setCompleted(false);
  };

  if (completed) {
    return (
      <GlassCard elevation="glow" style={styles.card}>
        <View style={styles.centerCol}>
          <Text style={styles.bigEmoji}>🧠</Text>
          <Text variant="h2" color="primary" style={{ marginTop: 8 }}>Neural Architect Master!</Text>
          <Text variant="body" color="textSecondary" style={{ textAlign: 'center', marginTop: 4 }}>
            Successfully sculpted architectures for all deep learning tasks! Final Score: {score} pts. Earned +110 XP.
          </Text>
          <Button label="Sculpt Again 🎨" onPress={resetGame} style={{ marginTop: spacing.lg }} />
        </View>
      </GlassCard>
    );
  }

  return (
    <GlassCard elevation="md" style={[styles.card, { borderColor: isSuccess && submitted ? colors.success : colors.glassBorder }]}>
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: colors.primaryMuted, borderRadius: radius.md }]}>
          <Icon name="cube-outline" size={24} color={colors.primary} />
        </View>
        <View style={styles.flex}>
          <Text variant="bodyStrong">Game 8: Neural Layer Sculptor 🧠</Text>
          <Text variant="caption" color="textSecondary">
            Sculpt neural network layers to hit target model accuracy! {scenarioIdx + 1}/{SCENARIOS.length}
          </Text>
        </View>
      </View>

      {/* Task Requirement Card */}
      <View style={[styles.taskBox, { backgroundColor: colors.surface, borderRadius: radius.md }]}>
        <View style={styles.rowBetween}>
          <Text variant="label" color="primary">{scenario.taskName}</Text>
          <View style={[styles.badge, { backgroundColor: colors.accentMuted }]}>
            <Text variant="caption" color="accent">{scenario.difficulty}</Text>
          </View>
        </View>
        <Text variant="caption" color="textSecondary" style={{ marginTop: 4 }}>
          {scenario.description}
        </Text>
        <View style={[styles.targetRow, { marginTop: 6 }]}>
          <Text variant="caption" color="textSecondary">Target Accuracy Goal:</Text>
          <Text variant="bodyStrong" color="accent">≥ {scenario.targetAccuracy}%</Text>
        </View>
      </View>

      {/* Layer Sculpting Controls */}
      <Text variant="label" color="text">1. Number of Hidden Layers ({layers}):</Text>
      <View style={styles.optRow}>
        {[1, 2, 3, 4].map(l => (
          <Pressable
            key={l}
            disabled={submitted}
            onPress={() => setLayers(l)}
            style={[
              styles.optBtn,
              {
                backgroundColor: layers === l ? colors.primary : colors.surfaceAlt,
                borderRadius: radius.md,
              },
            ]}
          >
            <Text variant="bodyStrong" style={{ color: layers === l ? colors.onPrimary : colors.text }}>
              {l} {l === 1 ? 'Layer' : 'Layers'}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text variant="label" color="text">2. Neurons per Hidden Layer ({neurons}):</Text>
      <View style={styles.optRow}>
        {([64, 128, 256] as const).map(n => (
          <Pressable
            key={n}
            disabled={submitted}
            onPress={() => setNeurons(n)}
            style={[
              styles.optBtn,
              {
                backgroundColor: neurons === n ? colors.primary : colors.surfaceAlt,
                borderRadius: radius.md,
              },
            ]}
          >
            <Text variant="bodyStrong" style={{ color: neurons === n ? colors.onPrimary : colors.text }}>
              {n} Nodes
            </Text>
          </Pressable>
        ))}
      </View>

      <Text variant="label" color="text">3. Non-Linear Activation Function:</Text>
      <View style={styles.optRow}>
        {(['ReLU', 'GELU', 'Swish', 'Sigmoid'] as const).map(a => (
          <Pressable
            key={a}
            disabled={submitted}
            onPress={() => setActivation(a)}
            style={[
              styles.optBtn,
              {
                backgroundColor: activation === a ? colors.primary : colors.surfaceAlt,
                borderRadius: radius.md,
              },
            ]}
          >
            <Text variant="bodyStrong" style={{ color: activation === a ? colors.onPrimary : colors.text }}>
              {a}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Live Neural Diagram Visualizer */}
      <View style={[styles.visualBox, { backgroundColor: colors.surface, borderRadius: radius.md }]}>
        <Text variant="caption" color="textSecondary">LIVE NEURAL ACTIVATION MATRIX</Text>
        <View style={styles.matrixRow}>
          {Array.from({ length: layers }).map((_, li) => (
            <View key={li} style={styles.layerCol}>
              {Array.from({ length: Math.min(5, Math.ceil(neurons / 32)) }).map((_, ni) => (
                <View
                  key={ni}
                  style={[
                    styles.neuronDot,
                    {
                      backgroundColor: computedAccuracy >= scenario.targetAccuracy ? colors.accent : colors.primary,
                      borderRadius: radius.pill,
                    },
                  ]}
                />
              ))}
            </View>
          ))}
        </View>

        <View style={styles.rowBetween}>
          <Text variant="caption" color="textSecondary">Model Output Accuracy:</Text>
          <Text variant="h3" color={computedAccuracy >= scenario.targetAccuracy ? 'success' : 'warning'}>
            {computedAccuracy}%
          </Text>
        </View>
      </View>

      {!submitted ? (
        <Button label="Train & Evaluate Model ⚡" onPress={handleDeploy} />
      ) : (
        <View style={[styles.resultBox, { backgroundColor: isSuccess ? colors.success + '22' : colors.warning + '22', borderRadius: radius.md }]}>
          <Text variant="bodyStrong" color={isSuccess ? 'success' : 'warning'}>
            {isSuccess ? '🎉 Target Accuracy Achieved!' : '⚠️ Model Accuracy Below Target!'}
          </Text>
          <Text variant="caption" color="textSecondary" style={{ marginTop: 4 }}>
            {isSuccess
              ? `Your sculpted architecture (${layers} layers x ${neurons} neurons, ${activation}) achieved ${computedAccuracy}% validation accuracy.`
              : `Achieved ${computedAccuracy}%, but goal is ${scenario.targetAccuracy}%. ${scenario.hint}`}
          </Text>
          <Button label="Next Task ➔" size="sm" onPress={handleNext} style={{ marginTop: 8 }} />
        </View>
      )}
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  card: { gap: 12, padding: 16, borderWidth: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  taskBox: { padding: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  targetRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  optRow: { flexDirection: 'row', gap: 6 },
  optBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 10 },
  visualBox: { padding: 12, gap: 8 },
  matrixRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 8 },
  layerCol: { gap: 4, alignItems: 'center' },
  neuronDot: { width: 10, height: 10 },
  resultBox: { padding: 12 },
  centerCol: { alignItems: 'center', padding: 16 },
  bigEmoji: { fontSize: 50 },
});

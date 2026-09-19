import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, GlassCard, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { useProgressStore } from '../../../store';

const REQUIRED_LAYERS = ['Token Embedding', 'Positional Encoding', 'Self-Attention', 'Feed Forward', 'Softmax Classifier'];
const ALL_LAYERS = ['Softmax Classifier', 'Self-Attention', 'Token Embedding', 'Convolution 3x3', 'Feed Forward', 'Positional Encoding', 'Max Pooling'];

export const AIStackBuilderGame: React.FC = () => {
  const { colors, spacing, radius } = useTheme();
  const [userStack, setUserStack] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const addXp = useProgressStore(s => s.addXp);

  const addLayer = (layer: string) => {
    if (userStack.length < 5 && !userStack.includes(layer)) {
      const next = [...userStack, layer];
      setUserStack(next);
      if (next.length === 5) {
        // Check exact sequence
        const isCorrect = next.every((val, idx) => val === REQUIRED_LAYERS[idx]);
        if (isCorrect) {
          setCompleted(true);
          addXp(60);
        }
      }
    }
  };

  const removeLayer = (idx: number) => {
    setUserStack(prev => prev.filter((_, i) => i !== idx));
  };

  const resetStack = () => {
    setUserStack([]);
    setCompleted(false);
  };

  return (
    <GlassCard elevation="md" style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: colors.primaryMuted, borderRadius: radius.md }]}>
          <Icon name="construct-outline" size={24} color={colors.primary} />
        </View>
        <View style={styles.flex}>
          <Text variant="bodyStrong">Game 2: Transformer Stack Builder 🏗️</Text>
          <Text variant="caption" color="textSecondary">
            Assemble the 5 core layer blocks of a Transformer model in exact order!
          </Text>
        </View>
      </View>

      {/* Stack Blueprint Target */}
      <View style={[styles.stackBox, { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md }]}>
        <Text variant="label" color="textSecondary">YOUR ARCHITECTURE PIPELINE ({userStack.length}/5):</Text>
        {userStack.length === 0 ? (
          <Text variant="caption" color="textTertiary" style={{ paddingVertical: 12 }}>
            Tap layer blocks below to build your model pipeline...
          </Text>
        ) : (
          <View style={{ gap: 6 }}>
            {userStack.map((layer, idx) => (
              <Pressable
                key={layer}
                onPress={() => removeLayer(idx)}
                style={[
                  styles.layerPill,
                  {
                    backgroundColor: layer === REQUIRED_LAYERS[idx] ? colors.success + '22' : colors.warning + '22',
                    borderColor: layer === REQUIRED_LAYERS[idx] ? colors.success : colors.warning,
                    borderRadius: radius.md,
                  },
                ]}
              >
                <Text variant="label" color="textSecondary">Layer {idx + 1}</Text>
                <Text variant="bodyStrong" style={styles.flex}>{layer}</Text>
                <Icon name="close-circle-outline" size={18} color={colors.textSecondary} />
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* Available Layer Pool */}
      <View style={{ gap: 8 }}>
        <Text variant="label" color="textSecondary">AVAILABLE ARCHITECTURE BLOCKS:</Text>
        <View style={styles.poolGrid}>
          {ALL_LAYERS.map(l => {
            const added = userStack.includes(l);
            return (
              <Pressable
                key={l}
                disabled={added}
                onPress={() => addLayer(l)}
                style={[
                  styles.blockBtn,
                  {
                    backgroundColor: added ? colors.surfaceAlt + '66' : colors.surfaceAlt,
                    borderRadius: radius.md,
                    opacity: added ? 0.4 : 1,
                  },
                ]}
              >
                <Text variant="caption" color={added ? 'textTertiary' : 'text'}>{l}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {completed && (
        <View style={[styles.winBox, { backgroundColor: colors.success + '22', borderRadius: radius.md }]}>
          <Text variant="bodyStrong" color="success">🎉 Perfect Transformer Pipeline Built! +60 XP</Text>
          <Button label="Build Again 🔄" size="sm" onPress={resetStack} style={{ marginTop: 8 }} />
        </View>
      )}

      {userStack.length === 5 && !completed && (
        <View style={[styles.winBox, { backgroundColor: colors.warning + '22', borderRadius: radius.md }]}>
          <Text variant="bodyStrong" color="warning">⚠️ Sequence order incorrect! Tap a layer to remove & retry.</Text>
          <Button label="Reset Pipeline 🔄" size="sm" onPress={resetStack} style={{ marginTop: 8 }} />
        </View>
      )}
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  card: { gap: 14, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  stackBox: { gap: 8 },
  layerPill: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderWidth: StyleSheet.hairlineWidth },
  poolGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  blockBtn: { paddingHorizontal: 12, paddingVertical: 8 },
  winBox: { padding: 12, alignItems: 'center' },
});

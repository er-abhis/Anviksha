import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { GlassCard, Gradient, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { triggerHaptic } from '../../../utils/haptics';

interface Props {
  onOpenFullSim: () => void;
}

export const LiveNeuralWidget: React.FC<Props> = ({ onOpenFullSim }) => {
  const { colors, radius, spacing, gradients } = useTheme();
  const [activeTab, setActiveTab] = useState<'attention' | 'temperature' | 'embedding'>('attention');
  const [paramVal, setParamVal] = useState<number>(0.7);
  const [activeNode, setActiveNode] = useState<number>(1);

  // Compute dynamic neural activation outputs based on interactive state
  const prob1 = Math.min(99, Math.round(activeNode * 30 + paramVal * 25));
  const prob2 = Math.max(1, 100 - prob1);

  const handleNodeClick = (nodeIdx: number) => {
    triggerHaptic('selection');
    setActiveNode(nodeIdx);
  };

  const handleTabChange = (tab: 'attention' | 'temperature' | 'embedding') => {
    triggerHaptic('selection');
    setActiveTab(tab);
  };

  return (
    <GlassCard elevation="glow" padded={false} style={styles.card}>
      <Gradient colors={gradients.cool} style={StyleSheet.absoluteFill} borderRadius={radius.xl} />
      
      <View style={{ padding: spacing.lg, gap: spacing.md }}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.iconWrap}>
            <Text style={{ fontSize: 20 }}>🧠</Text>
          </View>
          <View style={styles.flex}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text variant="bodyStrong" color="textInverse" style={{ fontSize: 16, fontWeight: '900' }}>
                LIVE AI NEURAL CORE
              </Text>
              <View style={styles.liveTag}>
                <View style={styles.pulseDot} />
                <Text style={{ fontSize: 9, fontWeight: '900', color: '#06D6C4' }}>LIVE MODEL</Text>
              </View>
            </View>
            <Text variant="caption" color="textInverse" style={{ opacity: 0.9, fontSize: 11 }}>
              Tap neural nodes to simulate live attention weights & LLM token probabilities
            </Text>
          </View>
        </View>

        {/* Interactive Mode Pills */}
        <View style={styles.tabsRow}>
          {[
            { key: 'attention', label: '⚡ Self-Attention', icon: 'sparkles' },
            { key: 'temperature', label: '🔥 Temperature', icon: 'flame' },
            { key: 'embedding', label: '🎯 Embeddings', icon: 'pin' },
          ].map(t => {
            const active = activeTab === t.key;
            return (
              <Pressable
                key={t.key}
                onPress={() => handleTabChange(t.key as any)}
                style={[
                  styles.tabBtn,
                  {
                    backgroundColor: active ? '#FFFFFF' : 'rgba(255,255,255,0.18)',
                  },
                ]}
              >
                <Text
                  variant="caption"
                  style={{
                    color: active ? colors.primary : '#FFFFFF',
                    fontWeight: active ? '900' : '600',
                    fontSize: 11,
                  }}
                >
                  {t.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Visual Neural Activation Graph */}
        <View style={styles.neuralBox}>
          <Text variant="caption" color="textInverse" style={{ fontSize: 10, fontWeight: '800', opacity: 0.8, letterSpacing: 0.8 }}>
            INPUT NEURAL LAYER → HIDDEN WEIGHTS → TOKEN OUTPUT PROBABILITIES
          </Text>

          <View style={styles.nodesRow}>
            {/* Input Nodes */}
            <View style={styles.layerCol}>
              <Text variant="caption" color="textInverse" style={{ fontSize: 9, opacity: 0.7 }}>INPUTS</Text>
              {[1, 2, 3].map(n => {
                const isSelected = activeNode === n;
                return (
                  <Pressable
                    key={n}
                    onPress={() => handleNodeClick(n)}
                    style={[
                      styles.nodeCircle,
                      {
                        backgroundColor: isSelected ? '#FACC15' : 'rgba(255,255,255,0.3)',
                        borderColor: isSelected ? '#FFFFFF' : 'transparent',
                        borderWidth: isSelected ? 2 : 0,
                      },
                    ]}
                  >
                    <Text style={{ fontSize: 10, fontWeight: '900', color: isSelected ? '#000000' : '#FFFFFF' }}>
                      {`x${n}`}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Neural Connections Arrow */}
            <View style={styles.centerArrowCol}>
              <Icon name="swap-horizontal" size={24} color="rgba(255,255,255,0.7)" />
              <Text variant="caption" color="textInverse" style={{ fontSize: 9, opacity: 0.8, fontWeight: '700' }}>
                {activeTab === 'temperature' ? `T = ${paramVal.toFixed(1)}` : 'W · x + b'}
              </Text>
            </View>

            {/* Output Token Probabilities */}
            <View style={styles.layerCol}>
              <Text variant="caption" color="textInverse" style={{ fontSize: 9, opacity: 0.7 }}>PREDICTED TOKENS</Text>
              <View style={styles.outputBarRow}>
                <View style={styles.flex}>
                  <Text variant="caption" color="textInverse" style={{ fontSize: 11, fontWeight: '800' }}>
                    Token 1: "AI"
                  </Text>
                  <View style={styles.barBg}>
                    <View style={[styles.barFill, { width: `${prob1}%`, backgroundColor: '#06D6C4' }]} />
                  </View>
                </View>
                <Text variant="caption" color="textInverse" style={{ fontWeight: '900', fontSize: 12 }}>
                  {prob1}%
                </Text>
              </View>

              <View style={styles.outputBarRow}>
                <View style={styles.flex}>
                  <Text variant="caption" color="textInverse" style={{ fontSize: 11, fontWeight: '800' }}>
                    Token 2: "Brain"
                  </Text>
                  <View style={styles.barBg}>
                    <View style={[styles.barFill, { width: `${prob2}%`, backgroundColor: '#FF5FA2' }]} />
                  </View>
                </View>
                <Text variant="caption" color="textInverse" style={{ fontWeight: '900', fontSize: 12 }}>
                  {prob2}%
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Interactive Parameter Slider Bar */}
        <View style={styles.sliderRow}>
          <Text variant="caption" color="textInverse" style={{ fontSize: 11, fontWeight: '700' }}>
            Adjust Model Output:
          </Text>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {[0.2, 0.5, 0.8, 1.0].map(v => {
              const active = paramVal === v;
              return (
                <Pressable
                  key={v}
                  onPress={() => { triggerHaptic('selection'); setParamVal(v); }}
                  style={[
                    styles.paramPill,
                    { backgroundColor: active ? '#FACC15' : 'rgba(255,255,255,0.2)' },
                  ]}
                >
                  <Text style={{ fontSize: 10, fontWeight: '900', color: active ? '#000' : '#FFF' }}>
                    {v.toFixed(1)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* CTA to Full Playground */}
        <Pressable
          onPress={onOpenFullSim}
          style={({ pressed }) => [
            styles.ctaBtn,
            { opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Icon name="flask" size={16} color={colors.primary} />
          <Text variant="bodyStrong" style={{ color: colors.primary, fontSize: 13, fontWeight: '900' }}>
            EXPLORE ALL 22 INTERACTIVE NEURAL LABS →
          </Text>
        </Pressable>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: { overflow: 'hidden', borderRadius: 20 },
  flex: { flex: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(6,214,196,0.18)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(0,214,196,0.4)',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#06D6C4',
  },
  tabsRow: { flexDirection: 'row', gap: 8 },
  tabBtn: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  neuralBox: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 14,
    padding: 12,
    gap: 10,
  },
  nodesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  layerCol: { gap: 6, alignItems: 'center' },
  centerArrowCol: { alignItems: 'center', gap: 4 },
  nodeCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outputBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: 140,
  },
  barBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 2,
  },
  barFill: { height: '100%', borderRadius: 3 },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  paramPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
});

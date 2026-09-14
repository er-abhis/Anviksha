import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Line,
  RadialGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { GlassCard, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { NetWeights, forwardPass } from '../logic';
import { BrainSlider } from '../components/BrainSlider';
import { LabCanvas } from '../components/LabCanvas';

/** Weight presets — same 2-2-1 net, different behaviours, to show that weights
 *  (not magic) decide what a network computes. */
const PRESETS: Record<string, NetWeights> = {
  AND: { w: [[4, 4], [4, 4]], b: [-6, -6], o: [6, 6], ob: -6 },
  OR: { w: [[4, 4], [4, 4]], b: [-2, -2], o: [6, 6], ob: -3 },
  XOR: { w: [[4, 4], [4, 4]], b: [-2, -6], o: [6, -6], ob: -3 },
};

const VB_W = 320;
const VB_H = 210;
const NEON = '#22E0D6';
const MAG = '#FF5FA2';

export const NeuralNetwork: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const [x1, setX1] = useState(1);
  const [x2, setX2] = useState(0);
  const [preset, setPreset] = useState<keyof typeof PRESETS>('AND');
  const wts = PRESETS[preset];
  const { hidden, output } = forwardPass(x1, x2, wts);

  const inputY = [70, 140];
  const hiddenY = [70, 140];
  const outY = 105;
  const xIn = 46;
  const xHid = 160;
  const xOut = 274;
  const acts = [x1, x2];

  // Edge brightness follows the source neuron's activation → you SEE signal flow.
  const edge = (
    x1c: number, y1c: number, x2c: number, y2c: number,
    weight: number, srcAct: number, key: string,
  ) => (
    <Line
      key={key}
      x1={x1c} y1={y1c} x2={x2c} y2={y2c}
      stroke={weight >= 0 ? NEON : MAG}
      strokeWidth={0.8 + Math.min(4, Math.abs(weight)) * 0.7}
      strokeOpacity={0.18 + srcAct * 0.7}
    />
  );

  const node = (cx: number, cy: number, act: number, label: string, key: string) => (
    <React.Fragment key={key}>
      {/* outer glow grows with activation */}
      <Circle cx={cx} cy={cy} r={30} fill={`url(#glow)`} opacity={0.15 + act * 0.6} />
      <Circle cx={cx} cy={cy} r={18} fill={`url(#node)`} opacity={0.35 + act * 0.65} stroke={NEON} strokeWidth={1.5} strokeOpacity={0.6 + act * 0.4} />
      <SvgText x={cx} y={cy + 4} fontSize={11} fontWeight="700" fill="#FFFFFF" textAnchor="middle">{label}</SvgText>
    </React.Fragment>
  );

  return (
    <View style={{ gap: spacing.lg }}>
      <LabCanvas height={230}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${VB_W} ${VB_H}`}>
          <Defs>
            <RadialGradient id="node" cx="50%" cy="40%" r="70%">
              <Stop offset="0" stopColor="#BFA8FF" />
              <Stop offset="1" stopColor="#6438F5" />
            </RadialGradient>
            <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
              <Stop offset="0" stopColor={NEON} stopOpacity="0.9" />
              <Stop offset="1" stopColor={NEON} stopOpacity="0" />
            </RadialGradient>
          </Defs>
          {inputY.map((iy, i) => hiddenY.map((hy, j) => edge(xIn, iy, xHid, hy, wts.w[j][i], acts[i], `e${i}${j}`)))}
          {hiddenY.map((hy, j) => edge(xHid, hy, xOut, outY, wts.o[j], hidden[j], `o${j}`))}
          {inputY.map((iy, i) => node(xIn, iy, acts[i], acts[i].toFixed(1), `in${i}`))}
          {hiddenY.map((hy, j) => node(xHid, hy, hidden[j], hidden[j].toFixed(1), `hid${j}`))}
          {node(xOut, outY, output, output.toFixed(2), 'out')}
          <SvgText x={xIn} y={190} fontSize={10} fill="#B7A6FF" textAnchor="middle">INPUTS</SvgText>
          <SvgText x={xHid} y={190} fontSize={10} fill="#B7A6FF" textAnchor="middle">HIDDEN</SvgText>
          <SvgText x={xOut} y={160} fontSize={10} fill="#B7A6FF" textAnchor="middle">OUTPUT</SvgText>
        </Svg>
      </LabCanvas>

      <View style={[styles.outRow, { backgroundColor: colors.glass, borderColor: (output > 0.5 ? colors.success : colors.border), borderWidth: 1.5, borderRadius: radius.lg }]}>
        <View style={styles.flex}>
          <Text variant="label" color="textSecondary">OUTPUT NEURON</Text>
          <Text variant="caption" color="textTertiary">{output > 0.5 ? 'Firing 🔥' : 'Quiet'}</Text>
        </View>
        <Text variant="display" style={{ color: output > 0.5 ? colors.success : colors.textTertiary }}>{(output * 100).toFixed(0)}%</Text>
      </View>

      <GlassCard elevation="md">
        <Text variant="label" color="textSecondary" style={{ marginBottom: spacing.sm }}>INPUTS — drag to change</Text>
        <View style={{ gap: spacing.md }}>
          <BrainSlider label="Input 1" value={x1} min={0} max={1} step={0.05} onChange={setX1} format={v => v.toFixed(2)} />
          <BrainSlider label="Input 2" value={x2} min={0} max={1} step={0.05} onChange={setX2} format={v => v.toFixed(2)} />
        </View>
      </GlassCard>

      <View>
        <Text variant="label" color="textSecondary" style={{ marginBottom: spacing.sm }}>LOGIC LEARNED BY THE WEIGHTS</Text>
        <View style={styles.seg}>
          {(Object.keys(PRESETS) as (keyof typeof PRESETS)[]).map(p => {
            const active = p === preset;
            return (
              <Pressable
                key={p}
                onPress={() => setPreset(p)}
                style={[styles.segBtn, { borderRadius: radius.pill, backgroundColor: active ? colors.primaryMuted : colors.glass, borderColor: active ? colors.primary : colors.glassBorder }]}
              >
                <Text variant="bodyStrong" color={active ? 'primary' : 'textSecondary'}>{p}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <GlassCard elevation="md" style={{ borderColor: colors.primary + '55' }}>
        <Text variant="bodyStrong" color="primary" style={{ marginBottom: spacing.xs }}>What just happened?</Text>
        <Text variant="body" color="textSecondary">
          Each neuron multiplies its inputs by weights, adds them up and squashes
          the result into 0–1. Brighter edges = stronger signal flowing; cyan adds,
          magenta subtracts. The same 3-neuron network computes AND, OR or XOR just
          by changing the weights — that’s all “learning” really is.
        </Text>
      </GlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  outRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  seg: { flexDirection: 'row', gap: 8 },
  segBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, borderWidth: 1 },
});

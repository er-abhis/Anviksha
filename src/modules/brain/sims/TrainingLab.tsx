import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Path,
  Polyline,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { GlassCard, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { Verdict, trainingCurves } from '../logic';
import { BrainSlider } from '../components/BrainSlider';
import { LabCanvas } from '../components/LabCanvas';

const W = 320;
const H = 190;
const PAD = 26;
const TRAIN = '#34E39B';
const VAL = '#FF5FA2';

const verdictColor = (v: Verdict, colors: any) =>
  v === 'Good fit' ? colors.success : v === 'Overfitting' ? colors.error : colors.warning;

const verdictExplain: Record<Verdict, string> = {
  Underfitting: 'The model is too simple to capture the pattern — both curves stay low. Increase complexity.',
  'Good fit': 'Training and validation accuracy are both high and close together. This is the sweet spot.',
  Overfitting: 'Training accuracy is high but validation lags and dips — the model memorised noise instead of learning. Reduce complexity, add data, or stop training earlier.',
};

export const TrainingLab: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const [complexity, setComplexity] = useState(4);
  const [noise, setNoise] = useState(0.2);
  const [epochs, setEpochs] = useState(30);
  const { train, val, verdict, finalGap } = trainingCurves({ complexity, noise, epochs });

  const px = (i: number, n: number) => PAD + (i / (n - 1 || 1)) * (W - PAD * 2);
  const py = (v: number) => PAD + (1 - v) * (H - PAD * 2);
  const line = (arr: number[]) => arr.map((v, i) => `${px(i, arr.length).toFixed(1)},${py(v).toFixed(1)}`).join(' ');
  const area = (arr: number[]) => {
    const top = arr.map((v, i) => `${px(i, arr.length).toFixed(1)},${py(v).toFixed(1)}`).join(' L ');
    return `M ${px(0, arr.length).toFixed(1)},${(H - PAD).toFixed(1)} L ${top} L ${px(arr.length - 1, arr.length).toFixed(1)},${(H - PAD).toFixed(1)} Z`;
  };

  const vc = verdictColor(verdict, colors);

  return (
    <View style={{ gap: spacing.lg }}>
      <LabCanvas height={210}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
          <Defs>
            <LinearGradient id="trainFill" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={TRAIN} stopOpacity="0.45" />
              <Stop offset="1" stopColor={TRAIN} stopOpacity="0" />
            </LinearGradient>
            <LinearGradient id="valFill" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={VAL} stopOpacity="0.4" />
              <Stop offset="1" stopColor={VAL} stopOpacity="0" />
            </LinearGradient>
          </Defs>
          {[0, 0.5, 1].map(g => {
            const y = py(g);
            return (
              <React.Fragment key={g}>
                <Line x1={PAD} y1={y} x2={W - PAD} y2={y} stroke="rgba(255,255,255,0.12)" strokeWidth={1} strokeDasharray="3 5" />
                <SvgText x={6} y={y + 3} fontSize={9} fill="#8E86B8">{Math.round(g * 100)}</SvgText>
              </React.Fragment>
            );
          })}
          <Path d={area(train)} fill="url(#trainFill)" />
          <Path d={area(val)} fill="url(#valFill)" />
          <Polyline points={line(val)} fill="none" stroke={VAL} strokeWidth={2.5} />
          <Polyline points={line(train)} fill="none" stroke={TRAIN} strokeWidth={2.5} />
          {/* endpoint markers */}
          <Circle cx={px(train.length - 1, train.length)} cy={py(train[train.length - 1])} r={4} fill={TRAIN} />
          <Circle cx={px(val.length - 1, val.length)} cy={py(val[val.length - 1])} r={4} fill={VAL} />
          <SvgText x={W - PAD} y={H - 6} fontSize={9} fill="#8E86B8" textAnchor="end">epochs →</SvgText>
        </Svg>
      </LabCanvas>

      <View style={styles.legendRow}>
        <View style={styles.legend}><Dot color={TRAIN} /><Text variant="caption" color="textSecondary">Training</Text></View>
        <View style={styles.legend}><Dot color={VAL} /><Text variant="caption" color="textSecondary">Validation</Text></View>
        <View style={[styles.badge, { backgroundColor: vc + '22', borderColor: vc, borderRadius: radius.pill }]}>
          <Text variant="bodyStrong" style={{ color: vc }}>{verdict}</Text>
          <Text variant="caption" color="textSecondary">  gap {(finalGap * 100).toFixed(0)}%</Text>
        </View>
      </View>

      <GlassCard elevation="md">
        <View style={{ gap: spacing.md }}>
          <BrainSlider label="Model complexity" value={complexity} min={1} max={10} step={1} onChange={setComplexity} />
          <BrainSlider label="Data noise" value={noise} min={0} max={1} step={0.1} onChange={setNoise} format={v => `${Math.round(v * 100)}%`} />
          <BrainSlider label="Epochs (training time)" value={epochs} min={5} max={50} step={5} onChange={setEpochs} />
        </View>
      </GlassCard>

      <GlassCard elevation="md" style={{ borderColor: vc + '55' }}>
        <Text variant="bodyStrong" style={{ color: vc, marginBottom: spacing.xs }}>What just happened?</Text>
        <Text variant="body" color="textSecondary">{verdictExplain[verdict]}</Text>
        <Text variant="body" color="textSecondary" style={{ marginTop: spacing.sm }}>
          Push complexity to 10 with high noise and train long — watch the pink
          validation curve peel away from the green training curve. That widening
          gap IS overfitting.
        </Text>
      </GlassCard>
    </View>
  );
};

const Dot: React.FC<{ color: string }> = ({ color }) => <View style={[styles.dot, { backgroundColor: color }]} />;

const styles = StyleSheet.create({
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 14, flexWrap: 'wrap' },
  legend: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1.5, marginLeft: 'auto' },
});

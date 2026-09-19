import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { GlassCard, ProgressBar, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { biasVarianceCurve } from '../logic';
import { BrainSlider } from '../components/BrainSlider';
import { LabCanvas } from '../components/LabCanvas';

const W = 320;
const H = 200;
const PAD = 25;

export const BiasVariance: React.FC = () => {
  const { colors, spacing } = useTheme();
  const [degree, setDegree] = useState(3);
  const [noise, setNoise] = useState(0.2);

  const { bias, variance, totalError, fitQuality } = biasVarianceCurve(degree, noise);

  // Sample data points for curve fit visualization
  const samplePoints = [
    { x: 1, y: 2 }, { x: 2, y: 3 }, { x: 3, y: 2.5 },
    { x: 4, y: 5 }, { x: 5, y: 4.8 }, { x: 6, y: 7 },
    { x: 7, y: 6.5 }, { x: 8, y: 9 }, { x: 9, y: 8.2 },
  ];

  const px = (x: number) => PAD + (x / 10) * (W - PAD * 2);
  const py = (y: number) => H - PAD - (y / 10) * (H - PAD * 2);

  // Generate polynomial curve SVG path based on degree
  const generateCurvePath = () => {
    const pts: string[] = [];
    for (let x = 0.5; x <= 9.5; x += 0.5) {
      let y = x; // Base linear trend
      if (degree === 1) {
        y = 0.9 * x + 0.5; // Underfit straight line
      } else if (degree >= 2 && degree <= 5) {
        y = x + Math.sin(x * 0.8) * 1.5; // Good fit curve
      } else {
        // High variance wavy overfitted curve
        y = x + Math.sin(x * 2.5) * 3.2;
      }
      pts.push(`${px(x).toFixed(1)},${py(y).toFixed(1)}`);
    }
    return `M ${pts.join(' L ')}`;
  };

  const getBadgeColor = () => {
    if (fitQuality === 'Optimal Fit') return colors.success;
    if (fitQuality.includes('Bias')) return colors.warning;
    return colors.error;
  };

  return (
    <View style={{ gap: spacing.lg }}>
      <LabCanvas height={220}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
          {/* Axis lines */}
          <Line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} />
          <Line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} />

          {/* Curve */}
          <Path
            d={generateCurvePath()}
            fill="none"
            stroke={getBadgeColor()}
            strokeWidth={2.5}
          />

          {/* Sample data points */}
          {samplePoints.map((p, idx) => (
            <Circle
              key={idx}
              cx={px(p.x)}
              cy={py(p.y + (idx % 2 === 0 ? noise * 1.5 : -noise * 1.5))}
              r={4.5}
              fill={colors.accent}
            />
          ))}
        </Svg>
      </LabCanvas>

      {/* Metrics */}
      <GlassCard elevation="md">
        <View style={styles.rowBetween}>
          <Text variant="bodyStrong">Model Diagnosis:</Text>
          <Text variant="bodyStrong" style={{ color: getBadgeColor() }}>
            {fitQuality}
          </Text>
        </View>

        <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
          <View style={styles.metricRow}>
            <Text variant="caption" color="textSecondary" style={{ width: 90 }}>
              Bias (Underfit):
            </Text>
            <View style={{ flex: 1 }}>
              <ProgressBar progress={bias} height={8} color={colors.warning} />
            </View>
            <Text variant="caption">{(bias * 100).toFixed(0)}%</Text>
          </View>

          <View style={styles.metricRow}>
            <Text variant="caption" color="textSecondary" style={{ width: 90 }}>
              Variance (Overfit):
            </Text>
            <View style={{ flex: 1 }}>
              <ProgressBar progress={variance} height={8} color={colors.error} />
            </View>
            <Text variant="caption">{(variance * 100).toFixed(0)}%</Text>
          </View>
        </View>
      </GlassCard>

      {/* Controls */}
      <GlassCard elevation="md">
        <View style={{ gap: spacing.md }}>
          <BrainSlider
            label="Polynomial Degree (Model Complexity)"
            value={degree}
            min={1}
            max={9}
            step={1}
            onChange={setDegree}
            format={v => `Degree ${v} (${v === 1 ? 'Linear' : v <= 4 ? 'Polynomial' : 'High Poly'})`}
          />
          <BrainSlider
            label="Data Noise Level"
            value={noise}
            min={0.0}
            max={1.0}
            step={0.1}
            onChange={setNoise}
            format={v => `${Math.round(v * 100)}%`}
          />
        </View>
      </GlassCard>

      <GlassCard elevation="md" style={{ borderColor: colors.primary + '55' }}>
        <Text variant="bodyStrong" color="primary" style={{ marginBottom: spacing.xs }}>
          What just happened?
        </Text>
        <Text variant="body" color="textSecondary">
          Low complexity (Degree 1) has high bias — it oversimplifies the data into a straight line.
          High complexity (Degree 9) has high variance — it squiggles frantically to hit every noisy point.
          The goal of machine learning is finding the sweet spot where total error is minimized!
        </Text>
      </GlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  metricRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});

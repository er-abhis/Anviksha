import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import { Button, GlassCard, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { computeKMeansStep } from '../logic';
import { BrainSlider } from '../components/BrainSlider';
import { LabCanvas } from '../components/LabCanvas';

const W = 320;
const H = 220;
const PAD = 25;

const CLUSTER_COLORS = ['#34E39B', '#FF5FA2', '#22E0D6', '#FFB800', '#BFA8FF'];

export const KMeansClustering: React.FC = () => {
  const { colors, spacing } = useTheme();
  const [k, setK] = useState(3);
  const [step, setStep] = useState(0);

  const { centroids, assigned, inertia } = computeKMeansStep(k, step);

  const px = (x: number) => PAD + (x / 10) * (W - PAD * 2);
  const py = (y: number) => H - PAD - (y / 10) * (H - PAD * 2);

  return (
    <View style={{ gap: spacing.lg }}>
      <LabCanvas height={240}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
          {/* Data point to centroid connection lines */}
          {assigned.map((p, idx) => {
            const c = centroids[p.cluster];
            if (!c) return null;
            return (
              <Line
                key={idx}
                x1={px(p.x)}
                y1={py(p.y)}
                x2={px(c.x)}
                y2={py(c.y)}
                stroke={CLUSTER_COLORS[p.cluster % CLUSTER_COLORS.length]}
                strokeWidth={1}
                strokeOpacity={0.3}
              />
            );
          })}

          {/* Data points */}
          {assigned.map((p, idx) => (
            <Circle
              key={`p-${idx}`}
              cx={px(p.x)}
              cy={py(p.y)}
              r={5}
              fill={CLUSTER_COLORS[p.cluster % CLUSTER_COLORS.length]}
            />
          ))}

          {/* Centroids */}
          {centroids.map((c, idx) => (
            <React.Fragment key={`c-${idx}`}>
              <Circle
                cx={px(c.x)}
                cy={py(c.y)}
                r={12}
                fill={CLUSTER_COLORS[idx % CLUSTER_COLORS.length]}
                stroke="#FFFFFF"
                strokeWidth={2}
                opacity={0.9}
              />
              <SvgText
                x={px(c.x)}
                y={py(c.y) + 4}
                fontSize={10}
                fontWeight="bold"
                fill="#000000"
                textAnchor="middle"
              >
                C{idx + 1}
              </SvgText>
            </React.Fragment>
          ))}
        </Svg>
      </LabCanvas>

      {/* Stats and Controls */}
      <GlassCard elevation="md">
        <View style={styles.rowBetween}>
          <Text variant="bodyStrong">Cluster Iteration: Step {step}</Text>
          <Text variant="bodyStrong" color="accent">
            Inertia: {inertia}
          </Text>
        </View>

        <View style={{ gap: spacing.md, marginTop: spacing.md }}>
          <BrainSlider label="Clusters (K)" value={k} min={2} max={5} step={1} onChange={setK} />
        </View>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: spacing.md }}>
          <Button
            label="Iterate Step"
            onPress={() => setStep(s => s + 1)}
            style={{ flex: 1 }}
          />
          <Button
            label="Reset"
            variant="outline"
            onPress={() => setStep(0)}
            style={{ width: 90 }}
          />
        </View>
      </GlassCard>

      <GlassCard elevation="md" style={{ borderColor: colors.primary + '55' }}>
        <Text variant="bodyStrong" color="primary" style={{ marginBottom: spacing.xs }}>
          What just happened?
        </Text>
        <Text variant="body" color="textSecondary">
          K-Means is an unsupervised algorithm that groups unlabelled data points.
          It alternates between assigning points to the nearest centroid and shifting centroids
          to the average of their cluster until convergence (lowest inertia)!
        </Text>
      </GlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});

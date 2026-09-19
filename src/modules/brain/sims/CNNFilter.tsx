import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { GlassCard, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { CNN_FILTERS, CNN_INPUT_GRID, FilterMatrix, computeConvolutionStep } from '../logic';

export const CNNFilter: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const [filter, setFilter] = useState<FilterMatrix>(CNN_FILTERS[0]);
  const [posX, setPosX] = useState(0); // 0..2
  const [posY, setPosY] = useState(0); // 0..2

  const { sum, calcStr } = computeConvolutionStep(filter, posX, posY);

  return (
    <View style={{ gap: spacing.lg }}>
      {/* Filter preset switcher */}
      <View style={styles.seg}>
        {CNN_FILTERS.map(f => {
          const active = f.id === filter.id;
          return (
            <Pressable
              key={f.id}
              onPress={() => setFilter(f)}
              style={[
                styles.segBtn,
                {
                  borderRadius: radius.pill,
                  backgroundColor: active ? colors.primaryMuted : colors.glass,
                  borderColor: active ? colors.primary : colors.glassBorder,
                },
              ]}
            >
              <Text variant="caption" color={active ? 'primary' : 'textSecondary'}>
                {f.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Grid visualization */}
      <GlassCard elevation="md">
        <Text variant="label" color="textSecondary" style={{ marginBottom: spacing.sm }}>
          5x5 INPUT IMAGE MATRIX (SLIDE WINDOW BELOW)
        </Text>
        <View style={styles.gridContainer}>
          {CNN_INPUT_GRID.map((row, rIdx) => (
            <View key={rIdx} style={styles.gridRow}>
              {row.map((val, cIdx) => {
                const isSelected =
                  cIdx >= posX && cIdx < posX + 3 && rIdx >= posY && rIdx < posY + 3;
                return (
                  <View
                    key={cIdx}
                    style={[
                      styles.cell,
                      {
                        backgroundColor: val === 1 ? colors.primary + '88' : colors.surfaceAlt,
                        borderColor: isSelected ? colors.accent : colors.border,
                        borderWidth: isSelected ? 2 : 1,
                        borderRadius: radius.xs,
                      },
                    ]}
                  >
                    <Text
                      variant="bodyStrong"
                      style={{ color: isSelected ? colors.accent : colors.text }}
                    >
                      {val}
                    </Text>
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        {/* Sliders to move 3x3 kernel position */}
        <View style={{ marginTop: spacing.md }}>
          <Text variant="label" color="textSecondary" style={{ marginBottom: spacing.xs }}>
            KERNEL SLIDING WINDOW POSITION
          </Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {[0, 1, 2].map(x => (
              <Pressable
                key={x}
                onPress={() => setPosX(x)}
                style={[
                  styles.posBtn,
                  {
                    backgroundColor: posX === x ? colors.primaryMuted : colors.glass,
                    borderColor: posX === x ? colors.primary : colors.border,
                    borderRadius: radius.sm,
                  },
                ]}
              >
                <Text variant="caption">Col {x + 1}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </GlassCard>

      {/* Calculation output card */}
      <GlassCard elevation="md">
        <Text variant="label" color="textSecondary" style={{ marginBottom: spacing.xs }}>
          CONVOLUTION DOT PRODUCT CALCULATION
        </Text>
        <Text variant="body" color="textSecondary" style={{ fontFamily: 'monospace', marginVertical: spacing.xs }}>
          {calcStr}
        </Text>
        <View style={[styles.resultRow, { backgroundColor: colors.primaryMuted, borderRadius: radius.md, padding: 12 }]}>
          <Text variant="bodyStrong">Feature Map Output Pixel:</Text>
          <Text variant="display" color="primary">
            {sum}
          </Text>
        </View>
      </GlassCard>

      <GlassCard elevation="md" style={{ borderColor: colors.primary + '55' }}>
        <Text variant="bodyStrong" color="primary" style={{ marginBottom: spacing.xs }}>
          What just happened?
        </Text>
        <Text variant="body" color="textSecondary">
          Convolutional layers scan an image with small weight matrices called filters or kernels.
          As the 3x3 window slides across pixels, element-wise multiplication produces feature maps that
          detect edges, curves, and visual textures!
        </Text>
      </GlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  seg: { flexDirection: 'row', gap: 8 },
  segBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, borderWidth: 1 },
  gridContainer: { alignItems: 'center', gap: 4 },
  gridRow: { flexDirection: 'row', gap: 4 },
  cell: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  posBtn: { flex: 1, alignItems: 'center', paddingVertical: 8, borderWidth: 1 },
  resultRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});

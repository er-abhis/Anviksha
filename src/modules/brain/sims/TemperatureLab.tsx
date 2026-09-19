import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, GlassCard, ProgressBar, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { sampleNextToken } from '../logic';
import { BrainSlider } from '../components/BrainSlider';

export const TemperatureLab: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const [temp, setTemp] = useState(0.7);
  const [topP, setTopP] = useState(0.9);
  const [generatedText, setGeneratedText] = useState('Once upon a time, there was');

  const candidates = sampleNextToken(temp, topP);

  const stepNextToken = () => {
    // Pick from in-top-P tokens weighted by probability
    const allowed = candidates.filter(c => c.inTopP);
    const chosen = allowed[Math.floor(Math.random() * allowed.length)] ?? candidates[0];
    setGeneratedText(prev => `${prev} ${chosen.token}`);
  };

  return (
    <View style={{ gap: spacing.lg }}>
      {/* Generated text display */}
      <GlassCard elevation="lg">
        <Text variant="label" color="textSecondary" style={{ marginBottom: spacing.xs }}>
          GENERATED TEXT STREAM
        </Text>
        <Text variant="h3" color="primary" style={{ marginVertical: spacing.xs }}>
          "{generatedText}"
        </Text>
        <Button
          label="Step Generate Next Token"
          onPress={stepNextToken}
          style={{ marginTop: spacing.sm }}
        />
      </GlassCard>

      {/* Sliders */}
      <GlassCard elevation="md">
        <Text variant="label" color="textSecondary" style={{ marginBottom: spacing.sm }}>
          SAMPLER HYPERPARAMETERS
        </Text>
        <View style={{ gap: spacing.md }}>
          <BrainSlider
            label="Temperature (Randomness)"
            value={temp}
            min={0.1}
            max={2.0}
            step={0.1}
            onChange={setTemp}
            format={v => (v < 0.3 ? `${v.toFixed(1)} (Focused)` : v > 1.2 ? `${v.toFixed(1)} (Creative/Wild)` : `${v.toFixed(1)} (Balanced)`)}
          />
          <BrainSlider
            label="Top-P (Nucleus Sampling)"
            value={topP}
            min={0.1}
            max={1.0}
            step={0.05}
            onChange={setTopP}
            format={v => `${Math.round(v * 100)}% nucleus`}
          />
        </View>
      </GlassCard>

      {/* Probability distribution chart */}
      <GlassCard elevation="md">
        <Text variant="label" color="textSecondary" style={{ marginBottom: spacing.sm }}>
          CANDIDATE TOKEN PROBABILITIES
        </Text>
        <View style={{ gap: spacing.sm }}>
          {candidates.map(c => (
            <View key={c.token} style={styles.tokenRow}>
              <View style={styles.tokenName}>
                <Text
                  variant="bodyStrong"
                  style={{ color: c.inTopP ? colors.text : colors.textTertiary }}
                >
                  "{c.token}"
                </Text>
                {!c.inTopP && (
                  <Text variant="caption" color="textTertiary" style={{ fontSize: 9 }}>
                    (Cut by Top-P)
                  </Text>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <ProgressBar
                  progress={c.prob}
                  height={8}
                  color={c.inTopP ? colors.primary : colors.border}
                />
              </View>
              <Text variant="caption" color="textSecondary" style={{ width: 42, textAlign: 'right' }}>
                {(c.prob * 100).toFixed(1)}%
              </Text>
            </View>
          ))}
        </View>
      </GlassCard>

      <GlassCard elevation="md" style={{ borderColor: colors.primary + '55' }}>
        <Text variant="bodyStrong" color="primary" style={{ marginBottom: spacing.xs }}>
          What just happened?
        </Text>
        <Text variant="body" color="textSecondary">
          Low temperature (0.1) sharpens the probability peak so the model almost always picks the top token.
          High temperature (1.5+) flattens the distribution, giving rare or bizarre tokens a higher chance.
          Top-P cuts off the long tail of unlikely tokens to prevent pure gibberish!
        </Text>
      </GlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  tokenRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  tokenName: { width: 90, flexDirection: 'row', alignItems: 'center', gap: 4 },
});

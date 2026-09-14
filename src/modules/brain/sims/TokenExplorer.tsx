import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { GlassCard, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { tokenStats } from '../logic';

const SAMPLE = 'AI models read text as tokens, not words. Tokenization matters!';

/** Live tokenizer: type text, watch it break into coloured tokens. */
export const TokenExplorer: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const [text, setText] = useState(SAMPLE);
  const { tokens, tokenCount, words, ratio } = tokenStats(text);

  const hueColors = [colors.primary, colors.accent, colors.accentAlt, colors.coins, colors.success, colors.warning];

  return (
    <View style={{ gap: spacing.lg }}>
      <GlassCard elevation="md">
        <Text variant="label" color="textSecondary" style={{ marginBottom: spacing.sm }}>
          YOUR TEXT
        </Text>
        <TextInput
          value={text}
          onChangeText={setText}
          multiline
          placeholder="Type anything…"
          placeholderTextColor={colors.textTertiary}
          style={[
            styles.input,
            { color: colors.text, backgroundColor: colors.surfaceAlt, borderRadius: radius.md },
          ]}
        />
      </GlassCard>

      <View style={styles.statRow}>
        <Stat label="Tokens" value={tokenCount} color={colors.primary} />
        <Stat label="Words" value={words} color={colors.accent} />
        <Stat label="Chars" value={text.length} color={colors.textSecondary} />
        <Stat label="Tokens/word" value={ratio} color={colors.coins} />
      </View>

      <GlassCard elevation="md">
        <Text variant="label" color="textSecondary" style={{ marginBottom: spacing.sm }}>
          TOKENS
        </Text>
        <View style={styles.chips}>
          {tokens.map((t, i) => {
            const c = hueColors[t.hue];
            const display = t.text === ' ' ? '␣' : t.text;
            return (
              <View
                key={i}
                style={[
                  styles.chip,
                  {
                    backgroundColor: c + '22',
                    borderColor: c + '66',
                    borderRadius: radius.sm,
                    borderStyle: t.split ? 'dashed' : 'solid',
                  },
                ]}
              >
                <Text variant="bodyStrong" style={{ color: c }}>
                  {display}
                </Text>
              </View>
            );
          })}
        </View>
      </GlassCard>

      <GlassCard elevation="md" style={{ borderColor: colors.primary + '55' }}>
        <Text variant="bodyStrong" color="primary" style={{ marginBottom: spacing.xs }}>
          What just happened?
        </Text>
        <Text variant="body" color="textSecondary">
          Models don’t see words — they see tokens. Common words are usually one
          token, but long or rare words get chopped into sub-word pieces (the
          dashed chips). That’s why token counts run higher than word counts, and
          why every API charges per token. Add a long word like
          “antidisestablishmentarianism” and watch it shatter.
        </Text>
      </GlassCard>
    </View>
  );
};

const Stat: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => {
  const { colors, radius, spacing } = useTheme();
  return (
    <View style={[styles.stat, { backgroundColor: colors.glass, borderRadius: radius.md, padding: spacing.sm }]}>
      <Text variant="h3" style={{ color }}>
        {value}
      </Text>
      <Text variant="caption" color="textTertiary">
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  input: { minHeight: 90, padding: 14, fontSize: 16, textAlignVertical: 'top' },
  statRow: { flexDirection: 'row', gap: 8 },
  stat: { flex: 1, alignItems: 'center' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1 },
});

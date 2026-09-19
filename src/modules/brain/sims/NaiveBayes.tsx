import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { GlassCard, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { NAIVE_BAYES_WORDS, calcSpamProbability } from '../logic';

export const NaiveBayes: React.FC = () => {
  const { colors, spacing, radius } = useTheme();
  const [selectedWords, setSelectedWords] = useState<string[]>(['WINNER', 'FREE']);

  const toggleWord = (word: string) => {
    setSelectedWords(prev =>
      prev.includes(word) ? prev.filter(w => w !== word) : [...prev, word],
    );
  };

  const { spamPercentage, isSpam } = calcSpamProbability(selectedWords);

  return (
    <GlassCard elevation="md" style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: colors.primaryMuted, borderRadius: radius.md }]}>
          <Icon name="mail-unread-outline" size={24} color={colors.primary} />
        </View>
        <View style={styles.flex}>
          <Text variant="bodyStrong">Naive Bayes Classifier</Text>
          <Text variant="caption" color="textSecondary">
            Applies Bayes' Theorem assuming feature independence: P(Spam|Words) vs P(Ham|Words).
          </Text>
        </View>
      </View>

      {/* Word Chips */}
      <View style={styles.chipContainer}>
        <Text variant="label" color="textSecondary">SELECT MESSAGE WORDS:</Text>
        <View style={styles.chipRow}>
          {Object.keys(NAIVE_BAYES_WORDS).map(w => {
            const active = selectedWords.includes(w);
            return (
              <Pressable
                key={w}
                onPress={() => toggleWord(w)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? colors.primary : colors.surfaceAlt,
                    borderRadius: radius.pill,
                  },
                ]}
              >
                <Text variant="caption" style={{ color: active ? colors.onPrimary : colors.text, fontWeight: active ? '700' : '500' }}>
                  {active ? `✓ ${w}` : `+ ${w}`}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Spam Probability Result */}
      <View style={[styles.resultBox, { backgroundColor: isSpam ? colors.warning + '22' : colors.success + '22', borderRadius: radius.md }]}>
        <View style={styles.rowBetween}>
          <View style={styles.rowGap}>
            <Icon name={isSpam ? 'warning-outline' : 'checkmark-circle-outline'} size={24} color={isSpam ? colors.warning : colors.success} />
            <Text variant="bodyStrong" color={isSpam ? 'warning' : 'success'}>
              {isSpam ? 'CLASSIFIED AS SPAM 🚨' : 'CLASSIFIED AS HAM (LEGIT) ✅'}
            </Text>
          </View>
          <Text variant="h2" color={isSpam ? 'warning' : 'success'}>{spamPercentage}%</Text>
        </View>
        <Text variant="caption" color="textSecondary" style={{ marginTop: 4 }}>
          {selectedWords.length > 0
            ? `Calculated likelihood for: "${selectedWords.join('", "')}"`
            : 'Select words to calculate Bayesian spam probability'}
        </Text>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  card: { gap: 14, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  chipContainer: { gap: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { paddingHorizontal: 12, paddingVertical: 6 },
  resultBox: { padding: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowGap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});

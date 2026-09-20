import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { GlassCard, Gradient, Header, Screen, SectionTitle, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { RootStackParamList } from '../../../navigation/types';
import {
  conceptsMastered,
  dueForReview,
  simsCompletedCount,
  useBrainStore,
  useProgressStore,
} from '../../../store';
import { useResponsive } from '../../../hooks/useResponsive';
import { CASES, SIMS, SimMeta, missionForDay } from '../data';
import { todayISO } from '../../../content';

export const BrainScreen: React.FC = () => {
  const { colors, radius, spacing, gradients } = useTheme();
  const { cellWidthPercent } = useResponsive();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const xp = useProgressStore(s => s.xp);
  const level = useProgressStore(s => s.level);
  const streak = useProgressStore(s => s.streakDays);
  const simsDone = useBrainStore(simsCompletedCount);
  const mastered = useBrainStore(conceptsMastered);
  const simsCompleted = useBrainStore(s => s.simsCompleted);
  const casesState = useBrainStore(s => s.cases);
  const concepts = useBrainStore(s => s.concepts);
  const due = dueForReview(concepts, Date.now());

  const mission = missionForDay(todayISO());
  const openMission = () =>
    mission.kind === 'sim'
      ? navigation.navigate('BrainSim', { simId: mission.targetId })
      : navigation.navigate('Detective', { caseId: mission.targetId });

  // Map a due concept back to the sim that teaches it, for the review CTA.
  const reviewTarget = (concept: string) => SIMS.find(s => s.concept === concept);

  const categories: SimMeta['category'][] = [
    'Core Models',
    'LLMs & Transformers',
    'Classic ML',
    'Optimization & Systems',
  ];

  return (
    <Screen scroll backdropIntensity={0.5} contentContainerStyle={{ gap: spacing.md }}>
      <Header title="" onBack={() => navigation.goBack()} />

      {/* Hero */}
      <View style={[styles.hero, { borderRadius: radius.xl, overflow: 'hidden' }]}>
        <Gradient colors={gradients.brand} style={StyleSheet.absoluteFill} />
        <View style={{ padding: spacing.md }}>
          <Text variant="label" color="textInverse" style={{ opacity: 0.9, letterSpacing: 1 }}>INSIDE THE AI BRAIN</Text>
          <Text variant="h2" color="textInverse" style={{ marginTop: spacing.xxs }}>
            Learn AI by Playing
          </Text>
          <Text variant="caption" color="textInverse" style={{ opacity: 0.92, marginTop: spacing.xs, lineHeight: 16 }}>
            {SIMS.length + CASES.length}+ interactive simulations and detective cases. Poke the model and watch it react.
          </Text>
          <View style={[styles.pills, { marginTop: spacing.sm }]}>
            <Pill icon="flash" value={`${xp} XP`} />
            <Pill icon="ribbon" value={`Lvl ${level}`} />
            <Pill icon="flame" value={`${streak}d`} />
          </View>
          <View style={[styles.pills, { marginTop: spacing.xs }]}>
            <Pill icon="flask" value={`${simsDone}/${SIMS.length} sims`} />
            <Pill icon="sparkles" value={`${mastered} concepts`} />
          </View>
        </View>
      </View>

      {/* Today's Mission */}
      <View>
        <SectionTitle title="Today’s Mission" />
        <GlassCard elevation="glow" onPress={openMission}>
          <View style={styles.row}>
            <View style={[styles.icon, { backgroundColor: colors.primaryMuted, borderRadius: radius.md }]}>
              <Icon name={mission.kind === 'sim' ? 'flask' : 'search'} size={24} color={colors.primary} />
            </View>
            <View style={styles.flex}>
              <Text variant="label" color="accent">{mission.kind === 'sim' ? '2–4 MIN EXPERIMENT' : 'DETECTIVE CASE'}</Text>
              <Text variant="bodyStrong">{mission.title}</Text>
              <Text variant="caption" color="textSecondary">{mission.blurb}</Text>
            </View>
            <Icon name="chevron-forward" size={18} color={colors.textTertiary} />
          </View>
        </GlassCard>
      </View>

      {/* Ready to review (spaced revision) */}
      {due.length > 0 && (() => {
        const t = reviewTarget(due[0]);
        if (!t) return null;
        return (
          <View>
            <SectionTitle title="Ready to Review" />
            <GlassCard elevation="md" onPress={() => navigation.navigate('BrainSim', { simId: t.id })} style={{ borderColor: colors.warning + '66' }}>
              <View style={styles.row}>
                <View style={[styles.icon, { backgroundColor: colors.warning + '22', borderRadius: radius.md }]}>
                  <Icon name="refresh" size={22} color={colors.warning} />
                </View>
                <View style={styles.flex}>
                  <Text variant="bodyStrong">🔁 Review {t.concept}</Text>
                  <Text variant="caption" color="textSecondary">Spaced revision — revisit this to lock it in.</Text>
                </View>
                <Icon name="chevron-forward" size={18} color={colors.textTertiary} />
              </View>
            </GlassCard>
          </View>
        );
      })()}

      {/* Categorized 20 Interactive Simulations */}
      {categories.map(cat => {
        const catSims = SIMS.filter(s => s.category === cat);
        if (catSims.length === 0) return null;
        return (
          <View key={cat}>
            <SectionTitle title={cat} />
            <View style={styles.grid}>
              {catSims.map(s => {
                const done = Boolean(simsCompleted[s.id]);
                return (
                  <Pressable
                    key={s.id}
                    onPress={() => navigation.navigate('BrainSim', { simId: s.id })}
                    style={({ pressed }) => [styles.cell, { width: cellWidthPercent as any, opacity: pressed ? 0.7 : 1 }]}
                  >
                    <GlassCard elevation="md" style={styles.simCardInner}>
                      <View style={[styles.simIcon, { backgroundColor: colors.primaryMuted, borderRadius: radius.md }]}>
                        <Icon name={s.icon} size={22} color={colors.primary} />
                      </View>
                      <View style={styles.simTitleRow}>
                        <Text variant="bodyStrong" numberOfLines={1} style={styles.flex}>{s.title}</Text>
                        {done && <Icon name="checkmark-circle" size={16} color={colors.success} />}
                      </View>
                      <Text variant="caption" color="textSecondary" numberOfLines={2} style={{ marginTop: 2 }}>{s.tagline}</Text>
                    </GlassCard>
                  </Pressable>
                );
              })}
            </View>
          </View>
        );
      })}

      {/* AI Arcade Games */}
      <View>
        <SectionTitle title="AI Arcade Games 🎮" />
        <GlassCard elevation="glow" onPress={() => navigation.navigate('AIGames')}>
          <View style={styles.row}>
            <View style={[styles.icon, { backgroundColor: colors.accentMuted, borderRadius: radius.md }]}>
              <Icon name="game-controller-outline" size={24} color={colors.accent} />
            </View>
            <View style={styles.flex}>
              <Text variant="label" color="accent">INTERACTIVE MINI-GAMES</Text>
              <Text variant="bodyStrong">Prompt Master & Transformer Builder</Text>
              <Text variant="caption" color="textSecondary">Test your AI skills in fun, gamified challenges.</Text>
            </View>
            <Icon name="chevron-forward" size={18} color={colors.textTertiary} />
          </View>
        </GlassCard>
      </View>

      {/* Detective */}
      <View>
        <SectionTitle title="AI Detective 🕵️" />
        <View style={{ gap: spacing.sm }}>
          {CASES.map(c => {
            const solved = Boolean(casesState[c.id]?.solved);
            return (
              <GlassCard key={c.id} elevation="md" onPress={() => navigation.navigate('Detective', { caseId: c.id })}>
                <View style={styles.row}>
                  <Text style={styles.caseEmoji}>{c.emoji}</Text>
                  <View style={styles.flex}>
                    <Text variant="bodyStrong">{c.title}</Text>
                    <Text variant="caption" color="textSecondary">Find the flaw · {c.concept}</Text>
                  </View>
                  {solved ? (
                    <Icon name="checkmark-circle" size={20} color={colors.success} />
                  ) : (
                    <Icon name="chevron-forward" size={18} color={colors.textTertiary} />
                  )}
                </View>
              </GlassCard>
            );
          })}
        </View>
      </View>
    </Screen>
  );
};

const Pill: React.FC<{ icon: string; value: string }> = ({ icon, value }) => {
  const { colors, radius } = useTheme();
  return (
    <View style={[styles.pill, { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: radius.pill }]}>
      <Icon name={icon} size={14} color={colors.textInverse} />
      <Text variant="label" color="textInverse">{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  hero: {},
  pills: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  icon: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  cell: { minHeight: 90 },
  simCardInner: { padding: 10, minHeight: 90, justifyContent: 'space-between' },
  simIcon: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  simTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  caseEmoji: { fontSize: 24 },
});

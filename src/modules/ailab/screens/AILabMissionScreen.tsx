import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  Button,
  Card,
  Confetti,
  DraggableList,
  EmptyState,
  Gradient,
  GlassCard,
  Header,
  IconButton,
  Screen,
  Text,
} from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import {
  useAchievementsStore,
  useAILabStore,
  useProgressStore,
} from '../../../store';
import { RootStackParamList } from '../../../navigation/types';
import { getMission, missionPool } from '../data/missions';
import { challengesFor } from '../challenges/resolve';
import {
  completionCriteria,
  missionBaseScore,
  missionChallengeCount,
} from '../progression/completion';
import { builderLevelForXp, computeScore } from '../scoring/score';
import { awardBadges } from '../scoring/awards';
import { getComponent } from '../data/components';
import { LabComponentId } from '../types';
import { ComponentTray } from '../components/ComponentTray';
import { ValidationPanel } from '../components/ValidationPanel';
import { SimulationPanel } from '../components/SimulationPanel';
import { rowStatusFor, validateArchitecture } from '../validation/validate';
import {
  addComponent,
  emptyArchitecture,
  isEmpty,
  removeComponent,
  reorder,
  withComponents,
} from '../builder/architecture';

export const AILabMissionScreen: React.FC = () => {
  const { colors, spacing, radius, gradients } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'AILabMission'>>();
  const missionId = route.params.missionId;
  const mission = getMission(missionId);

  // The architecture is the single source of truth for the build. When resuming
  // a saved project, seed it from that project's components.
  const [arch, setArch] = useState(() => {
    const pid = route.params.projectId;
    const p = pid ? useAILabStore.getState().projects[pid] : undefined;
    return p
      ? withComponents(missionId, p.components)
      : emptyArchitecture(missionId);
  });
  const [projectId, setProjectId] = useState(route.params.projectId);
  const [projectName] = useState(() => {
    const pid = route.params.projectId;
    const p = pid ? useAILabStore.getState().projects[pid] : undefined;
    return p?.name;
  });
  const [justSaved, setJustSaved] = useState(false);

  // AI Lab progress + gamification.
  const solvedChallenges = useAILabStore(s => s.solvedChallenges[missionId]);
  const record = useAILabStore(s => s.completed[missionId]);
  const retries = useAILabStore(s => s.retries[missionId] ?? 0);
  const aiLabXp = useAILabStore(s => s.aiLabXp);
  const completeMission = useAILabStore(s => s.completeMission);
  const saveProject = useAILabStore(s => s.saveProject);
  const addXp = useProgressStore(s => s.addXp);
  const logActivity = useProgressStore(s => s.logActivity);
  const unlock = useAchievementsStore(s => s.unlock);

  const pool = useMemo(() => (mission ? missionPool(mission) : []), [mission]);
  const validation = useMemo(
    () => (mission ? validateArchitecture(mission, arch) : null),
    [mission, arch],
  );

  const solvedIds = useMemo(() => solvedChallenges ?? [], [solvedChallenges]);
  const allSolved = useMemo(
    () =>
      mission
        ? challengesFor(mission.id).every(c => solvedIds.includes(c.id))
        : false,
    [mission, solvedIds],
  );
  const complete = Boolean(validation?.ok && allSolved);

  const score = useMemo(() => {
    if (!mission) return null;
    const optionalUsed = arch.components.filter(id =>
      mission.optional.includes(id),
    ).length;
    return computeScore({
      architectureValid: Boolean(validation?.ok),
      baseScore: missionBaseScore(mission),
      challengesSolved: solvedIds.length,
      optionalUsed,
      retries,
    });
  }, [mission, arch, validation, solvedIds, retries]);

  // Record completion once (per screen mount). XP + badges granted first time.
  const recordedRef = useRef(false);
  useEffect(() => {
    if (!mission || !complete || !score || recordedRef.current) return;
    recordedRef.current = true;
    const firstTime = !useAILabStore.getState().completed[missionId];
    completeMission(missionId, score.total);
    if (firstTime) {
      addXp(score.total);
      logActivity({
        label: `Built ${mission.title.replace('Build ', '')}`,
        detail: `Scored ${score.total} in the AI Lab`,
        icon: 'hardware-chip',
        at: Date.now(),
      });
    }
    const snap = useAILabStore.getState();
    const at = Date.now();
    awardBadges({
      completedMissionIds: Object.keys(snap.completed),
      totalChallengesSolved: Object.values(snap.solvedChallenges).reduce(
        (n, arr) => n + arr.length,
        0,
      ),
    }).forEach(slug => unlock(slug, at));
  }, [complete, score, mission, missionId, completeMission, addXp, logActivity, unlock]);

  if (!mission) {
    return (
      <Screen>
        <Header onBack={() => navigation.goBack()} />
        <EmptyState
          icon="alert-circle-outline"
          title="Mission not found"
          message="This mission is no longer available."
          actionLabel="Back to AI Lab"
          onAction={() => navigation.goBack()}
        />
      </Screen>
    );
  }

  const accent = colors[mission.accent];

  const add = (id: LabComponentId) => {
    setArch(a => addComponent(a, id));
    setJustSaved(false);
  };
  const remove = (id: string) => {
    setArch(a => removeComponent(a, id as LabComponentId));
    setJustSaved(false);
  };
  const onReorder = (next: string[]) => {
    setArch(a => reorder(a, next as LabComponentId[]));
    setJustSaved(false);
  };
  const reset = () => setArch(emptyArchitecture(missionId));
  const replay = () => {
    recordedRef.current = false;
    setArch(emptyArchitecture(missionId));
  };

  const onSave = () => {
    const id = saveProject({
      id: projectId,
      name: projectName ?? mission.title.replace('Build ', ''),
      missionId,
      components: arch.components,
      connections: arch.connections,
      score: score?.total ?? 0,
      level: builderLevelForXp(aiLabXp),
      completedChallenges: solvedIds,
    });
    setProjectId(id);
    setJustSaved(true);
  };

  return (
    <Screen scroll contentContainerStyle={{ gap: spacing.xl }}>
      <Header
        title={mission.title}
        subtitle={`${mission.difficulty} · Builder Lvl ${builderLevelForXp(aiLabXp)}`}
        onBack={() => navigation.goBack()}
        right={
          !isEmpty(arch) ? (
            <View style={styles.headerActions}>
              <IconButton
                name={justSaved ? 'checkmark-done' : 'save-outline'}
                onPress={onSave}
                accessibilityLabel="Save build"
                color={justSaved ? 'success' : 'primary'}
              />
              <IconButton
                name="refresh-outline"
                onPress={reset}
                accessibilityLabel="Reset build"
              />
            </View>
          ) : undefined
        }
      />

      {/* Hero + objective */}
      <Animated.View entering={FadeInDown.springify().damping(16)}>
        <Card elevation="glow" style={styles.overflowHidden}>
          <Gradient
            colors={[accent + '2E', accent + '08']}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          <View style={[styles.rail, { backgroundColor: accent }]} />
          <View style={[styles.heroRow, { gap: spacing.md }]}>
            <View
              style={[
                styles.emojiChip,
                { backgroundColor: accent + '2E', borderRadius: radius.lg },
              ]}
            >
              <Text style={styles.heroEmoji}>{mission.emoji}</Text>
            </View>
            <View style={styles.flex}>
              <Text variant="h3">{mission.title}</Text>
              <Text variant="caption" color="textSecondary">
                {mission.concept}
              </Text>
            </View>
          </View>
          <Text variant="body" style={{ marginTop: spacing.md }}>
            {mission.objective}
          </Text>
        </Card>
      </Animated.View>

      {/* Builder header */}
      <View>
        <Text variant="h3">Build Your AI</Text>
        <Text variant="caption" color="textSecondary">
          Tap a block to add it, then long-press and drag to arrange your
          pipeline top to bottom.
        </Text>
      </View>

      {/* Component tray */}
      <View style={{ gap: spacing.sm }}>
        <Text variant="label" color="textSecondary">
          COMPONENTS
        </Text>
        <ComponentTray pool={pool} placed={arch.components} onAdd={add} />
      </View>

      {/* Workspace */}
      <View style={{ gap: spacing.sm }}>
        <Text variant="label" color="textSecondary">
          YOUR PIPELINE
        </Text>
        {isEmpty(arch) ? (
          <GlassCard elevation="sm" style={styles.dropHint}>
            <Icon name="add-circle-outline" size={26} color={colors.textTertiary} />
            <Text variant="caption" color="textTertiary" center>
              Add components above to start building. They stack into a pipeline
              here.
            </Text>
          </GlassCard>
        ) : (
          <DraggableList
            items={arch.components}
            onChange={onReorder}
            onRemove={remove}
            connector
            rowStatus={id => rowStatusFor(mission, id as LabComponentId)}
            labelFor={id => getComponent(id as LabComponentId).label}
            iconFor={id => getComponent(id as LabComponentId).icon}
          />
        )}
      </View>

      {/* Live validation — explains what works and what's missing, and why. */}
      {validation && !isEmpty(arch) && <ValidationPanel result={validation} />}

      {/* Mission complete — build valid AND all challenges solved. */}
      {complete && score && (
        <Animated.View entering={FadeInDown.springify().damping(16)}>
        <Card elevation="glow" style={{ overflow: 'hidden', borderColor: colors.success }}>
          <Gradient
            colors={gradients.success}
            opacities={[0.16, 0.04]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          <View style={[styles.completeHeader, { gap: spacing.sm }]}>
            <Icon name="trophy" size={20} color={colors.success} />
            <Text variant="h3" style={styles.flex} color="success">
              Mission complete!
            </Text>
          </View>
          <View style={{ gap: spacing.xs, marginTop: spacing.sm }}>
            {score.lines.map(line => (
              <View key={line.label} style={styles.scoreRow}>
                <Text variant="caption" color="textSecondary" style={styles.flex}>
                  {line.label}
                </Text>
                <Text variant="caption" color={line.points < 0 ? 'error' : 'text'}>
                  {line.points >= 0 ? '+' : ''}
                  {line.points}
                </Text>
              </View>
            ))}
            <View style={[styles.scoreRow, styles.scoreTotal, { borderTopColor: colors.border }]}>
              <Text variant="bodyStrong" style={styles.flex}>
                Score
              </Text>
              <Text variant="bodyStrong" color="success">
                {score.total}
              </Text>
            </View>
          </View>
          {record && (
            <Text variant="caption" color="textSecondary" style={{ marginTop: spacing.xs }}>
              Best score: {record.bestScore} · AI Builder Level {builderLevelForXp(aiLabXp)}
            </Text>
          )}
          <Button
            label="View & Share"
            onPress={() =>
              navigation.navigate('AILabShowcase', {
                title: mission.title.replace('Build ', ''),
                emoji: mission.emoji,
                components: arch.components,
                score: score.total,
                xpEarned: record?.bestScore ?? score.total,
                challengesDone: solvedIds.length,
                challengesTotal: missionChallengeCount(mission),
                concept: mission.concept,
              })
            }
            fullWidth
            style={{ marginTop: spacing.md }}
            left={<Icon name="rocket" size={18} color={colors.onPrimary} />}
          />
          <Button
            label="Replay"
            variant="secondary"
            onPress={replay}
            fullWidth
            style={{ marginTop: spacing.sm }}
            left={<Icon name="refresh" size={18} color={colors.text} />}
          />
        </Card>
        </Animated.View>
      )}

      {/* Completion criteria — architecture valid but challenges outstanding. */}
      {validation?.ok && !complete && (
        <Animated.View entering={FadeInDown.springify().damping(16)}>
        <Card elevation="glow" style={{ overflow: 'hidden', borderColor: colors.success }}>
          <Gradient
            colors={gradients.success}
            opacities={[0.12, 0.03]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          <View style={[styles.completeHeader, { gap: spacing.sm }]}>
            <Icon name="ribbon" size={20} color={colors.success} />
            <Text variant="bodyStrong" style={styles.flex}>
              Architecture complete
            </Text>
            <Text variant="caption" style={{ color: colors.success }}>
              +{missionBaseScore(mission)} XP
            </Text>
          </View>
          <View style={{ gap: spacing.xs, marginTop: spacing.sm }}>
            {completionCriteria(mission).map((c, i) => {
              const done = i === 0 || allSolved;
              return (
                <View key={c} style={[styles.criterion, { gap: spacing.xs }]}>
                  <Icon
                    name={done ? 'checkmark-circle' : 'ellipse-outline'}
                    size={16}
                    color={done ? colors.success : colors.textTertiary}
                  />
                  <Text variant="caption" color={done ? 'text' : 'textSecondary'}>
                    {c}
                  </Text>
                </View>
              );
            })}
          </View>
          {missionChallengeCount(mission) > 0 && (
            <Text variant="caption" color="textSecondary" style={{ marginTop: spacing.sm }}>
              Take the challenge below to finish the mission.
            </Text>
          )}
        </Card>
        </Animated.View>
      )}

      {/* Offline simulation playground. */}
      {!isEmpty(arch) && <SimulationPanel architecture={arch} />}

      {/* Challenge game loop. */}
      {challengesFor(missionId).length > 0 && (
        <Button
          label="🚨 Take the Challenge"
          variant="secondary"
          fullWidth
          onPress={() => navigation.navigate('AILabChallenge', { missionId })}
        />
      )}

      {complete && <Confetti />}
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  overflowHidden: { overflow: 'hidden' },
  rail: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 },
  heroRow: { flexDirection: 'row', alignItems: 'center' },
  emojiChip: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: { fontSize: 28 },
  dropHint: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    gap: 8,
    borderStyle: 'dashed',
    borderWidth: 1,
  },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  completeHeader: { flexDirection: 'row', alignItems: 'center' },
  criterion: { flexDirection: 'row', alignItems: 'center' },
  scoreRow: { flexDirection: 'row', alignItems: 'center' },
  scoreTotal: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 6, marginTop: 2 },
});


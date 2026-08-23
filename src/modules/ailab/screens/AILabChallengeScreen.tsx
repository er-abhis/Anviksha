import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  Button,
  Card,
  Confetti,
  DraggableList,
  EmptyState,
  Header,
  ProgressBar,
  Screen,
  Text,
} from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { useAILabStore } from '../../../store';
import { RootStackParamList } from '../../../navigation/types';
import { getMission } from '../data/missions';
import { getComponent } from '../data/components';
import { LabComponentId } from '../types';
import { ComponentTray } from '../components/ComponentTray';
import {
  addComponent,
  removeComponent,
  reorder,
  withComponents,
} from '../builder/architecture';
import { isChallengeSolved } from '../challenges/resolve';
import { buildChallengeRun } from '../challenges/select';
import {
  getRecentVariantKeys,
  pushRecentVariantKeys,
} from '../random/history';

const TYPE_LABEL: Record<string, string> = {
  missing_component: 'Missing component',
  wrong_component: 'Wrong component',
  wrong_connection: 'Wrong connection',
  missing_capability: 'Missing capability',
  optimization: 'Optimisation',
  debugging: 'Debugging',
};

export const AILabChallengeScreen: React.FC = () => {
  const { colors, spacing, radius } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'AILabChallenge'>>();
  const missionId = route.params.missionId;
  const mission = getMission(missionId);

  // Deterministic per-session seed — reproducible when passed via route params.
  const [seed] = useState(() => route.params.seed ?? Date.now());
  const challenges = useMemo(
    () => buildChallengeRun(missionId, seed, getRecentVariantKeys()),
    [missionId, seed],
  );

  // Remember which wordings were shown so they aren't repeated next time.
  useEffect(() => {
    if (challenges.length) pushRecentVariantKeys(challenges.map(c => c.variantKey));
  }, [challenges]);

  const [index, setIndex] = useState(0);
  const [arch, setArch] = useState(() =>
    withComponents(missionId, challenges[0]?.startComponents ?? []),
  );
  const [solved, setSolved] = useState(false);
  const [tried, setTried] = useState(false);

  const markChallengeSolved = useAILabStore(s => s.markChallengeSolved);
  const addRetry = useAILabStore(s => s.addRetry);

  const challenge = challenges[index];

  // Reset the workspace whenever we move to a new challenge.
  useEffect(() => {
    if (!challenge) return;
    setArch(withComponents(missionId, challenge.startComponents));
    setSolved(false);
    setTried(false);
  }, [index, challenge, missionId]);

  if (!mission || challenges.length === 0) {
    return (
      <Screen>
        <Header
          title="Challenges"
          onBack={() => navigation.goBack()}
        />
        <EmptyState
          icon="flag-outline"
          title="No challenges yet"
          message="This mission has no challenges available."
          actionLabel="Go back"
          onAction={() => navigation.goBack()}
        />
      </Screen>
    );
  }

  const add = (id: LabComponentId) => {
    setArch(a => addComponent(a, id));
    setTried(false);
  };
  const remove = (id: string) => {
    setArch(a => removeComponent(a, id as LabComponentId));
    setTried(false);
  };
  const onReorder = (next: string[]) => {
    setArch(a => reorder(a, next as LabComponentId[]));
    setTried(false);
  };

  const check = () => {
    if (isChallengeSolved(challenge, arch)) {
      setSolved(true);
      markChallengeSolved(missionId, challenge.id);
    } else {
      setTried(true);
      addRetry(missionId);
    }
  };

  const isLast = index === challenges.length - 1;
  const next = () => {
    if (isLast) navigation.goBack();
    else setIndex(i => i + 1);
  };

  return (
    <Screen scroll contentContainerStyle={{ gap: spacing.lg }}>
      <Header
        title={mission.title}
        subtitle={`Challenge ${index + 1} of ${challenges.length}`}
        onBack={() => navigation.goBack()}
      />

      <ProgressBar progress={(index + (solved ? 1 : 0)) / challenges.length} />

      {/* Scenario */}
      <Card elevation="md">
        <View style={[styles.badgeRow, { gap: spacing.sm }]}>
          <View
            style={[
              styles.pill,
              { backgroundColor: colors.warning + '22', borderRadius: radius.pill },
            ]}
          >
            <Icon name="warning" size={12} color={colors.warning} />
            <Text variant="caption" style={{ color: colors.warning }}>
              {' '}
              {TYPE_LABEL[challenge.type]}
            </Text>
          </View>
        </View>
        <Text variant="bodyStrong" style={{ marginTop: spacing.sm }}>
          🚨 {challenge.prompt}
        </Text>
        {!solved && (
          <Text variant="caption" color="textSecondary" style={{ marginTop: spacing.xs }}>
            💡 {challenge.hint}
          </Text>
        )}
      </Card>

      {/* Fix surface */}
      {challenge.options.length > 0 && !solved && (
        <View style={{ gap: spacing.sm }}>
          <Text variant="label" color="textSecondary">
            ADD A COMPONENT
          </Text>
          <ComponentTray
            pool={challenge.options}
            placed={arch.components}
            onAdd={add}
          />
        </View>
      )}

      <View style={{ gap: spacing.sm }}>
        <Text variant="label" color="textSecondary">
          YOUR PIPELINE
        </Text>
        <DraggableList
          items={arch.components}
          onChange={onReorder}
          onRemove={remove}
          connector
          disabled={solved}
          labelFor={id => getComponent(id as LabComponentId).label}
          iconFor={id => getComponent(id as LabComponentId).icon}
        />
      </View>

      {tried && !solved && (
        <Card elevation="sm" style={{ borderColor: colors.error }}>
          <Text variant="body" color="error">
            Not quite yet — {challenge.hint.toLowerCase()}
          </Text>
        </Card>
      )}

      {solved ? (
        <Card elevation="md" style={{ borderColor: colors.success }}>
          <Text variant="h3" color="success">
            🎉 Problem solved!
          </Text>
          <Text variant="body" style={{ marginTop: spacing.xs }}>
            {challenge.success}
          </Text>
          <Button
            label={isLast ? 'Finish challenges' : 'Next challenge'}
            onPress={next}
            fullWidth
            style={{ marginTop: spacing.md }}
            right={<Icon name="arrow-forward" size={18} color={colors.onPrimary} />}
          />
        </Card>
      ) : (
        <Button label="Check my fix" onPress={check} fullWidth />
      )}

      {solved && <Confetti />}
    </Screen>
  );
};

const styles = StyleSheet.create({
  badgeRow: { flexDirection: 'row', alignItems: 'center' },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
});

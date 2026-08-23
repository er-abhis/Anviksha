import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  Button,
  GlassCard,
  DraggableList,
  Header,
  IconButton,
  Screen,
  Text,
} from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { useAILabStore } from '../../../store';
import { RootStackParamList } from '../../../navigation/types';
import { LAB_COMPONENT_LIST, getComponent } from '../data/components';
import { LabComponentId } from '../types';
import { ComponentTray } from '../components/ComponentTray';
import { ValidationPanel } from '../components/ValidationPanel';
import { SimulationPanel } from '../components/SimulationPanel';
import { withComponents } from '../builder/architecture';
import { builderLevelForXp } from '../scoring/score';
import {
  FREE_CATEGORIES,
  FreeCategory,
  categoryFromMissionId,
  freeMissionId,
  getCategory,
} from '../freebuild/categories';
import { freeBuildFeedback } from '../freebuild/validate';

const PALETTE = LAB_COMPONENT_LIST.map(c => c.id);

export const AILabFreeBuildScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'AILabFreeBuild'>>();

  const initProject = route.params?.projectId
    ? useAILabStore.getState().projects[route.params.projectId]
    : undefined;
  const initCategory = initProject
    ? getCategory(categoryFromMissionId(initProject.missionId) ?? 'custom')
    : getCategory(route.params?.category ?? '');

  const [category, setCategory] = useState<FreeCategory | null>(
    initCategory ?? null,
  );
  const [components, setComponents] = useState<LabComponentId[]>(
    initProject?.components ?? [],
  );
  const [projectId, setProjectId] = useState(route.params?.projectId);
  const [projectName] = useState(initProject?.name);
  const [justSaved, setJustSaved] = useState(false);

  const aiLabXp = useAILabStore(s => s.aiLabXp);
  const saveProject = useAILabStore(s => s.saveProject);

  const arch = useMemo(
    () =>
      withComponents(
        category ? freeMissionId(category.id) : 'free-custom',
        components,
      ),
    [category, components],
  );
  const feedback = useMemo(
    () => (category ? freeBuildFeedback(category, arch) : null),
    [category, arch],
  );

  const chooseCategory = (cat: FreeCategory) => {
    setCategory(cat);
    setComponents([]);
    setJustSaved(false);
  };

  const add = (id: LabComponentId) => {
    setComponents(c => (c.includes(id) ? c : [...c, id]));
    setJustSaved(false);
  };
  const remove = (id: string) => {
    setComponents(c => c.filter(x => x !== id));
    setJustSaved(false);
  };
  const onReorder = (next: string[]) => {
    setComponents(next as LabComponentId[]);
    setJustSaved(false);
  };

  const onSave = () => {
    if (!category) return;
    const id = saveProject({
      id: projectId,
      name: projectName ?? `${category.label} AI`,
      missionId: freeMissionId(category.id),
      components,
      connections: arch.connections,
      score: 0,
      level: builderLevelForXp(aiLabXp),
      completedChallenges: [],
    });
    setProjectId(id);
    setJustSaved(true);
  };

  // ── Category picker ────────────────────────────────────────
  if (!category) {
    return (
      <Screen scroll contentContainerStyle={{ gap: spacing.lg }}>
        <Header title="🧪 Free Build" onBack={() => navigation.goBack()} />
        <Text variant="body" color="textSecondary">
          Pick what you want to build, then assemble it from any components. The
          Lab will tell you what works and what could be better.
        </Text>
        <View style={[styles.grid, { gap: spacing.md }]}>
          {FREE_CATEGORIES.map((cat, i) => (
            <Animated.View
              key={cat.id}
              entering={FadeInDown.delay(i * 60).springify().damping(16)}
              style={styles.gridItem}
            >
              <GlassCard
                elevation="md"
                onPress={() => chooseCategory(cat)}
                accessibilityRole="button"
                accessibilityLabel={`${cat.label}: ${cat.description}`}
                style={styles.catCard}
              >
                <Text style={styles.catEmoji}>{cat.emoji}</Text>
                <Text variant="bodyStrong">{cat.label}</Text>
                <Text variant="caption" color="textSecondary" numberOfLines={2}>
                  {cat.description}
                </Text>
              </GlassCard>
            </Animated.View>
          ))}
        </View>
      </Screen>
    );
  }

  // ── Builder ────────────────────────────────────────────────
  return (
    <Screen scroll contentContainerStyle={{ gap: spacing.xl }}>
      <Header
        title="Free Build"
        subtitle={`${category.emoji} ${category.label} · Builder Lvl ${builderLevelForXp(aiLabXp)}`}
        onBack={() => navigation.goBack()}
        right={
          components.length > 0 ? (
            <IconButton
              name={justSaved ? 'checkmark-done' : 'save-outline'}
              onPress={onSave}
              accessibilityLabel="Save build"
              color={justSaved ? 'success' : 'primary'}
            />
          ) : undefined
        }
      />

      <Button
        label="Change category"
        variant="ghost"
        size="sm"
        left={<Icon name="swap-horizontal" size={16} color={colors.primary} />}
        onPress={() => setCategory(null)}
      />

      {/* Palette */}
      <View style={{ gap: spacing.sm }}>
        <Text variant="label" color="textSecondary">
          COMPONENTS
        </Text>
        <ComponentTray pool={PALETTE} placed={components} onAdd={add} />
      </View>

      {/* Workspace */}
      <View style={{ gap: spacing.sm }}>
        <Text variant="label" color="textSecondary">
          YOUR PIPELINE
        </Text>
        {components.length === 0 ? (
          <GlassCard elevation="sm" style={styles.dropHint}>
            <Icon name="add-circle-outline" size={26} color={colors.textTertiary} />
            <Text variant="caption" color="textTertiary" center>
              Add components above to start building your {category.label} AI.
            </Text>
          </GlassCard>
        ) : (
          <DraggableList
            items={components}
            onChange={onReorder}
            onRemove={remove}
            connector
            labelFor={id => getComponent(id as LabComponentId).label}
            iconFor={id => getComponent(id as LabComponentId).icon}
          />
        )}
      </View>

      {feedback && components.length > 0 && <ValidationPanel result={feedback} />}

      {components.length > 0 && <SimulationPanel architecture={arch} />}

      {feedback?.ok && (
        <Button
          label="Showcase & Share"
          onPress={() =>
            navigation.navigate('AILabShowcase', {
              title: `${category.label} AI`,
              emoji: category.emoji,
              components,
              score: 0,
              xpEarned: 0,
              challengesDone: 0,
              challengesTotal: 0,
              concept: category.description,
            })
          }
          fullWidth
          left={<Icon name="rocket" size={18} color={colors.onPrimary} />}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  gridItem: { width: '47%' },
  catCard: { gap: 4, minHeight: 110 },
  catEmoji: { fontSize: 28 },
  dropHint: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    gap: 8,
    borderStyle: 'dashed',
    borderWidth: 1,
  },
});

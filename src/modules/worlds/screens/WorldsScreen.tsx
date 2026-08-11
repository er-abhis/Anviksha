import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  Card,
  Gradient,
  Header,
  ProgressBar,
  Screen,
  Text,
} from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { RootStackParamList } from '../../../navigation/types';
import { useProgressStore } from '../../../store';
import {
  WORLDS,
  lessonsForWorld,
  worldProgress,
  worldSummary,
} from '../../../content';
import { Difficulty } from '../../../content/types';

const DIFFICULTY: Record<Difficulty, { label: string; icon: string }> = {
  beginner: { label: 'Beginner', icon: 'leaf-outline' },
  intermediate: { label: 'Intermediate', icon: 'trending-up-outline' },
  advanced: { label: 'Advanced', icon: 'flame-outline' },
};

export const WorldsScreen: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const completed = useProgressStore(s => s.completed);

  return (
    <Screen scroll contentContainerStyle={{ gap: spacing.md }}>
      <Header title="Explore topics" onBack={() => navigation.goBack()} />
      <Text variant="body" color="textSecondary">
        Every topic is open — pick any one and learn at your own pace.
      </Text>

      {[...WORLDS]
        .sort((a, b) => a.order - b.order)
        .map(world => {
          const lessons = lessonsForWorld(world.id);
          const summary = worldSummary(world.id);
          const progress = worldProgress(world.id, completed);
          const doneCount = lessons.filter(l => l.id in completed).length;
          const diff = DIFFICULTY[summary.difficulty];

          const state =
            doneCount === 0
              ? 'new'
              : doneCount >= lessons.length && lessons.length > 0
              ? 'done'
              : 'progress';
          const cta =
            state === 'new'
              ? 'Start Learning'
              : state === 'done'
              ? 'Revisit lessons'
              : 'Continue Learning';

          return (
            <Card
              key={world.id}
              elevation="sm"
              // Every world is open — no cross-world locks.
              onPress={() => navigation.navigate('WorldDetail', { worldId: world.id })}
            >
              <View style={[styles.row, { gap: spacing.md }]}>
                <Gradient colors={world.gradient} style={{ ...styles.badge, borderRadius: radius.md }}>
                  <Icon name={world.icon} size={24} color="#FFFFFF" />
                </Gradient>
                <View style={styles.flex}>
                  <View style={styles.titleRow}>
                    <Text variant="bodyStrong" style={styles.flex}>{world.title}</Text>
                    {state === 'done' && (
                      <View style={[styles.donePill, { backgroundColor: colors.success, borderRadius: radius.pill }]}>
                        <Icon name="checkmark" size={11} color="#FFFFFF" />
                        <Text variant="caption" color="textInverse">Completed</Text>
                      </View>
                    )}
                  </View>
                  <Text variant="caption" color="textSecondary" numberOfLines={2}>
                    {world.description || world.subtitle}
                  </Text>
                </View>
              </View>

              {lessons.length > 0 && (
                <>
                  <View style={styles.metaRow}>
                    <Meta icon={diff.icon} label={diff.label} />
                    <Meta icon="book-outline" label={`${summary.lessonCount} Lessons`} />
                    <Meta icon="time-outline" label={`${summary.minutes} min`} />
                    <Meta icon="star" label={`${summary.xp} XP`} />
                  </View>

                  <View style={{ marginTop: spacing.md, gap: spacing.xs }}>
                    <View style={styles.progressLabels}>
                      <Text variant="caption" color="textSecondary">
                        {state === 'done'
                          ? `Earned ${summary.xp} XP`
                          : state === 'new'
                          ? 'Not started'
                          : 'In progress'}
                      </Text>
                      <Text variant="caption" color="textSecondary">
                        {`${doneCount} / ${summary.lessonCount}`}
                      </Text>
                    </View>
                    <ProgressBar progress={progress} fillColor={state === 'done' ? 'success' : 'primary'} />
                  </View>
                </>
              )}

              <View style={[styles.ctaRow, { marginTop: spacing.md }]}>
                <Text variant="label" color="primary">{cta}</Text>
                <Icon name="arrow-forward" size={16} color={colors.primary} />
              </View>
            </Card>
          );
        })}
    </Screen>
  );
};

const Meta: React.FC<{ icon: string; label: string }> = ({ icon, label }) => {
  const { colors, radius, spacing } = useTheme();
  return (
    <View
      style={[
        styles.metaChip,
        { backgroundColor: colors.surfaceAlt, borderRadius: radius.pill, paddingHorizontal: spacing.sm },
      ]}
    >
      <Icon name={icon} size={12} color={colors.textSecondary} />
      <Text variant="caption" color="textSecondary">{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  flex: { flex: 1 },
  badge: { width: 52, height: 52, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  donePill: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 3 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 5 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  ctaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});

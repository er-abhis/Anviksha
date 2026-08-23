import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  Card,
  Header,
  Screen,
  SectionTitle,
  Text,
} from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { RootStackParamList } from '../../../navigation/types';
import { useProgressStore } from '../../../store';
import {
  Activity,
  LESSONS,
  WORLDS,
  isLessonUnlocked,
} from '../../../content';

/** How each activity kind presents as a "sim" in the launcher. */
const KIND_META: Record<Activity['kind'], { icon: string; tag: string }> = {
  sequence: { icon: 'git-commit-outline', tag: 'Predict' },
  bucket: { icon: 'file-tray-stacked-outline', tag: 'Sort' },
  slider: { icon: 'options-outline', tag: 'Tune' },
  steps: { icon: 'swap-vertical-outline', tag: 'Arrange' },
};

export const PlaygroundScreen: React.FC = () => {
  const { colors, spacing, radius } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const completed = useProgressStore(s => s.completed);

  const unlockedCount = LESSONS.filter(l => isLessonUnlocked(l, completed)).length;

  return (
    <Screen scroll contentContainerStyle={{ gap: spacing.xl, paddingBottom: tabBarHeight + spacing.lg }}>
      <Header title="Playground" large />

      <Text variant="body" color="textSecondary">
        Hands-on mini-sims for every idea in the course. Tap one to experiment —
        no scores, no pressure. {unlockedCount} unlocked so far.
      </Text>

      {/* Featured: Build the AI game */}
      <Card elevation="md" onPress={() => navigation.navigate('BuildAI')}>
        <View style={styles.simRow}>
          <View style={[styles.simIcon, { backgroundColor: colors.primaryMuted, borderRadius: radius.md }]}>
            <Icon name="construct" size={20} color={colors.primary} />
          </View>
          <View style={styles.flex}>
            <Text variant="bodyStrong">Build the AI</Text>
            <Text variant="caption" color="textSecondary">
              Assemble real AI architectures from components.
            </Text>
          </View>
          <Icon name="chevron-forward" size={18} color={colors.textTertiary} />
        </View>
      </Card>

      {/* Featured: What Would You Build? */}
      <Card elevation="md" onPress={() => navigation.navigate('WhatToBuild')}>
        <View style={styles.simRow}>
          <View style={[styles.simIcon, { backgroundColor: colors.primaryMuted, borderRadius: radius.md }]}>
            <Icon name="bulb" size={20} color={colors.primary} />
          </View>
          <View style={styles.flex}>
            <Text variant="bodyStrong">What Would You Build?</Text>
            <Text variant="caption" color="textSecondary">
              Pick components for a goal and reveal the AI stack.
            </Text>
          </View>
          <Icon name="chevron-forward" size={18} color={colors.textTertiary} />
        </View>
      </Card>

      {/* Quick actions */}
      <View style={[styles.quickRow, { gap: spacing.md }]}>
        <QuickCard
          icon="sparkles"
          label="Daily Challenge"
          onPress={() => navigation.navigate('DailyChallenge')}
        />
        <QuickCard
          icon="book"
          label="AI Glossary"
          onPress={() => navigation.navigate('Glossary')}
        />
      </View>

      {WORLDS.map(world => {
        const sims = LESSONS.filter(l => l.worldId === world.id);
        if (sims.length === 0) return null;
        return (
          <View key={world.id}>
            <SectionTitle title={world.title} />
            <View style={{ gap: spacing.sm }}>
              {sims.map(lesson => {
                const meta = KIND_META[lesson.activity.kind];
                const locked = !isLessonUnlocked(lesson, completed);
                return (
                  <Pressable
                    key={lesson.id}
                    disabled={locked}
                    accessibilityRole="button"
                    accessibilityLabel={`${lesson.activity.title}${locked ? ', locked' : ''}`}
                    onPress={() =>
                      navigation.navigate('Simulations', { lessonId: lesson.id })
                    }
                    style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
                  >
                    <Card elevation="sm">
                      <View style={styles.simRow}>
                        <View
                          style={[
                            styles.simIcon,
                            {
                              backgroundColor: locked
                                ? colors.surfaceAlt
                                : colors.primaryMuted,
                              borderRadius: radius.md,
                            },
                          ]}
                        >
                          <Icon
                            name={locked ? 'lock-closed' : meta.icon}
                            size={20}
                            color={locked ? colors.textTertiary : colors.primary}
                          />
                        </View>
                        <View style={styles.flex}>
                          <Text
                            variant="bodyStrong"
                            color={locked ? 'textTertiary' : 'text'}
                            numberOfLines={1}
                          >
                            {lesson.activity.title}
                          </Text>
                          <Text variant="caption" color="textSecondary" numberOfLines={1}>
                            {locked ? 'Locked · finish earlier lessons' : `${meta.tag} · ${lesson.title}`}
                          </Text>
                        </View>
                        {!locked && (
                          <Icon name="chevron-forward" size={18} color={colors.textTertiary} />
                        )}
                      </View>
                    </Card>
                  </Pressable>
                );
              })}
            </View>
          </View>
        );
      })}
    </Screen>
  );
};

const QuickCard: React.FC<{ icon: string; label: string; onPress: () => void }> = ({
  icon,
  label,
  onPress,
}) => {
  const { colors, radius } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.flex, { opacity: pressed ? 0.6 : 1 }]}
    >
      <Card elevation="sm">
        <View style={styles.quickInner}>
          <View style={[styles.quickIcon, { backgroundColor: colors.primaryMuted, borderRadius: radius.md }]}>
            <Icon name={icon} size={20} color={colors.primary} />
          </View>
          <Text variant="bodyStrong">{label}</Text>
        </View>
      </Card>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  quickRow: { flexDirection: 'row' },
  quickInner: { gap: 8 },
  quickIcon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  simRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  simIcon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
});

import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../theme/ThemeProvider';
import { useResponsive } from '../../../hooks/useResponsive';
import { CONTENT_MAX_WIDTH } from '../../../constants/layout';
import {
  EmptyState,
  IconButton,
  SectionTitle,
  Text,
  XPBadge,
} from '../../../components';
import { RootStackParamList } from '../../../navigation/types';
import { useAchievementsStore, useProgressStore } from '../../../store';
import {
  ACHIEVEMENTS,
  DAILY_CHALLENGE,
  currentWorld,
  firstAvailableLesson,
  todayISO,
  worldProgress,
} from '../../../content/curriculum';
import { ContinueCard } from '../components/ContinueCard';
import { DailyChallengeCard } from '../components/DailyChallengeCard';
import { CurrentWorldCard } from '../components/CurrentWorldCard';
import { AchievementChip } from '../components/AchievementChip';
import { ActivityRow } from '../components/ActivityRow';

export const HomeScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const { isTablet } = useResponsive();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { xp, coins, level, streakDays, completed, completedWorlds, activity } =
    useProgressStore();
  const dailyCompletedDate = useProgressStore(s => s.dailyCompletedDate);
  const unlocked = useAchievementsStore(s => s.unlocked);

  const world = currentWorld(completedWorlds);
  const lesson = firstAvailableLesson(completed, completedWorlds);
  const dailyDone = dailyCompletedDate === todayISO();

  const unlockedAchievements = ACHIEVEMENTS.filter(a => unlocked[a.slug]);

  const openLesson = () => {
    if (!lesson) return;
    navigation.navigate('ComingSoon', {
      title: lesson.title,
      message:
        'This lesson’s interactive content is coming soon. Your progress will be saved once it lands.',
    });
  };

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.fill, { backgroundColor: colors.background }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          {
            padding: spacing.lg,
            gap: spacing.xxl,
            paddingBottom: spacing.giant,
            width: '100%',
            alignSelf: 'center',
            maxWidth: isTablet ? CONTENT_MAX_WIDTH : undefined,
          },
        ]}
      >
        {/* Greeting + stats */}
        <View style={styles.headerRow}>
          <View style={styles.flex}>
            <Text variant="label" color="textSecondary">
              Welcome back
            </Text>
            <Text variant="h1">Ready to explore?</Text>
          </View>
          <IconButton
            name="notifications-outline"
            accessibilityLabel="Notifications"
            onPress={() =>
              navigation.navigate('ComingSoon', { title: 'Notifications' })
            }
          />
        </View>

        <View style={[styles.stats, { gap: spacing.sm }]}>
          <XPBadge value={xp} kind="xp" />
          <XPBadge value={coins} kind="coins" />
          <XPBadge value={streakDays} kind="streak" />
          <View style={styles.flex} />
          <View
            style={[styles.levelPill, { backgroundColor: colors.primaryMuted }]}
          >
            <Icon name="ribbon" size={15} color={colors.primary} />
            <Text variant="label" color="primary">
              {`Level ${level}`}
            </Text>
          </View>
        </View>

        {/* Continue Learning */}
        <View>
          <SectionTitle title="Continue Learning" />
          {lesson ? (
            <ContinueCard
              item={{
                id: lesson.id,
                title: lesson.title,
                worldTitle: world.title,
                progress: worldProgress(world.id, completed),
              }}
              onPress={openLesson}
            />
          ) : (
            <EmptyState
              icon="rocket-outline"
              title="Start your first lesson"
              message="Your learning journey begins here. Pick a world to dive in."
              actionLabel="Explore worlds"
              onAction={() => navigation.navigate('Worlds')}
            />
          )}
        </View>

        {/* Daily Challenge */}
        <View>
          <SectionTitle title="Daily Challenge" />
          <DailyChallengeCard
            data={{
              title: dailyDone ? 'Today’s challenge' : 'No challenge yet today',
              description: dailyDone
                ? 'Nice work — you’ve completed today’s challenge.'
                : DAILY_CHALLENGE.question,
              xpReward: DAILY_CHALLENGE.xpReward,
              completed: dailyDone,
            }}
            onStart={() => navigation.navigate('DailyChallenge')}
          />
        </View>

        {/* Current World */}
        <View>
          <SectionTitle
            title="Current World"
            actionLabel="View all"
            onAction={() => navigation.navigate('Worlds')}
          />
          <CurrentWorldCard
            data={{
              title: world.title,
              subtitle: world.subtitle,
              progress: worldProgress(world.id, completed),
              gradient: world.gradient,
              locked: false,
            }}
            onPress={() =>
              navigation.navigate('WorldDetail', { worldId: world.id })
            }
          />
        </View>

        {/* Achievements */}
        <View>
          <SectionTitle
            title="Achievements"
            actionLabel="See all"
            onAction={() =>
              navigation.navigate('Main', { screen: 'Achievements' })
            }
          />
          {unlockedAchievements.length === 0 ? (
            <EmptyState
              icon="trophy-outline"
              title="No achievements yet"
              message="Complete challenges and lessons to earn your first badge."
            />
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: spacing.md }}
            >
              {unlockedAchievements.map(a => (
                <AchievementChip
                  key={a.slug}
                  item={{
                    id: a.slug,
                    title: a.title,
                    icon: a.icon,
                    unlocked: true,
                  }}
                />
              ))}
            </ScrollView>
          )}
        </View>

        {/* Recent Activity */}
        <View>
          <SectionTitle title="Recent Activity" />
          {activity.length === 0 ? (
            <EmptyState
              icon="time-outline"
              title="No activity yet"
              message="Your completed challenges and lessons will show up here."
            />
          ) : (
            activity.map(a => (
              <ActivityRow
                key={a.id}
                item={{
                  id: a.id,
                  label: a.label,
                  detail: a.detail,
                  icon: a.icon,
                }}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  fill: { flex: 1 },
  flex: { flex: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  stats: { flexDirection: 'row', alignItems: 'center' },
  levelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
});

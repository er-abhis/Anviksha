import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { Card, Header, Screen, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { useAILabStore } from '../../../store';
import { RootStackParamList } from '../../../navigation/types';
import { MISSIONS, pickRandomMissionId } from '../data/missions';
import { builderLevelForXp, xpToNextLevel } from '../scoring/score';
import { MissionCard } from '../components/MissionCard';
import { SavedProjects } from '../components/SavedProjects';
import { categoryFromMissionId } from '../freebuild/categories';

export const AILabScreen: React.FC = () => {
  const { colors, spacing, radius } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const aiLabXp = useAILabStore(s => s.aiLabXp);
  const completedMap = useAILabStore(s => s.completed);
  const completedCount = Object.keys(completedMap).length;

  const openMission = (missionId: string) =>
    navigation.navigate('AILabMission', { missionId });

  return (
    <Screen
      scroll
      contentContainerStyle={{
        gap: spacing.lg,
        paddingBottom: tabBarHeight + spacing.lg,
      }}
    >
      <Header title="🧪 AI Lab" large />
      <Text variant="body" color="textSecondary">
        Build, experiment and learn how AI works. Pick a mission and assemble a
        working AI from the ground up.
      </Text>

      {/* AI Builder progress */}
      <Card elevation="sm">
        <View style={[styles.statsRow, { gap: spacing.md }]}>
          <View
            style={[
              styles.levelChip,
              { backgroundColor: colors.primaryMuted, borderRadius: radius.md },
            ]}
          >
            <Icon name="hardware-chip" size={18} color={colors.primary} />
            <Text variant="bodyStrong" color="primary">
              {' '}Lvl {builderLevelForXp(aiLabXp)}
            </Text>
          </View>
          <View style={styles.flex}>
            <Text variant="bodyStrong">AI Builder</Text>
            <Text variant="caption" color="textSecondary">
              {aiLabXp} XP · {completedCount}/{MISSIONS.length} missions built ·{' '}
              {xpToNextLevel(aiLabXp)} XP to next level
            </Text>
          </View>
        </View>
      </Card>

      {/* Surprise Me — playful entry that jumps into a random mission. */}
      <Pressable
        onPress={() => openMission(pickRandomMissionId())}
        accessibilityRole="button"
        accessibilityLabel="Surprise me — open a random mission"
        style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
      >
        <Card
          elevation="lg"
          padded={false}
          style={{ backgroundColor: colors.primary, overflow: 'hidden' }}
        >
          <View style={[styles.surpriseRow, { padding: spacing.lg, gap: spacing.md }]}>
            <View
              style={[
                styles.surpriseIcon,
                { backgroundColor: '#FFFFFF22', borderRadius: radius.md },
              ]}
            >
              <Text style={styles.surpriseEmoji}>🎲</Text>
            </View>
            <View style={styles.flex}>
              <Text variant="bodyStrong" style={{ color: colors.onPrimary }}>
                Surprise Me
              </Text>
              <Text variant="caption" style={{ color: colors.onPrimary, opacity: 0.85 }}>
                Not sure where to start? Get a random mission.
              </Text>
            </View>
            <Icon name="shuffle" size={22} color={colors.onPrimary} />
          </View>
        </Card>
      </Pressable>

      {/* Free Build entry. */}
      <Card
        elevation="md"
        onPress={() => navigation.navigate('AILabFreeBuild')}
        accessibilityRole="button"
        accessibilityLabel="Free Build — build any AI from scratch"
      >
        <View style={[styles.surpriseRow, { gap: spacing.md }]}>
          <View
            style={[
              styles.surpriseIcon,
              { backgroundColor: colors.accent + '22', borderRadius: radius.md },
            ]}
          >
            <Text style={styles.surpriseEmoji}>🧪</Text>
          </View>
          <View style={styles.flex}>
            <Text variant="bodyStrong">Free Build</Text>
            <Text variant="caption" color="textSecondary">
              No mission — pick a goal and build any AI you like.
            </Text>
          </View>
          <Icon name="chevron-forward" size={18} color={colors.textTertiary} />
        </View>
      </Card>

      {/* Saved builds — resume / rename / duplicate / delete. */}
      <SavedProjects
        onResume={p => {
          const cat = categoryFromMissionId(p.missionId);
          if (cat) {
            navigation.navigate('AILabFreeBuild', { category: cat, projectId: p.id });
          } else {
            navigation.navigate('AILabMission', {
              missionId: p.missionId,
              projectId: p.id,
            });
          }
        }}
      />

      <Text variant="label" color="textSecondary">
        {MISSIONS.length} MISSIONS
      </Text>

      <View style={{ gap: spacing.md }}>
        {MISSIONS.map(mission => (
          <MissionCard
            key={mission.id}
            mission={mission}
            completed={Boolean(completedMap[mission.id])}
            onPress={() => openMission(mission.id)}
          />
        ))}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  surpriseRow: { flexDirection: 'row', alignItems: 'center' },
  surpriseIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  surpriseEmoji: { fontSize: 24 },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  levelChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
});

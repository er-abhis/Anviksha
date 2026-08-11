import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  useNavigation,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  Card,
  EmptyState,
  Gradient,
  Header,
  Screen,
  Text,
} from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { RootStackParamList } from '../../../navigation/types';
import { useProgressStore } from '../../../store';
import { WORLDS, isLessonUnlocked, lessonsForWorld } from '../../../content';

export const WorldDetailScreen: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'WorldDetail'>>();
  const world = WORLDS.find(w => w.id === route.params.worldId);
  const completed = useProgressStore(s => s.completed);

  if (!world) {
    return (
      <Screen>
        <Header title="World" onBack={() => navigation.goBack()} />
        <EmptyState title="World not found" />
      </Screen>
    );
  }

  const lessons = lessonsForWorld(world.id);

  return (
    <Screen scroll contentContainerStyle={{ gap: spacing.lg }}>
      <Header title={world.title} onBack={() => navigation.goBack()} />

      <Gradient colors={world.gradient} style={{ borderRadius: radius.lg }}>
        <View style={{ padding: spacing.xl }}>
          <Icon name={world.icon} size={28} color="#FFFFFF" />
          <Text
            variant="h2"
            color="textInverse"
            style={{ marginTop: spacing.sm }}
          >
            {world.title}
          </Text>
          <Text variant="body" color="textInverse" style={styles.sub}>
            {world.description}
          </Text>
          {lessons.length > 0 && (
            <Text variant="label" color="textInverse" style={{ marginTop: spacing.md, opacity: 0.9 }}>
              {`${lessons.filter(l => l.id in completed).length} / ${lessons.length} lessons complete`}
            </Text>
          )}
        </View>
      </Gradient>

      <Text variant="h3">Lessons</Text>
      {lessons.length === 0 ? (
        <EmptyState
          icon="book-outline"
          title="No lessons here yet"
          message="Keep progressing through the earlier worlds to continue your journey."
        />
      ) : (
        lessons.map(lesson => {
          const done = lesson.id in completed;
          const unlocked = isLessonUnlocked(lesson, completed);
          const bg = done ? colors.success : unlocked ? colors.primaryMuted : colors.surfaceAlt;
          // Intro is always open; a locked lesson shows a book (readable), not a barrier.
          const iconName = done ? 'checkmark' : unlocked ? 'play' : 'book-outline';
          const iconColor = done ? '#FFFFFF' : unlocked ? colors.primary : colors.textSecondary;
          return (
            <Card
              key={lesson.id}
              elevation="sm"
              onPress={() => navigation.navigate('LessonIntro', { lessonId: lesson.id })}
            >
              <View style={[styles.row, { gap: spacing.md }]}>
                <View style={[styles.badge, { backgroundColor: bg, borderRadius: radius.sm }]}>
                  <Icon name={iconName} size={18} color={iconColor} />
                </View>
                <View style={styles.flex}>
                  <Text variant="bodyStrong">{`${lesson.order}. ${lesson.title}`}</Text>
                  <Text variant="caption" color="textSecondary">
                    {done
                      ? `Completed · ${lesson.estimatedMinutes} min`
                      : unlocked
                      ? `${lesson.estimatedMinutes} min · ${lesson.difficulty} · ${lesson.xp} XP`
                      : 'Complete the previous lesson to unlock — you’re one step away'}
                  </Text>
                </View>
                <Icon name="chevron-forward" size={18} color={colors.textTertiary} />
              </View>
            </Card>
          );
        })
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  flex: { flex: 1 },
  sub: { opacity: 0.9, marginTop: 4 },
  badge: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

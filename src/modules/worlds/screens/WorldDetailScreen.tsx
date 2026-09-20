import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import {
  useNavigation,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  EmptyState,
  GlassCard,
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
  const { colors, radius, spacing, gradients, elevation } = useTheme();
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

  const accentColor = world.gradient ? world.gradient[0] : colors.primary;

  return (
    <Screen scroll contentContainerStyle={{ gap: spacing.lg }}>
      <Header title={world.title} onBack={() => navigation.goBack()} />

      <Gradient
        colors={world.gradient ?? gradients.cool}
        style={{ borderRadius: radius.xl, ...elevation.glow, overflow: 'hidden' }}
      >
        <View style={{ padding: spacing.xl, gap: spacing.xs }}>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
            <Icon name={world.icon} size={26} color="#FFFFFF" />
          </View>
          <Text
            variant="h2"
            color="textInverse"
          >
            {world.title}
          </Text>
          <Text variant="body" color="textInverse" style={styles.sub}>
            {world.description}
          </Text>
          {lessons.length > 0 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.md, backgroundColor: 'rgba(0,0,0,0.22)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill, alignSelf: 'flex-start' }}>
              <Icon name="sparkles" size={14} color="#FFFFFF" />
              <Text variant="label" color="textInverse" style={{ opacity: 0.95, fontSize: 11 }}>
                {`${lessons.filter(l => l.id in completed).length} / ${lessons.length} lessons complete`}
              </Text>
            </View>
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
        lessons.map((lesson, i) => {
          const done = lesson.id in completed;
          const unlocked = isLessonUnlocked(lesson, completed);
          const bg = done ? colors.success : unlocked ? accentColor : colors.surfaceAlt;
          const iconName = done ? 'checkmark' : unlocked ? 'play' : 'book-outline';
          const iconColor = done ? '#FFFFFF' : unlocked ? '#FFFFFF' : colors.textSecondary;

          return (
            <Animated.View key={lesson.id}>
              <GlassCard
                elevation="glow"
                style={{
                  borderColor: done ? colors.success + '44' : unlocked ? accentColor + '44' : colors.border,
                  borderWidth: 1,
                  borderRadius: radius.lg,
                }}
                onPress={() => navigation.navigate('LessonIntro', { lessonId: lesson.id })}
              >
                <View style={[styles.row, { gap: spacing.md }]}>
                  <View style={[styles.badge, { backgroundColor: bg, borderRadius: radius.md }]}>
                    <Icon name={iconName} size={18} color={iconColor} />
                  </View>
                  <View style={styles.flex}>
                    <Text variant="bodyStrong">{`${lesson.order}. ${lesson.title}`}</Text>
                    <Text variant="caption" color="textSecondary" style={{ marginTop: 2 }}>
                      {done
                        ? `Completed · ${lesson.estimatedMinutes} min`
                        : unlocked
                        ? `${lesson.estimatedMinutes} min · ${lesson.difficulty} · +${lesson.xp} XP`
                        : 'Complete previous lesson to unlock'}
                    </Text>
                  </View>
                  <View style={{ backgroundColor: accentColor + '18', padding: 6, borderRadius: radius.pill }}>
                    <Icon name="chevron-forward" size={16} color={accentColor} />
                  </View>
                </View>
              </GlassCard>
            </Animated.View>
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

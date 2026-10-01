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
import { getLessonCompletionPercent, useProgressStore } from '../../../store';
import { WORLDS, lessonsForWorld } from '../../../content';

export const WorldDetailScreen: React.FC = () => {
  const { colors, radius, spacing, gradients, elevation } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'WorldDetail'>>();
  const world = WORLDS.find(w => w.id === route.params.worldId);
  const completed = useProgressStore(s => s.completed);
  const lessons = world ? lessonsForWorld(world.id) : [];
  const accentColor = world?.gradient ? world.gradient[0] : colors.primary;

  if (!world) {
    return (
      <Screen>
        <Header title="World" onBack={() => navigation.goBack()} />
        <EmptyState title="World not found" />
      </Screen>
    );
  }

  const lessonStepProgress = useProgressStore(s => s.lessonStepProgress);

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
          const pct = getLessonCompletionPercent(lesson.id, completed, lessonStepProgress);
          const bg = done ? colors.success : pct > 0 ? accentColor : colors.surfaceAlt;
          const iconName = done ? 'checkmark' : pct > 0 ? 'play' : 'book-outline';
          const iconColor = done ? '#FFFFFF' : pct > 0 ? '#FFFFFF' : colors.textSecondary;

          return (
            <Animated.View key={lesson.id}>
              <GlassCard
                elevation="glow"
                style={{
                  borderColor: done ? colors.success + '44' : pct > 0 ? accentColor + '44' : colors.border,
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
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text variant="bodyStrong" style={{ flex: 1 }}>{`${lesson.order}. ${lesson.title}`}</Text>
                      {pct > 0 && (
                        <View style={{ backgroundColor: done ? colors.success + '22' : accentColor + '22', paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill }}>
                          <Text variant="caption" style={{ color: done ? colors.success : accentColor, fontWeight: '700', fontSize: 10 }}>
                            {done ? '100% COMPLETE' : `${pct}% IN PROGRESS`}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text variant="caption" color="textSecondary" style={{ marginTop: 2 }}>
                      {done
                        ? `Completed · 100%`
                        : pct > 0
                        ? `${pct}% completed · Tap to resume`
                        : `${lesson.estimatedMinutes} min · ${lesson.difficulty} · +${lesson.xp} XP`}
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

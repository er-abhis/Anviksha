import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  Button,
  Card,
  EmptyState,
  Header,
  Screen,
  Text,
} from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { RootStackParamList } from '../../../navigation/types';
import { useProgressStore } from '../../../store';
import {
  blockingLesson,
  getLesson,
  getWorld,
  isLessonInteractiveUnlocked,
} from '../../../content';
import { ActivityRenderer } from '../components/ActivityRenderer';

/**
 * The interactive lesson — reached from the Introduction screen's "Start
 * learning". Intro/roadmap live in LessonIntroScreen; here we run the hands-on
 * activity and route into the quiz that awards XP and completes the chapter.
 */
export const LessonScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Lesson'>>();
  const lesson = getLesson(route.params.lessonId);
  const completed = useProgressStore(s => s.completed);

  if (!lesson) {
    return (
      <Screen>
        <Header title="Lesson" onBack={() => navigation.goBack()} />
        <EmptyState title="Lesson not found" />
      </Screen>
    );
  }

  const world = getWorld(lesson.worldId);
  const isDone = lesson.id in completed;

  // Defensive: the intro screen gates entry, but never trust the caller.
  if (!isLessonInteractiveUnlocked(lesson, completed)) {
    const blocker = blockingLesson(lesson, completed);
    return (
      <Screen>
        <Header title={lesson.title} onBack={() => navigation.goBack()} />
        <EmptyState
          icon="lock-closed"
          title="Interactive experience locked"
          message={
            blocker
              ? `Complete Chapter ${blocker.order} — “${blocker.title}” — to unlock this.`
              : 'Complete the previous chapter to unlock this.'
          }
          actionLabel="View introduction"
          onAction={() => navigation.replace('LessonIntro', { lessonId: lesson.id })}
        />
      </Screen>
    );
  }

  return (
    <Screen scroll contentContainerStyle={{ gap: spacing.xl }}>
      <Header
        title={world?.title ?? 'Lesson'}
        subtitle={`Chapter ${lesson.order} · ${lesson.title}`}
        onBack={() => navigation.goBack()}
      />

      {isDone && (
        <View style={styles.doneRow}>
          <Icon name="checkmark-circle" size={16} color={colors.success} />
          <Text variant="label" color="success">Completed</Text>
        </View>
      )}

      <Section icon="flask-outline" title="Try it yourself">
        <ActivityRenderer activity={lesson.activity} />
      </Section>

      {!!lesson.commonMistakes?.length && (
        <Section icon="warning-outline" title="Common mistakes">
          <Card elevation="sm">
            <View style={{ gap: spacing.sm }}>
              {lesson.commonMistakes.map(m => (
                <View key={m} style={styles.bullet}>
                  <Icon name="alert-circle" size={15} color={colors.warning} style={{ marginTop: 3 }} />
                  <Text variant="body" style={styles.flex}>{m}</Text>
                </View>
              ))}
            </View>
          </Card>
        </Section>
      )}

      <Section icon="key-outline" title="Key takeaways">
        <Card elevation="sm">
          <View style={{ gap: spacing.sm }}>
            {lesson.keyTakeaways.map(k => (
              <View key={k} style={styles.bullet}>
                <Icon name="checkmark" size={15} color={colors.success} style={{ marginTop: 3 }} />
                <Text variant="body" style={styles.flex}>{k}</Text>
              </View>
            ))}
          </View>
        </Card>
      </Section>

      <View style={{ gap: spacing.sm }}>
        <Button
          label={isDone ? 'Retake quiz' : 'Take the quiz'}
          variant={isDone ? 'secondary' : 'primary'}
          onPress={() => navigation.navigate('Quiz', { lessonId: lesson.id })}
          right={
            <Icon
              name="arrow-forward"
              size={18}
              color={isDone ? colors.text : colors.onPrimary}
            />
          }
        />
        {isDone && lesson.nextLessonId && (
          <Button
            label="Next chapter"
            onPress={() => navigation.replace('LessonIntro', { lessonId: lesson.nextLessonId! })}
            right={<Icon name="arrow-forward" size={18} color={colors.onPrimary} />}
          />
        )}
        <Text variant="caption" color="textTertiary" center>
          Score 70% or higher to {isDone ? 'keep' : 'earn'} {lesson.xp} XP and complete the chapter.
        </Text>
      </View>
    </Screen>
  );
};

const Section: React.FC<{ icon: string; title: string; children: React.ReactNode }> = ({
  icon,
  title,
  children,
}) => {
  const { colors, spacing } = useTheme();
  return (
    <View style={{ gap: spacing.sm }}>
      <View style={styles.sectionHead}>
        <Icon name={icon} size={16} color={colors.primary} />
        <Text variant="label" color="primary">{title.toUpperCase()}</Text>
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  doneRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  bullet: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
});

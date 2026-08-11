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
import { getLesson, getWorld, isLessonUnlocked } from '../../../content';
import { ActivityRenderer } from '../components/ActivityRenderer';

export const LessonScreen: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
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
  const locked = !isLessonUnlocked(lesson, completed);

  if (locked) {
    return (
      <Screen>
        <Header title={lesson.title} onBack={() => navigation.goBack()} />
        <EmptyState
          icon="lock-closed"
          title="Lesson locked"
          message="Complete the previous lesson to unlock this one."
          actionLabel="Back"
          onAction={() => navigation.goBack()}
        />
      </Screen>
    );
  }

  const meta = [
    { icon: 'speedometer-outline', label: lesson.difficulty },
    { icon: 'time-outline', label: `${lesson.estimatedMinutes} min` },
    { icon: 'flash', label: `${lesson.xp} XP` },
    { icon: 'server', label: `${lesson.coins}` },
  ];

  return (
    <Screen scroll contentContainerStyle={{ gap: spacing.xl }}>
      <Header
        title={world?.title ?? 'Lesson'}
        subtitle={`Lesson ${lesson.order}`}
        onBack={() => navigation.goBack()}
      />

      <View style={{ gap: spacing.sm }}>
        <Text variant="h1">{lesson.title}</Text>
        <Text variant="body" color="textSecondary">{lesson.subtitle}</Text>
        <View style={styles.metaRow}>
          {meta.map(m => (
            <View key={m.label} style={[styles.metaChip, { backgroundColor: colors.surfaceAlt, borderRadius: radius.pill }]}>
              <Icon name={m.icon} size={13} color={colors.textSecondary} />
              <Text variant="caption" color="textSecondary">{m.label}</Text>
            </View>
          ))}
        </View>
        {isDone && (
          <View style={styles.doneRow}>
            <Icon name="checkmark-circle" size={16} color={colors.success} />
            <Text variant="label" color="success">Completed</Text>
          </View>
        )}
      </View>

      <Section icon="bulb-outline" title="Introduction">
        <Text variant="body" color="textSecondary">{lesson.description}</Text>
      </Section>

      <Section icon="earth-outline" title="In the real world">
        <Card elevation="sm">
          <Text variant="body">{lesson.realWorld}</Text>
        </Card>
      </Section>

      <Section icon="list-outline" title="You’ll learn to">
        <View style={{ gap: spacing.sm }}>
          {lesson.objectives.map(o => (
            <View key={o} style={styles.bullet}>
              <Icon name="ellipse" size={7} color={colors.primary} style={{ marginTop: 7 }} />
              <Text variant="body" style={styles.flex}>{o}</Text>
            </View>
          ))}
        </View>
      </Section>

      <Section icon="flask-outline" title="Try it yourself">
        <ActivityRenderer activity={lesson.activity} />
      </Section>

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
            label="Next lesson"
            onPress={() => navigation.push('Lesson', { lessonId: lesson.nextLessonId! })}
            right={<Icon name="arrow-forward" size={18} color={colors.onPrimary} />}
          />
        )}
        <Text variant="caption" color="textTertiary" center>
          Score 70% or higher to {isDone ? 'keep' : 'earn'} {lesson.xp} XP and complete the lesson.
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
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5 },
  doneRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  bullet: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
});

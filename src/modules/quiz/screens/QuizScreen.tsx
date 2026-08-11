import React, { useState } from 'react';
import { View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { EmptyState, Header, Screen } from '../../../components';
import { RootStackParamList } from '../../../navigation/types';
import { useAchievementsStore, useProgressStore } from '../../../store';
import {
  PASS_THRESHOLD,
  getLesson,
  isWorldComplete,
  quizForLesson,
  worldCompleteBadge,
} from '../../../content';
import { QuizResult, QuizSession } from '../../learn/components/QuizSession';

export const QuizScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Quiz'>>();
  const lesson = getLesson(route.params.lessonId);

  const [attempt, setAttempt] = useState(0);
  const [questions, setQuestions] = useState(() =>
    lesson ? quizForLesson(lesson.id) : [],
  );

  const store = useProgressStore();
  const unlock = useAchievementsStore(s => s.unlock);

  if (!lesson) {
    return (
      <Screen>
        <Header title="Quiz" onBack={() => navigation.goBack()} />
        <EmptyState title="Quiz not found" />
      </Screen>
    );
  }

  const onComplete = (r: QuizResult) => {
    if (!r.passed) return;
    const alreadyDone = lesson.id in store.completed;
    const score = Math.round(r.accuracy * 100);
    store.markCompleted(lesson.id, score);

    const at = Date.now();
    if (!alreadyDone) {
      store.addXp(lesson.xp);
      store.addCoins(lesson.coins);
      unlock('first-lesson', at);
      store.logActivity({
        label: `Completed “${lesson.title}”`,
        detail: `+${lesson.xp} XP`,
        icon: 'checkmark-circle',
        at,
      });

      // World completion (compute against the just-updated map).
      const completedNow = { ...store.completed, [lesson.id]: score };
      if (isWorldComplete(lesson.worldId, completedNow)) {
        store.completeWorld(lesson.worldId);
        unlock(worldCompleteBadge(lesson.worldId), at);
        store.logActivity({
          label: 'Completed a world 🎉',
          detail: 'New world unlocked',
          icon: 'planet',
          at: at + 1,
        });
      }
    }
    if (r.accuracy === 1) unlock('quiz-ace', at);
  };

  const retry = () => {
    setQuestions(quizForLesson(lesson.id));
    setAttempt(a => a + 1);
  };

  return (
    <Screen padded={false} edges={['top']}>
      <Header title={lesson.title} onBack={() => navigation.goBack()} />
      <View style={{ flex: 1 }}>
        <QuizSession
          key={attempt}
          questions={questions}
          passThreshold={PASS_THRESHOLD}
          computeReward={() => ({ xp: lesson.xp, coins: lesson.coins })}
          onComplete={onComplete}
          onExit={() => navigation.goBack()}
          onRetry={retry}
        />
      </View>
    </Screen>
  );
};

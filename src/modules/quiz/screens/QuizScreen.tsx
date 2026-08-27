import React, { useState } from 'react';
import { View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { EmptyState, Header, Screen } from '../../../components';
import { RootStackParamList } from '../../../navigation/types';
import { useAchievementsStore, useProgressStore } from '../../../store';
import {
  PASS_THRESHOLD,
  WORLDS,
  getLesson,
  isWorldComplete,
  lessonsForWorld,
  quizForLesson,
  worldCompleteBadge,
} from '../../../content';
import {
  CompletionInfo,
  QuizResult,
  QuizSession,
} from '../../learn/components/QuizSession';
import { buildAchievementMessage } from '../../../utils/appLinks';
import { getRecentQuestionIds, pushRecentQuestionIds } from '../../../utils/quizHistory';

/** Draw a quiz that avoids recently-seen questions, then record what was shown. */
const loadQuiz = (lessonId: string) => {
  const qs = quizForLesson(lessonId, 8, getRecentQuestionIds());
  pushRecentQuestionIds(qs.map(q => q.id));
  return qs;
};

export const QuizScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Quiz'>>();
  const lesson = getLesson(route.params.lessonId);

  const [attempt, setAttempt] = useState(0);
  const [questions, setQuestions] = useState(() =>
    lesson ? loadQuiz(lesson.id) : [],
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
    setQuestions(loadQuiz(lesson.id));
    setAttempt(a => a + 1);
  };

  /**
   * "What's next" after a pass, derived entirely from the lesson/world data:
   *  - another chapter in this world  → Next chapter
   *  - last chapter of this world      → Next world
   *  - last chapter of the last world  → Explore worlds
   */
  const buildCompletion = (): CompletionInfo => {
    const learned = lesson.keyTakeaways.slice(0, 4);
    const shareMessage = buildAchievementMessage(lesson);
    const siblings = lessonsForWorld(lesson.worldId);
    const idx = siblings.findIndex(l => l.id === lesson.id);
    const nextChapter = siblings[idx + 1];
    if (nextChapter) {
      return {
        title: lesson.title,
        learned,
        shareMessage,
        primary: {
          label: 'Next chapter',
          onPress: () => navigation.replace('LessonIntro', { lessonId: nextChapter.id }),
        },
        secondary: {
          label: 'View chapters',
          onPress: () => navigation.replace('WorldDetail', { worldId: lesson.worldId }),
        },
      };
    }

    const worldsOrdered = [...WORLDS].sort((a, b) => a.order - b.order);
    const wIdx = worldsOrdered.findIndex(w => w.id === lesson.worldId);
    const nextWorld = worldsOrdered[wIdx + 1];
    if (nextWorld) {
      return {
        title: lesson.title,
        learned,
        shareMessage,
        primary: {
          label: 'Next world',
          onPress: () => navigation.replace('WorldDetail', { worldId: nextWorld.id }),
        },
        secondary: {
          label: 'View all worlds',
          onPress: () => navigation.replace('Worlds'),
        },
      };
    }

    return {
      title: lesson.title,
      learned,
      primary: {
        label: 'Explore worlds',
        onPress: () => navigation.replace('Worlds'),
      },
      secondary: {
        label: 'Review progress',
        onPress: () => navigation.navigate('Main', { screen: 'Profile' }),
      },
    };
  };

  return (
    <Screen padded={false} edges={['top']}>
      <Header title={lesson.title} onBack={() => navigation.goBack()} gutter />
      <View style={{ flex: 1 }}>
        <QuizSession
          key={attempt}
          questions={questions}
          passThreshold={PASS_THRESHOLD}
          computeReward={() => ({ xp: lesson.xp, coins: lesson.coins })}
          onComplete={onComplete}
          onExit={() => navigation.goBack()}
          onRetry={retry}
          completion={buildCompletion()}
        />
      </View>
    </Screen>
  );
};

import { kv } from '../storage/mmkv';

/**
 * Recent-question history — a small ring buffer of the question ids the learner
 * has seen recently, across lessons. `quizForLesson` uses it to avoid repeating
 * questions until a lesson's pool is exhausted. Kept deliberately small so old
 * questions become eligible again after a few quizzes.
 */
const KEY = 'quiz.recentQuestionIds';
const MAX = 60; // ~ several quizzes' worth of memory

export const getRecentQuestionIds = (): string[] => {
  try {
    const parsed = JSON.parse(kv.getString(KEY, '[]'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/** Record newly-shown ids at the front, capped to MAX (newest wins). */
export const pushRecentQuestionIds = (ids: string[]): void => {
  const merged = [...ids, ...getRecentQuestionIds()].slice(0, MAX);
  kv.setString(KEY, JSON.stringify(merged));
};

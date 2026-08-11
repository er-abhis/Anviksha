import {
  LESSONS,
  QUESTIONS,
  WORLDS,
  PASS_THRESHOLD,
  blockingLesson,
  buildDailyChallenge,
  firstAvailableLesson,
  isLessonInteractiveUnlocked,
  isWorldComplete,
  isWorldUnlocked,
  lessonsForWorld,
  questionsForWorld,
} from '../index';
import { ChoiceQuestion } from '../types';

describe('content integrity', () => {
  it('has unique question ids', () => {
    const ids = QUESTIONS.map(q => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has unique lesson ids and valid nextLessonId chains', () => {
    const ids = new Set(LESSONS.map(l => l.id));
    expect(ids.size).toBe(LESSONS.length);
    for (const l of LESSONS) {
      if (l.nextLessonId) expect(ids.has(l.nextLessonId)).toBe(true);
    }
  });

  it('choice questions have an in-range correct answer', () => {
    for (const q of QUESTIONS) {
      if ('options' in q) {
        const c = q as ChoiceQuestion;
        expect(c.options.length).toBeGreaterThanOrEqual(2);
        expect(c.correctIndex).toBeGreaterThanOrEqual(0);
        expect(c.correctIndex).toBeLessThan(c.options.length);
      }
    }
  });

  it('authored worlds carry a substantial question bank', () => {
    for (const w of WORLDS) {
      if (lessonsForWorld(w.id).length > 0) {
        expect(questionsForWorld(w.id).length).toBeGreaterThanOrEqual(60);
      }
    }
  });

  it('every world has authored lessons (no empty worlds)', () => {
    for (const w of WORLDS) {
      expect(lessonsForWorld(w.id).length).toBeGreaterThan(0);
    }
  });

  it('every lesson has at least 5 questions for its quiz', () => {
    for (const l of LESSONS) {
      const n = QUESTIONS.filter(q => q.lessonId === l.id).length;
      expect(n).toBeGreaterThanOrEqual(5);
    }
  });
});

describe('progression', () => {
  it('locks everything past world 1 for a fresh user', () => {
    const completed = {};
    expect(isWorldUnlocked(WORLDS[0], completed)).toBe(true);
    expect(isWorldUnlocked(WORLDS[1], completed)).toBe(false);
    expect(firstAvailableLesson(completed)?.id).toBe(lessonsForWorld(WORLDS[0].id)[0].id);
  });

  it('gates lesson 2 interactive until lesson 1 is done, and names the blocker', () => {
    const w1 = lessonsForWorld(WORLDS[0].id);
    const [first, second] = w1;
    // Fresh user: lesson 1 open, lesson 2 interactive locked -> blocker is lesson 1.
    expect(isLessonInteractiveUnlocked(first, {})).toBe(true);
    expect(isLessonInteractiveUnlocked(second, {})).toBe(false);
    expect(blockingLesson(second, {})?.id).toBe(first.id);
    // After finishing lesson 1, lesson 2 unlocks and has no blocker.
    const done = { [first.id]: 100 };
    expect(isLessonInteractiveUnlocked(second, done)).toBe(true);
    expect(blockingLesson(second, done)).toBeUndefined();
  });

  it('unlocks the next world only when the previous is fully complete', () => {
    const w1 = lessonsForWorld(WORLDS[0].id);
    const completed: Record<string, number> = {};
    w1.forEach(l => (completed[l.id] = 100));
    expect(isWorldComplete(WORLDS[0].id, completed)).toBe(true);
    expect(isWorldUnlocked(WORLDS[1], completed)).toBe(true);
  });
});

describe('daily challenge', () => {
  it('is deterministic per date and sized 5–15', () => {
    const a = buildDailyChallenge('2026-08-10', {});
    const b = buildDailyChallenge('2026-08-10', {});
    expect(a.questionIds).toEqual(b.questionIds);
    expect(a.questionIds.length).toBeGreaterThanOrEqual(5);
    expect(a.questionIds.length).toBeLessThanOrEqual(15);
  });

  it('varies across dates', () => {
    const a = buildDailyChallenge('2026-08-10', {});
    const b = buildDailyChallenge('2026-09-01', {});
    expect(a.questionIds).not.toEqual(b.questionIds);
  });
});

it('requires 70% to pass', () => {
  expect(PASS_THRESHOLD).toBeCloseTo(0.7);
});

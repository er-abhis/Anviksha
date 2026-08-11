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
  it('opens every world from the start (independent topics)', () => {
    const completed = {};
    for (const w of WORLDS) expect(isWorldUnlocked(w, completed)).toBe(true);
    expect(firstAvailableLesson(completed)?.id).toBe(lessonsForWorld(WORLDS[0].id)[0].id);
  });

  it('every world exposes lesson 1 without touching any other world', () => {
    // Nothing completed anywhere → lesson 1 of each world is playable,
    // lesson 2 of each world is not.
    for (const w of WORLDS) {
      const ls = lessonsForWorld(w.id);
      expect(isLessonInteractiveUnlocked(ls[0], {})).toBe(true);
      if (ls[1]) expect(isLessonInteractiveUnlocked(ls[1], {})).toBe(false);
    }
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

  it('progress in one world never unlocks lessons in another', () => {
    // Complete ALL of world 1 — world 2's lesson 2 must still be locked.
    const completed: Record<string, number> = {};
    lessonsForWorld(WORLDS[0].id).forEach(l => (completed[l.id] = 100));
    expect(isWorldComplete(WORLDS[0].id, completed)).toBe(true);
    const w2 = lessonsForWorld(WORLDS[1].id);
    expect(isLessonInteractiveUnlocked(w2[0], completed)).toBe(true);
    if (w2[1]) expect(isLessonInteractiveUnlocked(w2[1], completed)).toBe(false);
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

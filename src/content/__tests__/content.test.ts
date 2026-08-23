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
  quizForLesson,
  varyQuestion,
  dailySpotlight,
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

describe('quiz variation (Phase 5)', () => {
  it('shuffling a choice question keeps the correct answer correct', () => {
    const choice = QUESTIONS.find(
      q => q.type === 'multiple-choice',
    ) as ChoiceQuestion;
    const originalAnswer = choice.options[choice.correctIndex];
    for (let seed = 1; seed <= 20; seed++) {
      const v = varyQuestion(choice, seed) as ChoiceQuestion;
      // Same options (a permutation) and the answer still points at the right text.
      expect([...v.options].sort()).toEqual([...choice.options].sort());
      expect(v.options[v.correctIndex]).toBe(originalAnswer);
    }
  });

  it('true/false questions keep their natural order', () => {
    const tf = QUESTIONS.find(q => q.type === 'true-false') as ChoiceQuestion;
    const v = varyQuestion(tf, 7) as ChoiceQuestion;
    expect(v.options).toEqual(tf.options);
    expect(v.correctIndex).toBe(tf.correctIndex);
  });

  it('prefers questions not in the recent history', () => {
    const lesson = LESSONS[0];
    const pool = QUESTIONS.filter(q => q.lessonId === lesson.id).map(q => q.id);
    const recent = pool.slice(0, pool.length - 3); // only 3 left "fresh"
    const picked = quizForLesson(lesson.id, 3, recent).map(q => q.id);
    const freshIds = pool.filter(id => !recent.includes(id));
    // With exactly 3 fresh and count 3, all picks must be the fresh ones.
    expect(new Set(picked)).toEqual(new Set(freshIds));
  });
});

describe('question media (Phase 6)', () => {
  it('attaches concept icons only where a concept clearly matches', () => {
    const withMedia = QUESTIONS.filter(q => q.media);
    // Some questions get an icon, but not (nearly) all — it must stay selective.
    expect(withMedia.length).toBeGreaterThan(0);
    expect(withMedia.length).toBeLessThan(QUESTIONS.length);
    // Every attached media has an icon + non-empty alt text (accessibility).
    for (const q of withMedia) {
      expect(q.media!.icon).toBeTruthy();
      expect(q.media!.alt.length).toBeGreaterThan(0);
    }
  });
});

describe('daily spotlight (Phase 8)', () => {
  it('is deterministic per date', () => {
    const a = dailySpotlight('2026-08-23', {});
    const b = dailySpotlight('2026-08-23', {});
    expect(a).toEqual(b);
    expect(a.title.length).toBeGreaterThan(0);
  });

  it('rotates content across a run of dates', () => {
    const kinds = new Set<string>();
    for (let d = 1; d <= 20; d++) {
      const iso = `2026-09-${String(d).padStart(2, '0')}`;
      kinds.add(dailySpotlight(iso, {}).kind);
    }
    // Over 20 days it should surface more than one kind of spotlight.
    expect(kinds.size).toBeGreaterThan(1);
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

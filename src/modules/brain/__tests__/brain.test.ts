import {
  DEFAULT_WEIGHTS,
  forwardPass,
  splitResult,
  tokenStats,
  tokenize,
  trainingCurves,
} from '../logic';
import { CASES, SIMS, missionForDay } from '../data';

describe('tokenizer', () => {
  it('splits long words into sub-word pieces (more tokens than words)', () => {
    const { tokenCount, words } = tokenStats('antidisestablishmentarianism rocks');
    expect(words).toBe(2);
    expect(tokenCount).toBeGreaterThan(words);
  });
  it('is deterministic', () => {
    expect(tokenize('hello world')).toEqual(tokenize('hello world'));
  });
  it('treats punctuation as its own token', () => {
    expect(tokenStats('hi!').tokenCount).toBe(2);
  });
});

describe('neural net forward pass', () => {
  it('is bounded 0..1 and deterministic', () => {
    const { output, hidden } = forwardPass(1, 0, DEFAULT_WEIGHTS);
    expect(output).toBeGreaterThanOrEqual(0);
    expect(output).toBeLessThanOrEqual(1);
    expect(hidden).toHaveLength(2);
    expect(forwardPass(0.5, 0.5)).toEqual(forwardPass(0.5, 0.5));
  });
});

describe('decision tree split', () => {
  it('finds a near-perfect split on sweetness', () => {
    const r = splitResult(0, 5);
    expect(r.accuracy).toBeGreaterThan(0.8);
    expect(r.predictions).toHaveLength(8);
  });
  it('accuracy stays within 0..1', () => {
    for (let t = 1; t <= 9; t++) {
      const r = splitResult(1, t);
      expect(r.accuracy).toBeGreaterThanOrEqual(0);
      expect(r.accuracy).toBeLessThanOrEqual(1);
    }
  });
});

describe('training curves', () => {
  it('low complexity underfits', () => {
    expect(trainingCurves({ complexity: 1, noise: 0, epochs: 30 }).verdict).toBe('Underfitting');
  });
  it('high complexity + noise overfits (train beats validation)', () => {
    const r = trainingCurves({ complexity: 10, noise: 0.8, epochs: 40 });
    expect(r.verdict).toBe('Overfitting');
    expect(r.train[r.train.length - 1]).toBeGreaterThan(r.val[r.val.length - 1]);
  });
  it('returns one point per epoch', () => {
    expect(trainingCurves({ complexity: 5, noise: 0.2, epochs: 20 }).train).toHaveLength(20);
  });
});

describe('content + missions', () => {
  it('every detective case has a valid answer index', () => {
    CASES.forEach(c => {
      expect(c.options[c.answerIndex]).toBeDefined();
      expect(c.why.length).toBeGreaterThan(10);
    });
  });
  it('mission selection is deterministic per date', () => {
    expect(missionForDay('2026-09-11')).toEqual(missionForDay('2026-09-11'));
  });
  it('has at least 8 interactive experiences', () => {
    expect(SIMS.length + CASES.length).toBeGreaterThanOrEqual(8);
  });
});

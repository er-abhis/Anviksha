import {
  ATTENTION_PRESETS,
  CNN_FILTERS,
  DEFAULT_WEIGHTS,
  EMBEDDING_WORDS,
  RAG_DATABASE,
  biasVarianceCurve,
  computeConvolutionStep,
  computeKMeansStep,
  cosineSimilarity,
  forwardPass,
  sampleNextToken,
  solveAnalogy,
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

describe('new interactive simulations logic', () => {
  it('computes cosine similarity correctly', () => {
    const sim = cosineSimilarity(EMBEDDING_WORDS[0], EMBEDDING_WORDS[1]);
    expect(sim).toBeGreaterThan(0.5);
  });

  it('solves vector analogies (King - Man + Woman = Queen)', () => {
    const analogy = solveAnalogy('king', 'man', 'woman');
    expect(analogy.bestMatch.id).toBe('queen');
  });

  it('provides attention presets', () => {
    expect(ATTENTION_PRESETS.length).toBeGreaterThanOrEqual(2);
    expect(ATTENTION_PRESETS[0].tokens).toContain('it');
  });

  it('samples candidate tokens based on temperature and top-p', () => {
    const candidates = sampleNextToken(0.7, 0.9);
    expect(candidates).toHaveLength(7);
    expect(candidates[0].token).toBe('the');
  });

  it('computes deterministic K-Means clustering steps', () => {
    const step1 = computeKMeansStep(3, 1);
    expect(step1.centroids).toHaveLength(3);
    expect(step1.assigned).toHaveLength(12);
  });

  it('calculates bias-variance tradeoff curves', () => {
    const low = biasVarianceCurve(1, 0.1);
    expect(low.fitQuality).toContain('Underfit');
    const high = biasVarianceCurve(9, 0.8);
    expect(high.fitQuality).toContain('Overfit');
  });

  it('computes CNN convolution steps', () => {
    const conv = computeConvolutionStep(CNN_FILTERS[0], 0, 0);
    expect(conv.calcStr).toBeDefined();
  });

  it('provides RAG query answers and grounded database documents', () => {
    expect(RAG_DATABASE.length).toBeGreaterThanOrEqual(2);
    expect(RAG_DATABASE[0].docs).toHaveLength(3);
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
  it('has at least 18 interactive experiences', () => {
    expect(SIMS.length + CASES.length).toBeGreaterThanOrEqual(18);
  });
});


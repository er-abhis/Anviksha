/**
 * Pure, deterministic maths behind the AI Brain simulations. NO network, NO
 * randomness, NO model — every function is a plain input→output transform so
 * the visualisations are reproducible and testable offline. See the test in
 * `__tests__/brain.test.ts` for the runnable checks that guard this file.
 */

/* ----------------------------- Token Explorer ----------------------------- */
export interface Token {
  text: string;
  /** Palette bucket 0..5 so chips get stable, varied colours. */
  hue: number;
  /** A rare/long word that a real tokenizer would break into sub-pieces. */
  split: boolean;
}

/**
 * A believable, explainable toy tokenizer: whitespace and punctuation are their
 * own tokens, and long words (>6 letters) break into ~4-char sub-word pieces —
 * the same behaviour that makes real token counts exceed word counts.
 */
export const tokenize = (text: string): Token[] => {
  const pieces = text.match(/[A-Za-z]+|[0-9]+|[^\sA-Za-z0-9]/g) ?? [];
  const tokens: Token[] = [];
  pieces.forEach(p => {
    if (/^[A-Za-z]+$/.test(p) && p.length > 6) {
      // Sub-word split: break the long word into ~4-char chunks.
      for (let i = 0; i < p.length; i += 4) {
        tokens.push({ text: p.slice(i, i + 4), hue: tokens.length % 6, split: true });
      }
    } else {
      tokens.push({ text: p, hue: tokens.length % 6, split: false });
    }
  });
  return tokens;
};

export const tokenStats = (text: string) => {
  const tokens = tokenize(text);
  const words = (text.trim().match(/\S+/g) ?? []).length;
  return {
    tokens,
    tokenCount: tokens.length,
    words,
    chars: text.length,
    /** Rough industry rule of thumb used in the explainer copy. */
    ratio: words === 0 ? 0 : +(tokens.length / words).toFixed(2),
  };
};

/* ----------------------------- Neural Network ----------------------------- */
const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

export interface NetWeights {
  /** hidden[j] = sigmoid( w[j][0]*x1 + w[j][1]*x2 + b[j] ) */
  w: [[number, number], [number, number]];
  b: [number, number];
  /** out = sigmoid( o[0]*h1 + o[1]*h2 + ob ) */
  o: [number, number];
  ob: number;
}

/** A sensible default net that behaves like a soft AND/OR blend. */
export const DEFAULT_WEIGHTS: NetWeights = {
  w: [
    [3, 3],
    [-2, 2],
  ],
  b: [-4, -1],
  o: [4, 3],
  ob: -3,
};

export interface NetState {
  hidden: [number, number];
  output: number;
}

export const forwardPass = (
  x1: number,
  x2: number,
  wts: NetWeights = DEFAULT_WEIGHTS,
): NetState => {
  const h1 = sigmoid(wts.w[0][0] * x1 + wts.w[0][1] * x2 + wts.b[0]);
  const h2 = sigmoid(wts.w[1][0] * x1 + wts.w[1][1] * x2 + wts.b[1]);
  const output = sigmoid(wts.o[0] * h1 + wts.o[1] * h2 + wts.ob);
  return { hidden: [h1, h2], output };
};

/* ----------------------------- Decision Tree ------------------------------ */
export interface Sample {
  label: string; // the feature values, for display
  f: [number, number]; // two numeric features
  y: 0 | 1; // true class
}

export const TREE_FEATURES = ['Sweetness', 'Size'] as const;
export const TREE_CLASSES = ['🍋 Lemon', '🍎 Apple'] as const;

/** 8 labelled fruit: sweet+big → apple, sour+small → lemon (with some overlap). */
export const TREE_DATASET: Sample[] = [
  { label: 'Tiny & sour', f: [1, 2], y: 0 },
  { label: 'Small & sharp', f: [2, 3], y: 0 },
  { label: 'Sour, medium', f: [3, 5], y: 0 },
  { label: 'Mild & small', f: [4, 3], y: 0 },
  { label: 'Sweet, medium', f: [6, 6], y: 1 },
  { label: 'Sweet & big', f: [8, 8], y: 1 },
  { label: 'Very sweet', f: [9, 7], y: 1 },
  { label: 'Sweet & large', f: [7, 9], y: 1 },
];

export interface TreeResult {
  /** Per-sample prediction + whether it matched the true class. */
  predictions: { predicted: 0 | 1; correct: boolean }[];
  accuracy: number; // 0..1
  /** Majority class assigned to each side of the split, for the diagram. */
  leftClass: 0 | 1;
  rightClass: 0 | 1;
}

/**
 * Classify by a single split `feature <= threshold`. Each side predicts its own
 * majority true-class (what a 1-level decision stump learns), then we score it.
 */
export const splitResult = (
  feature: 0 | 1,
  threshold: number,
  data: Sample[] = TREE_DATASET,
): TreeResult => {
  const left = data.filter(s => s.f[feature] <= threshold);
  const right = data.filter(s => s.f[feature] > threshold);
  const majority = (g: Sample[]): 0 | 1 => {
    const ones = g.filter(s => s.y === 1).length;
    return ones * 2 >= g.length ? 1 : 0;
  };
  const leftClass = majority(left);
  const rightClass = majority(right);
  const predictions = data.map(s => {
    const predicted = s.f[feature] <= threshold ? leftClass : rightClass;
    return { predicted, correct: predicted === s.y };
  });
  const accuracy =
    predictions.filter(p => p.correct).length / (predictions.length || 1);
  return { predictions, accuracy, leftClass, rightClass };
};

/* -------------------------- Training / Overfitting ------------------------- */
export interface TrainingConfig {
  complexity: number; // 1..10
  noise: number; // 0..1
  epochs: number; // 1..50
}

export type Verdict = 'Underfitting' | 'Good fit' | 'Overfitting';

export interface TrainingResult {
  train: number[]; // accuracy per sampled epoch, 0..1
  val: number[];
  verdict: Verdict;
  finalGap: number; // train - val at the end
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/**
 * Deterministic train-vs-validation accuracy curves. A higher-capacity model
 * fits the training set better but, past the data's real complexity, validation
 * accuracy stalls then dips — the textbook overfitting signature. Noise widens
 * the gap. Entirely closed-form; no actual training loop.
 */
export const trainingCurves = (cfg: TrainingConfig): TrainingResult => {
  const capacity = cfg.complexity / 10; // 0.1..1
  const trainAsym = 0.6 + 0.4 * capacity;
  const overfit = Math.max(0, capacity - 0.4); // capacity beyond the sweet spot
  const valAsym = trainAsym - (overfit * 0.9 + cfg.noise * 0.5);

  const n = Math.max(2, Math.round(cfg.epochs));
  const train: number[] = [];
  const val: number[] = [];
  for (let i = 1; i <= n; i++) {
    const t = i / n; // 0..1 progress
    const learn = 1 - Math.exp(-4 * t);
    train.push(clamp01(0.5 + (trainAsym - 0.5) * learn));
    // Validation climbs then erodes late when the model overfits.
    val.push(clamp01(0.5 + (valAsym - 0.5) * learn - overfit * 0.2 * t));
  }
  const finalGap = +(train[n - 1] - val[n - 1]).toFixed(3);
  const verdict: Verdict =
    trainAsym < 0.72 ? 'Underfitting' : finalGap > 0.17 ? 'Overfitting' : 'Good fit';
  return { train, val, verdict, finalGap };
};

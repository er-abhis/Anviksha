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

/* ----------------------------- Vector Embeddings ----------------------------- */
export interface EmbeddingWord {
  id: string;
  word: string;
  x: number; // 0..10
  y: number; // 0..10
  category: string;
}

export const EMBEDDING_WORDS: EmbeddingWord[] = [
  { id: 'king', word: 'King 👑', x: 8.0, y: 8.5, category: 'Royalty' },
  { id: 'queen', word: 'Queen 👸', x: 8.2, y: 4.5, category: 'Royalty' },
  { id: 'man', word: 'Man 👨', x: 3.5, y: 8.5, category: 'People' },
  { id: 'woman', word: 'Woman 👩', x: 3.7, y: 4.5, category: 'People' },
  { id: 'apple', word: 'Apple 🍎', x: 1.5, y: 1.5, category: 'Fruit' },
  { id: 'banana', word: 'Banana 🍌', x: 2.2, y: 2.0, category: 'Fruit' },
  { id: 'cat', word: 'Cat 🐱', x: 7.5, y: 1.5, category: 'Animals' },
  { id: 'dog', word: 'Dog 🐶', x: 8.2, y: 2.0, category: 'Animals' },
];

export const cosineSimilarity = (w1: EmbeddingWord, w2: EmbeddingWord): number => {
  const dot = w1.x * w2.x + w1.y * w2.y;
  const mag1 = Math.sqrt(w1.x * w1.x + w1.y * w1.y);
  const mag2 = Math.sqrt(w2.x * w2.x + w2.y * w2.y);
  if (mag1 === 0 || mag2 === 0) return 0;
  return +(dot / (mag1 * mag2)).toFixed(3);
};

export const solveAnalogy = (aId: string, bId: string, cId: string) => {
  const a = EMBEDDING_WORDS.find(w => w.id === aId)!;
  const b = EMBEDDING_WORDS.find(w => w.id === bId)!;
  const c = EMBEDDING_WORDS.find(w => w.id === cId)!;
  // A - B + C = Target
  const targetX = a.x - b.x + c.x;
  const targetY = a.y - b.y + c.y;

  let bestMatch = EMBEDDING_WORDS[0];
  let bestDist = Infinity;

  EMBEDDING_WORDS.forEach(w => {
    if (w.id !== aId && w.id !== bId && w.id !== cId) {
      const dist = Math.hypot(w.x - targetX, w.y - targetY);
      if (dist < bestDist) {
        bestDist = dist;
        bestMatch = w;
      }
    }
  });

  return { targetX, targetY, bestMatch, distance: +bestDist.toFixed(2) };
};

/* ----------------------------- Self Attention ------------------------------ */
export interface AttentionSentence {
  id: string;
  title: string;
  tokens: string[];
  weights: number[][]; // N x N attention matrix (0..1)
}

export const ATTENTION_PRESETS: AttentionSentence[] = [
  {
    id: 'pronoun',
    title: 'Pronoun Resolution ("it")',
    tokens: ['The', 'animal', "didn't", 'cross', 'the', 'street', 'because', 'it', 'was', 'tired'],
    weights: [
      [1.0, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
      [0.2, 1.0, 0.1, 0.1, 0.0, 0.0, 0.0, 0.1, 0.0, 0.1],
      [0.0, 0.1, 1.0, 0.3, 0.0, 0.1, 0.0, 0.0, 0.0, 0.0],
      [0.0, 0.2, 0.2, 1.0, 0.1, 0.5, 0.0, 0.0, 0.0, 0.0],
      [0.0, 0.0, 0.0, 0.1, 1.0, 0.4, 0.0, 0.0, 0.0, 0.0],
      [0.0, 0.1, 0.1, 0.4, 0.3, 1.0, 0.1, 0.0, 0.0, 0.0],
      [0.0, 0.1, 0.1, 0.1, 0.0, 0.1, 1.0, 0.2, 0.0, 0.1],
      [0.1, 0.82, 0.0, 0.1, 0.0, 0.15, 0.1, 1.0, 0.1, 0.4], // "it" attends 82% to "animal"
      [0.0, 0.1, 0.0, 0.0, 0.0, 0.0, 0.1, 0.2, 1.0, 0.3],
      [0.1, 0.6, 0.0, 0.1, 0.0, 0.0, 0.1, 0.3, 0.2, 1.0], // "tired" attends to "animal"
    ],
  },
  {
    id: 'context',
    title: 'Word Sense Disambiguation ("bank")',
    tokens: ['He', 'sat', 'by', 'the', 'river', 'bank', 'to', 'watch', 'the', 'sunset'],
    weights: [
      [1.0, 0.3, 0.1, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0],
      [0.3, 1.0, 0.4, 0.1, 0.2, 0.1, 0.1, 0.1, 0.0, 0.0],
      [0.1, 0.4, 1.0, 0.2, 0.3, 0.2, 0.0, 0.0, 0.0, 0.0],
      [0.0, 0.1, 0.2, 1.0, 0.4, 0.3, 0.0, 0.0, 0.0, 0.0],
      [0.1, 0.2, 0.3, 0.4, 1.0, 0.88, 0.0, 0.1, 0.0, 0.2], // "river" strongly bound to "bank"
      [0.0, 0.1, 0.2, 0.3, 0.88, 1.0, 0.1, 0.1, 0.0, 0.1], // "bank" attends 88% to "river"
      [0.0, 0.1, 0.0, 0.0, 0.0, 0.1, 1.0, 0.4, 0.0, 0.0],
      [0.1, 0.1, 0.0, 0.0, 0.1, 0.1, 0.4, 1.0, 0.2, 0.4],
      [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.2, 1.0, 0.5],
      [0.0, 0.0, 0.0, 0.0, 0.2, 0.1, 0.0, 0.4, 0.5, 1.0],
    ],
  },
];

/* -------------------------- Temperature & Sampling ------------------------- */
export interface CandidateToken {
  token: string;
  logit: number;
  prob: number;
  cumulativeProb: number;
  inTopP: boolean;
  selected: boolean;
}

const RAW_LOGITS = [
  { token: 'the', logit: 4.2 },
  { token: 'a', logit: 3.5 },
  { token: 'one', logit: 2.1 },
  { token: 'distant', logit: 1.8 },
  { token: 'magic', logit: 1.2 },
  { token: 'banana', logit: -0.5 },
  { token: 'quantum', logit: -1.2 },
];

export const sampleNextToken = (temp: number, topP: number): CandidateToken[] => {
  const scaled = RAW_LOGITS.map(l => ({ ...l, scaled: l.logit / Math.max(0.01, temp) }));
  const maxLogit = Math.max(...scaled.map(s => s.scaled));
  const exps = scaled.map(s => Math.exp(s.scaled - maxLogit));
  const sumExp = exps.reduce((a, b) => a + b, 0);

  let cum = 0;
  return scaled.map((s, i) => {
    const prob = exps[i] / sumExp;
    cum += prob;
    const inTopP = i === 0 || cum - prob <= topP;
    return {
      token: s.token,
      logit: s.logit,
      prob: +prob.toFixed(4),
      cumulativeProb: +cum.toFixed(4),
      inTopP,
      selected: i === 0, // top token default
    };
  });
};

/* ---------------------------- K-Means Clustering --------------------------- */
export interface ClusterPoint {
  x: number;
  y: number;
  cluster: number;
}

export const KMEANS_DATA: ClusterPoint[] = [
  { x: 2, y: 8, cluster: 0 }, { x: 3, y: 7, cluster: 0 }, { x: 2.5, y: 9, cluster: 0 },
  { x: 8, y: 2, cluster: 1 }, { x: 9, y: 3, cluster: 1 }, { x: 8.5, y: 1.5, cluster: 1 },
  { x: 8, y: 8, cluster: 2 }, { x: 9, y: 9, cluster: 2 }, { x: 7.5, y: 8.5, cluster: 2 },
  { x: 3, y: 2, cluster: 0 }, { x: 2, y: 3, cluster: 0 }, { x: 8.5, y: 7.5, cluster: 2 },
];

export const computeKMeansStep = (k: number, step: number) => {
  // Deterministic centroid positions by step
  const centroids = Array.from({ length: k }, (_, i) => {
    const angle = (i * 2 * Math.PI) / k + step * 0.4;
    return {
      x: +(5 + 3.5 * Math.cos(angle)).toFixed(1),
      y: +(5 + 3.5 * Math.sin(angle)).toFixed(1),
    };
  });

  const assigned = KMEANS_DATA.map(p => {
    let closestIndex = 0;
    let minD = Infinity;
    centroids.forEach((c, idx) => {
      const d = Math.hypot(p.x - c.x, p.y - c.y);
      if (d < minD) {
        minD = d;
        closestIndex = idx;
      }
    });
    return { ...p, cluster: closestIndex };
  });

  // Calculate inertia (within-cluster sum of squares)
  const inertia = +assigned.reduce((sum, p) => {
    const c = centroids[p.cluster];
    return sum + (p.x - c.x) ** 2 + (p.y - c.y) ** 2;
  }, 0).toFixed(1);

  return { centroids, assigned, inertia };
};

/* -------------------------- Bias-Variance Tradeoff ------------------------- */
export const biasVarianceCurve = (degree: number, noise: number) => {
  // degree 1..9
  const bias = Math.max(0.05, +(1 / degree).toFixed(2));
  const variance = Math.max(0.05, +((degree / 9) ** 2 * (0.3 + noise * 0.7)).toFixed(2));
  const totalError = +(bias * 0.6 + variance * 0.4).toFixed(2);
  const fitQuality = degree === 3 || degree === 4 ? 'Optimal Fit' : degree < 3 ? 'High Bias (Underfit)' : 'High Variance (Overfit)';
  return { bias, variance, totalError, fitQuality };
};

/* --------------------------- Convolution Filter --------------------------- */
export interface FilterMatrix {
  id: string;
  name: string;
  kernel: number[][]; // 3x3
}

export const CNN_FILTERS: FilterMatrix[] = [
  {
    id: 'vertical-edge',
    name: 'Vertical Edge Detect',
    kernel: [
      [-1, 0, 1],
      [-1, 0, 1],
      [-1, 0, 1],
    ],
  },
  {
    id: 'horizontal-edge',
    name: 'Horizontal Edge Detect',
    kernel: [
      [-1, -1, -1],
      [0, 0, 0],
      [1, 1, 1],
    ],
  },
  {
    id: 'sharpen',
    name: 'Sharpen Kernel',
    kernel: [
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0],
    ],
  },
];

export const CNN_INPUT_GRID = [
  [0, 0, 1, 1, 1],
  [0, 0, 1, 1, 1],
  [0, 0, 1, 1, 1],
  [0, 0, 1, 1, 1],
  [0, 0, 1, 1, 1],
];

export const computeConvolutionStep = (filter: FilterMatrix, startX: number, startY: number) => {
  let sum = 0;
  const terms: string[] = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const pixel = CNN_INPUT_GRID[startY + r][startX + c];
      const weight = filter.kernel[r][c];
      sum += pixel * weight;
      if (weight !== 0) {
        terms.push(`(${pixel}×${weight})`);
      }
    }
  }
  return { sum, calcStr: terms.join(' + ') + ` = ${sum}` };
};

/* ----------------------------- RAG Retrieval ----------------------------- */
export interface RAGQuery {
  id: string;
  question: string;
  docs: { id: string; text: string; score: number }[];
  ragAnswer: string;
  rawAnswer: string;
}

export const RAG_DATABASE: RAGQuery[] = [
  {
    id: 'return-policy',
    question: 'What is the refund policy for digital courses?',
    docs: [
      { id: 'd1', text: 'Anviksha digital items offer a 30-day no-questions-asked refund.', score: 0.94 },
      { id: 'd2', text: 'All progress data is stored locally on device and never uploaded.', score: 0.42 },
      { id: 'd3', text: 'Contact support via the menu for purchase receipt inquiries.', score: 0.78 },
    ],
    ragAnswer: 'Based on our knowledge base, Anviksha digital courses offer a 30-day no-questions-asked full refund.',
    rawAnswer: 'Digital courses generally vary. Many providers do not allow refunds once downloaded or accessed.',
  },
  {
    id: 'offline-mode',
    question: 'Does the app require an internet connection or account?',
    docs: [
      { id: 'd4', text: 'Anviksha is fully offline-first: no accounts, no sign-in, no cloud execution.', score: 0.96 },
      { id: 'd5', text: 'Local notifications are generated on-device without push servers.', score: 0.81 },
      { id: 'd6', text: 'External links open in your browser for optional resources.', score: 0.55 },
    ],
    ragAnswer: 'No! Anviksha runs 100% offline with zero account requirements, zero cloud APIs, and zero data collection.',
    rawAnswer: 'Most modern learning apps require creating an account to sync progress to the cloud.',
  },
];


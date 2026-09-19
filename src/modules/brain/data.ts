/**
 * Static, bundled content for the AI Brain playground: the simulation catalog,
 * the AI Detective case files, and the rotating "Today's Mission". All local —
 * no network, no generation. Concepts here map to the revision engine in
 * `brainStore.ts` (the `concept` string is the shared key).
 */

export type SimId =
  | 'neural-network'
  | 'decision-tree'
  | 'token-explorer'
  | 'training-lab'
  | 'embedding-space'
  | 'attention-map'
  | 'temperature-lab'
  | 'kmeans-clustering'
  | 'bias-variance'
  | 'cnn-filter'
  | 'rag-retrieval'
  | 'activation-functions'
  | 'gradient-descent'
  | 'prompt-playground'
  | 'quantization-lab'
  | 'loss-functions'
  | 'naive-bayes'
  | 'token-generation'
  | 'fine-tuning'
  | 'ai-agent';

export interface SimMeta {
  id: SimId;
  title: string;
  tagline: string;
  icon: string; // Ionicons
  concept: string;
  category: 'Core Models' | 'LLMs & Transformers' | 'Classic ML' | 'Optimization & Systems';
  /** ~minutes, used in UI copy. */
  minutes: number;
}

export const SIMS: SimMeta[] = [
  // --- Core Models ---
  {
    id: 'neural-network',
    title: 'Neural Network',
    tagline: 'Feed inputs through neurons and watch them fire.',
    icon: 'git-network',
    concept: 'Neural networks',
    category: 'Core Models',
    minutes: 3,
  },
  {
    id: 'activation-functions',
    title: 'Activation Explorer',
    tagline: 'Compare Sigmoid, ReLU & GELU curves and gradient flow.',
    icon: 'pulse-outline',
    concept: 'Activation functions',
    category: 'Core Models',
    minutes: 3,
  },
  {
    id: 'cnn-filter',
    title: 'CNN Feature Filter',
    tagline: 'Slide 3x3 kernels over pixels to extract visual edges.',
    icon: 'grid',
    concept: 'Convolutional filters',
    category: 'Core Models',
    minutes: 3,
  },
  {
    id: 'token-explorer',
    title: 'Token Explorer',
    tagline: 'See how a model chops your text into tokens.',
    icon: 'text',
    concept: 'Tokenization',
    category: 'Core Models',
    minutes: 2,
  },

  // --- LLMs & Transformers ---
  {
    id: 'embedding-space',
    title: 'Vector Embeddings',
    tagline: 'Plot words in 2D space and solve vector math analogies.',
    icon: 'compass',
    concept: 'Vector embeddings',
    category: 'LLMs & Transformers',
    minutes: 3,
  },
  {
    id: 'attention-map',
    title: 'Attention Visualizer',
    tagline: 'See how Transformer attention connects related words.',
    icon: 'eye',
    concept: 'Self-attention',
    category: 'LLMs & Transformers',
    minutes: 3,
  },
  {
    id: 'temperature-lab',
    title: 'Temperature & Sampling',
    tagline: 'Control randomness, Top-P, and token probabilities.',
    icon: 'thermometer',
    concept: 'Temperature & sampling',
    category: 'LLMs & Transformers',
    minutes: 3,
  },
  {
    id: 'token-generation',
    title: 'Token Generation',
    tagline: 'Compare Greedy, Top-K, Nucleus & Beam Search step-by-step.',
    icon: 'git-commit-outline',
    concept: 'Decoding strategies',
    category: 'LLMs & Transformers',
    minutes: 3,
  },
  {
    id: 'prompt-playground',
    title: 'Prompt Engineering',
    tagline: 'Test Zero-shot, Few-shot & Chain-of-Thought reasoning.',
    icon: 'chatbubbles-outline',
    concept: 'Prompt engineering',
    category: 'LLMs & Transformers',
    minutes: 4,
  },
  {
    id: 'rag-retrieval',
    title: 'RAG Grounding Lab',
    tagline: 'Compare raw hallucinated AI against vector document retrieval.',
    icon: 'search',
    concept: 'RAG & Retrieval',
    category: 'LLMs & Transformers',
    minutes: 4,
  },
  {
    id: 'ai-agent',
    title: 'AI Agent Loop',
    tagline: 'Watch an agent perceive, reason, call tools & act.',
    icon: 'hardware-chip-outline',
    concept: 'AI Agents',
    category: 'LLMs & Transformers',
    minutes: 4,
  },

  // --- Classic ML ---
  {
    id: 'decision-tree',
    title: 'Decision Tree',
    tagline: 'Split a dataset and see the accuracy change.',
    icon: 'git-branch',
    concept: 'Decision trees',
    category: 'Classic ML',
    minutes: 3,
  },
  {
    id: 'kmeans-clustering',
    title: 'K-Means Clustering',
    tagline: 'Cluster data points and relocate centroids step-by-step.',
    icon: 'shapes',
    concept: 'Clustering',
    category: 'Classic ML',
    minutes: 3,
  },
  {
    id: 'naive-bayes',
    title: 'Naive Bayes Classifier',
    tagline: 'Calculate word probabilities to separate spam from ham.',
    icon: 'mail-unread-outline',
    concept: 'Bayesian classification',
    category: 'Classic ML',
    minutes: 3,
  },
  {
    id: 'bias-variance',
    title: 'Bias-Variance Tradeoff',
    tagline: 'Adjust polynomial curves to balance under/overfitting.',
    icon: 'options',
    concept: 'Bias-variance tradeoff',
    category: 'Classic ML',
    minutes: 3,
  },

  // --- Optimization & Systems ---
  {
    id: 'training-lab',
    title: 'Training Lab',
    tagline: 'Tune a model and spot overfitting live.',
    icon: 'pulse',
    concept: 'Overfitting',
    category: 'Optimization & Systems',
    minutes: 4,
  },
  {
    id: 'gradient-descent',
    title: 'Gradient Descent',
    tagline: 'Adjust learning rate & momentum to minimize loss.',
    icon: 'trending-down-outline',
    concept: 'Gradient descent',
    category: 'Optimization & Systems',
    minutes: 3,
  },
  {
    id: 'loss-functions',
    title: 'Loss Functions',
    tagline: 'Compare MSE, Cross-Entropy & Huber penalty curves.',
    icon: 'analytics-outline',
    concept: 'Loss functions',
    category: 'Optimization & Systems',
    minutes: 3,
  },
  {
    id: 'quantization-lab',
    title: 'Model Quantization',
    tagline: 'Compress FP32 models to INT4 and measure accuracy vs memory.',
    icon: 'speedometer-outline',
    concept: 'Quantization',
    category: 'Optimization & Systems',
    minutes: 3,
  },
  {
    id: 'fine-tuning',
    title: 'LoRA Fine-Tuning',
    tagline: 'Adapt base models using low-rank matrices.',
    icon: 'layers-outline',
    concept: 'Fine-tuning & LoRA',
    category: 'Optimization & Systems',
    minutes: 4,
  },
];

export const getSim = (id: string): SimMeta | undefined =>
  SIMS.find(s => s.id === id);

/* --------------------------------- Detective ------------------------------ */
export interface DetectiveCase {
  id: string;
  title: string;
  emoji: string;
  concept: string; // shared revision key
  /** The situation to investigate. */
  scenario: string;
  /** Observable symptoms the learner reasons from. */
  clues: string[];
  /** Candidate diagnoses; exactly one is correct. */
  options: string[];
  answerIndex: number;
  /** The "Why?" — taught after answering, right or wrong. */
  why: string;
}

export const CASES: DetectiveCase[] = [
  {
    id: 'case-bias',
    title: 'The Biased Recruiter',
    emoji: '🧑‍💼',
    concept: 'Dataset bias',
    scenario:
      'A hiring model was trained on 10 years of a company’s past hires. It now scores male candidates far higher than equally-qualified women.',
    clues: [
      'Historical hires were 85% men.',
      'Accuracy on the training set is excellent.',
      'The model learned to favour résumés similar to past hires.',
    ],
    options: ['Overfitting', 'Dataset bias', 'Data leakage', 'Too few epochs'],
    answerIndex: 1,
    why: 'The data itself encoded a historical imbalance. A model only mirrors its training data — train on biased history and you automate the bias. Fix the data, not just the model.',
  },
  {
    id: 'case-overfit',
    title: 'The Straight-A Student',
    emoji: '📚',
    concept: 'Overfitting',
    scenario:
      'A model gets 99% accuracy on its training data but only 61% on new, unseen data.',
    clues: [
      'Huge gap between training and test accuracy.',
      'The model is very large for a small dataset.',
      'It seems to have memorised the training examples.',
    ],
    options: ['Underfitting', 'Class imbalance', 'Overfitting', 'Wrong metric'],
    answerIndex: 2,
    why: 'Memorising the training set instead of learning general patterns is overfitting. The tell is a large train-vs-validation gap. Use more data, simpler models or regularisation.',
  },
  {
    id: 'case-leakage',
    title: 'The Too-Good Predictor',
    emoji: '🔮',
    concept: 'Data leakage',
    scenario:
      'A model predicting whether a patient has a disease hits 100% accuracy. In production it fails completely.',
    clues: [
      'One input feature was “was prescribed the disease’s medication”.',
      'That feature is only known AFTER diagnosis.',
      'Perfect scores in testing, useless in the real world.',
    ],
    options: ['Data leakage', 'Overfitting', 'Dataset bias', 'Hallucination'],
    answerIndex: 0,
    why: 'A feature leaked information from the future / the answer itself. The model cheated with data it won’t have at prediction time. Remove features unavailable at inference.',
  },
  {
    id: 'case-hallucination',
    title: 'The Confident Liar',
    emoji: '🤖',
    concept: 'Hallucination',
    scenario:
      'A chatbot cites a scientific paper, complete with authors and a journal — but the paper does not exist.',
    clues: [
      'The answer sounds fluent and authoritative.',
      'Details are invented but plausible.',
      'The model was never connected to a real source of truth.',
    ],
    options: ['Data leakage', 'Hallucination', 'Class imbalance', 'Overfitting'],
    answerIndex: 1,
    why: 'Language models predict likely-sounding text, not verified facts. With no grounding source they can fabricate confidently — a hallucination. Ground answers with retrieval (RAG).',
  },
  {
    id: 'case-imbalance',
    title: 'The Lazy Fraud Detector',
    emoji: '💳',
    concept: 'Class imbalance',
    scenario:
      'A fraud model reports 99.8% accuracy, yet it never catches a single fraudulent transaction.',
    clues: [
      'Only 0.2% of transactions are actually fraud.',
      'Predicting “not fraud” every time scores 99.8%.',
      'Recall on fraud is basically zero.',
    ],
    options: ['Overfitting', 'Class imbalance', 'Data leakage', 'Underfitting'],
    answerIndex: 1,
    why: 'When one class is rare, plain accuracy is misleading — always guessing the majority looks great. This is class imbalance; measure precision/recall and rebalance the data.',
  },
  {
    id: 'case-metric',
    title: 'The Wrong Scoreboard',
    emoji: '📊',
    concept: 'Wrong metric',
    scenario:
      'A cancer-screening model is tuned for high accuracy and ships. Doctors find it misses many real cancers.',
    clues: [
      'Accuracy was the only metric optimised.',
      'Missing a real cancer (false negative) is far costlier than a false alarm.',
      'Recall was never measured.',
    ],
    options: ['Wrong metric', 'Data leakage', 'Hallucination', 'Dataset bias'],
    answerIndex: 0,
    why: 'The metric didn’t match the real-world cost. For screening, recall (catching true cases) matters far more than raw accuracy. Pick metrics that reflect what actually hurts.',
  },
  {
    id: 'case-poordata',
    title: 'The Garbage Diet',
    emoji: '🗑️',
    concept: 'Poor training data',
    scenario:
      'An image classifier trained on blurry, mislabelled photos performs poorly no matter how long it trains.',
    clues: [
      'Many labels in the dataset are simply wrong.',
      'Images are low-resolution and inconsistent.',
      'More epochs and bigger models don’t help.',
    ],
    options: ['Overfitting', 'Poor training data', 'Wrong metric', 'Data leakage'],
    answerIndex: 1,
    why: 'Garbage in, garbage out. No architecture can overcome wrong labels and low-quality inputs. Cleaning and relabelling the data beats any model tweak.',
  },
];

export const getCase = (id: string): DetectiveCase | undefined =>
  CASES.find(c => c.id === id);

/* -------------------------------- Missions -------------------------------- */
export interface Mission {
  kind: 'sim' | 'detective';
  targetId: string;
  title: string;
  blurb: string;
}

/* eslint-disable no-bitwise -- tiny deterministic string hash */
const hash = (s: string): number => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
};
/* eslint-enable no-bitwise */

/**
 * One short challenge for today, rotating deterministically by date across the
 * sims and detective cases. Stable all day, different tomorrow.
 */
export const missionForDay = (iso: string): Mission => {
  const pool: Mission[] = [
    ...SIMS.map(s => ({
      kind: 'sim' as const,
      targetId: s.id,
      title: s.title,
      blurb: s.tagline,
    })),
    ...CASES.map(c => ({
      kind: 'detective' as const,
      targetId: c.id,
      title: c.title,
      blurb: 'Investigate the scenario and name the flaw.',
    })),
  ];
  return pool[hash(iso + 'mission') % pool.length];
};

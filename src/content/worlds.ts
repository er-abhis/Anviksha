import { World } from './types';

/**
 * The 10 worlds — the spine of the curriculum, beginner → advanced.
 * Worlds 1–2 ship with full lessons + question banks; 3–10 are defined here so
 * the map is complete and they unlock in order. Adding their lessons later is a
 * pure content add (drop a file in `lessons/`, register it) — no app changes.
 */
export const WORLDS: World[] = [
  {
    id: 'world-understanding-ai',
    slug: 'understanding-ai',
    order: 1,
    title: 'Understanding AI',
    subtitle: 'What AI really is — and isn’t',
    description:
      'Build clear intuition for what artificial intelligence is, how it differs from ordinary software, and where you already meet it every day.',
    gradient: ['#4B58F0', '#2DD4BF'],
    icon: 'planet',
  },
  {
    id: 'world-machine-learning',
    slug: 'machine-learning',
    order: 2,
    title: 'Machine Learning',
    subtitle: 'How machines learn from examples',
    description:
      'See how machines find patterns in data instead of following hand-written rules — the engine under almost all modern AI.',
    gradient: ['#7C3AED', '#DB2777'],
    icon: 'git-network',
  },
  {
    id: 'world-neural-networks',
    slug: 'neural-networks',
    order: 3,
    title: 'Neural Networks',
    subtitle: 'Layers, weights and learning',
    description:
      'Understand the flexible pattern-learners inspired by the brain that power vision, speech and language systems.',
    gradient: ['#2563EB', '#06B6D4'],
    icon: 'share-social',
  },
  {
    id: 'world-transformers',
    slug: 'transformers',
    order: 4,
    title: 'Transformers',
    subtitle: 'The architecture behind modern AI',
    description:
      'Meet attention — the idea that let models read whole sentences at once and unlocked today’s AI boom.',
    gradient: ['#0891B2', '#22C55E'],
    icon: 'grid',
  },
  {
    id: 'world-llms',
    slug: 'large-language-models',
    order: 5,
    title: 'Large Language Models',
    subtitle: 'How models understand and generate text',
    description:
      'Learn how LLMs predict text token by token, what training gives them, and why they behave the way they do.',
    gradient: ['#4F46E5', '#A855F7'],
    icon: 'chatbubbles',
  },
  {
    id: 'world-prompt-engineering',
    slug: 'prompt-engineering',
    order: 6,
    title: 'Prompt Engineering',
    subtitle: 'Getting the best from an LLM',
    description:
      'Turn vague requests into clear instructions and reliably steer models toward the output you want.',
    gradient: ['#DB2777', '#F59E0B'],
    icon: 'create',
  },
  {
    id: 'world-embeddings',
    slug: 'embeddings-vector-search',
    order: 7,
    title: 'Embeddings & Vector Search',
    subtitle: 'Turning meaning into numbers',
    description:
      'Discover how text becomes vectors that capture meaning, and how similarity search finds what you mean, not just what you type.',
    gradient: ['#0D9488', '#3B82F6'],
    icon: 'locate',
  },
  {
    id: 'world-rag',
    slug: 'retrieval-augmented-generation',
    order: 8,
    title: 'Retrieval Augmented Generation',
    subtitle: 'Giving AI your own knowledge',
    description:
      'Combine search with generation so a model can answer from your documents — accurately and with sources.',
    gradient: ['#7C3AED', '#2DD4BF'],
    icon: 'library',
  },
  {
    id: 'world-agents',
    slug: 'ai-agents',
    order: 9,
    title: 'AI Agents',
    subtitle: 'Models that take actions',
    description:
      'Move from answering questions to getting things done — models that plan, use tools, and act in loops.',
    gradient: ['#EA580C', '#F59E0B'],
    icon: 'hardware-chip',
  },
  {
    id: 'world-mcp',
    slug: 'model-context-protocol',
    order: 10,
    title: 'Model Context Protocol',
    subtitle: 'A universal way to connect tools',
    description:
      'Learn the open standard that lets any AI app plug into any tool or data source through one common interface.',
    gradient: ['#1D4ED8', '#06B6D4'],
    icon: 'git-merge',
  },
  {
    id: 'world-future-of-ai',
    slug: 'future-of-ai',
    order: 11,
    title: 'The Future of AI',
    subtitle: 'AGI, safety, ethics and careers',
    description:
      'Look ahead with clear eyes: what AGI would mean, how we keep AI safe and fair, and how to build a career alongside it.',
    gradient: ['#7C3AED', '#F59E0B'],
    icon: 'telescope',
  },
];

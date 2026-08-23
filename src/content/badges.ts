import { Badge } from './types';

/** Badge catalog. Unlocked state lives in achievementsStore, keyed by slug. */
export const BADGES: Badge[] = [
  {
    slug: 'first-challenge',
    title: 'First Challenge',
    description: 'Complete your first daily challenge.',
    icon: 'sparkles',
  },
  {
    slug: 'first-lesson',
    title: 'First Steps',
    description: 'Finish your first lesson.',
    icon: 'footsteps',
  },
  {
    slug: 'quiz-ace',
    title: 'Quiz Ace',
    description: 'Score 100% on a lesson quiz.',
    icon: 'ribbon',
  },
  {
    slug: 'builder',
    title: 'AI Architect',
    description: 'Build a correct AI architecture in Build the AI.',
    icon: 'construct',
  },
  {
    slug: 'designer',
    title: 'AI Designer',
    description: 'Explore an AI stack in What Would You Build?',
    icon: 'bulb',
  },
  {
    slug: 'streak-3',
    title: '3-Day Streak',
    description: 'Keep a 3-day learning streak.',
    icon: 'flame',
  },
  {
    slug: 'world-understanding-ai-complete',
    title: 'AI Initiate',
    description: 'Complete the Understanding AI world.',
    icon: 'planet',
  },
  {
    slug: 'world-machine-learning-complete',
    title: 'Pattern Seeker',
    description: 'Complete the Machine Learning world.',
    icon: 'git-network',
  },
  {
    slug: 'world-neural-networks-complete',
    title: 'Network Architect',
    description: 'Complete the Neural Networks world.',
    icon: 'share-social',
  },
  {
    slug: 'world-transformers-complete',
    title: 'Attention Master',
    description: 'Complete the Transformers world.',
    icon: 'grid',
  },
  {
    slug: 'world-llms-complete',
    title: 'Language Wrangler',
    description: 'Complete the Large Language Models world.',
    icon: 'chatbubbles',
  },
  {
    slug: 'world-prompt-engineering-complete',
    title: 'Prompt Smith',
    description: 'Complete the Prompt Engineering world.',
    icon: 'create',
  },
  {
    slug: 'world-embeddings-complete',
    title: 'Meaning Mapper',
    description: 'Complete the Embeddings & Vector Search world.',
    icon: 'locate',
  },
  {
    slug: 'world-rag-complete',
    title: 'Knowledge Grounder',
    description: 'Complete the Retrieval Augmented Generation world.',
    icon: 'library',
  },
  {
    slug: 'world-agents-complete',
    title: 'Agent Builder',
    description: 'Complete the AI Agents world.',
    icon: 'hardware-chip',
  },
  {
    slug: 'world-mcp-complete',
    title: 'Protocol Pioneer',
    description: 'Complete the Model Context Protocol world.',
    icon: 'git-merge',
  },
  {
    slug: 'world-future-of-ai-complete',
    title: 'AI Visionary',
    description: 'Complete The Future of AI world.',
    icon: 'telescope',
  },
  {
    slug: 'glossary-curious',
    title: 'Word Nerd',
    description: 'Open the AI glossary for the first time.',
    icon: 'book',
  },

  // ── AI Lab ───────────────────────────────────────────────
  {
    slug: 'ailab-first-build',
    title: 'First AI Built',
    description: 'Build your first working AI in the AI Lab.',
    icon: 'hardware-chip',
  },
  {
    slug: 'ailab-architect',
    title: 'AI Architect',
    description: 'Complete an AI Lab mission — build plus all challenges.',
    icon: 'construct',
  },
  {
    slug: 'ailab-bug-hunter',
    title: 'Bug Hunter',
    description: 'Solve five AI Lab challenges.',
    icon: 'bug',
  },
  {
    slug: 'ailab-tool-master',
    title: 'Tool Master',
    description: 'Complete the AI Game mission.',
    icon: 'build',
  },
  {
    slug: 'ailab-voice-engineer',
    title: 'Voice Engineer',
    description: 'Complete the Voice Assistant mission.',
    icon: 'mic',
  },
  {
    slug: 'ailab-vision-explorer',
    title: 'Vision Explorer',
    description: 'Complete a Vision-based mission.',
    icon: 'eye',
  },
  {
    slug: 'ailab-agent-builder',
    title: 'Agent Builder',
    description: 'Complete the Research Assistant mission.',
    icon: 'search',
  },
  {
    slug: 'ailab-master',
    title: 'AI Lab Master',
    description: 'Complete all eight AI Lab missions.',
    icon: 'trophy',
  },
];

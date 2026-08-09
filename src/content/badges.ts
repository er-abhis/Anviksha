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
    slug: 'glossary-curious',
    title: 'Word Nerd',
    description: 'Open the AI glossary for the first time.',
    icon: 'book',
  },
];

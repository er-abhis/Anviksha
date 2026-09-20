/**
 * Free Build categories. Unlike missions there's no single correct solution —
 * each category defines soft guidance the open-ended validator uses to explain
 * what works, what's missing, what's unnecessary and what could be improved.
 *
 *  core        — components the category really needs (missing → problem)
 *  recommended — upgrades worth suggesting (missing → "could improve")
 *  typical     — the full set that makes sense here (anything else → "unusual")
 */

import { LabComponentId } from '../types';

export type FreeCategoryId =
  | 'chat'
  | 'voice'
  | 'image'
  | 'education'
  | 'games'
  | 'research'
  | 'productivity'
  | 'coding'
  | 'security'
  | 'creative'
  | 'custom';

export interface FreeCategory {
  id: FreeCategoryId;
  emoji: string;
  label: string;
  description: string;
  core: LabComponentId[];
  recommended: LabComponentId[];
  typical: LabComponentId[];
}

const ALL: LabComponentId[] = [
  'voice_input',
  'stt',
  'brain',
  'memory',
  'knowledge',
  'search',
  'tts',
  'calculator',
  'vision',
  'tool',
  'guardrail',
  'vector_db',
  'reranker',
  'code_interpreter',
  'fine_tuner',
  'image_gen',
];

export const FREE_CATEGORIES: FreeCategory[] = [
  {
    id: 'chat',
    emoji: '💬',
    label: 'Chat',
    description: 'A text assistant you can talk with.',
    core: ['brain'],
    recommended: ['memory', 'knowledge', 'guardrail'],
    typical: ['brain', 'memory', 'knowledge', 'search', 'tool', 'calculator', 'guardrail'],
  },
  {
    id: 'voice',
    emoji: '🎤',
    label: 'Voice',
    description: 'Speak to it and hear it reply.',
    core: ['voice_input', 'stt', 'brain', 'tts'],
    recommended: ['memory', 'knowledge'],
    typical: ['voice_input', 'stt', 'brain', 'tts', 'memory', 'knowledge'],
  },
  {
    id: 'image',
    emoji: '🖼️',
    label: 'Image',
    description: 'Understands and reasons about pictures.',
    core: ['vision', 'brain'],
    recommended: ['knowledge', 'image_gen'],
    typical: ['vision', 'brain', 'knowledge', 'tool', 'image_gen'],
  },
  {
    id: 'education',
    emoji: '📚',
    label: 'Education',
    description: 'Teaches accurately and remembers the learner.',
    core: ['brain', 'knowledge'],
    recommended: ['memory', 'code_interpreter'],
    typical: ['brain', 'knowledge', 'memory', 'search', 'calculator', 'code_interpreter'],
  },
  {
    id: 'games',
    emoji: '🎮',
    label: 'Games',
    description: 'Plays and takes actions.',
    core: ['brain', 'tool'],
    recommended: ['memory'],
    typical: ['brain', 'tool', 'memory', 'vision'],
  },
  {
    id: 'research',
    emoji: '🔎',
    label: 'Research',
    description: 'Finds facts and answers with sources.',
    core: ['search', 'knowledge', 'brain'],
    recommended: ['memory', 'vector_db', 'reranker'],
    typical: ['search', 'knowledge', 'brain', 'memory', 'tool', 'vector_db', 'reranker'],
  },
  {
    id: 'productivity',
    emoji: '🗂️',
    label: 'Productivity',
    description: 'Gets tasks done for you.',
    core: ['brain', 'tool'],
    recommended: ['memory', 'calculator', 'knowledge', 'guardrail'],
    typical: ['brain', 'tool', 'memory', 'calculator', 'knowledge', 'search', 'guardrail'],
  },
  {
    id: 'coding',
    emoji: '💻',
    label: 'Coding',
    description: 'Generates and executes software code.',
    core: ['brain', 'code_interpreter'],
    recommended: ['memory', 'calculator'],
    typical: ['brain', 'code_interpreter', 'memory', 'calculator', 'knowledge', 'search'],
  },
  {
    id: 'security',
    emoji: '🛡️',
    label: 'Guarded AI',
    description: 'Enforces strict safety, policy & alignment rules.',
    core: ['guardrail', 'brain'],
    recommended: ['search', 'memory'],
    typical: ['guardrail', 'brain', 'search', 'knowledge', 'memory'],
  },
  {
    id: 'creative',
    emoji: '🎨',
    label: 'Creative Media',
    description: 'Synthesizes visual artwork & diffusion media.',
    core: ['brain', 'image_gen'],
    recommended: ['vision', 'fine_tuner'],
    typical: ['brain', 'image_gen', 'vision', 'fine_tuner', 'memory'],
  },
  {
    id: 'custom',
    emoji: '🧩',
    label: 'Custom',
    description: 'Anything you like — no rules.',
    core: [],
    recommended: [],
    typical: ALL,
  },
];

export const getCategory = (id: string): FreeCategory | undefined =>
  FREE_CATEGORIES.find(c => c.id === id);

/** Synthetic mission id used to store a Free Build project. */
export const freeMissionId = (id: FreeCategoryId): string => `free-${id}`;

/** Extract a category id from a synthetic free mission id, if it is one. */
export const categoryFromMissionId = (
  missionId: string,
): FreeCategoryId | null =>
  missionId.startsWith('free-')
    ? (missionId.slice('free-'.length) as FreeCategoryId)
    : null;

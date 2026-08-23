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
];

export const FREE_CATEGORIES: FreeCategory[] = [
  {
    id: 'chat',
    emoji: '💬',
    label: 'Chat',
    description: 'A text assistant you can talk with.',
    core: ['brain'],
    recommended: ['memory', 'knowledge'],
    typical: ['brain', 'memory', 'knowledge', 'search', 'tool', 'calculator'],
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
    recommended: ['knowledge'],
    typical: ['vision', 'brain', 'knowledge', 'tool'],
  },
  {
    id: 'education',
    emoji: '📚',
    label: 'Education',
    description: 'Teaches accurately and remembers the learner.',
    core: ['brain', 'knowledge'],
    recommended: ['memory'],
    typical: ['brain', 'knowledge', 'memory', 'search', 'calculator'],
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
    recommended: ['memory'],
    typical: ['search', 'knowledge', 'brain', 'memory', 'tool'],
  },
  {
    id: 'productivity',
    emoji: '🗂️',
    label: 'Productivity',
    description: 'Gets tasks done for you.',
    core: ['brain', 'tool'],
    recommended: ['memory', 'calculator', 'knowledge'],
    typical: ['brain', 'tool', 'memory', 'calculator', 'knowledge', 'search'],
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

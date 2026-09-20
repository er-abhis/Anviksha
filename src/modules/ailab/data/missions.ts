/**
 * The eight AI Lab missions. Each teaches a DIFFERENT AI concept and defines
 * its required / optional / invalid components plus the ideal solution pipeline.
 * All local — no network, no real AI. Validation (Phase 3), simulation (Phase 4)
 * and challenges (Phase 5) read from these definitions.
 */

import { LabComponentId, Mission } from '../types';

export const MISSIONS: Mission[] = [
  {
    id: 'chatbot',
    emoji: '🤖',
    title: 'Build a Chatbot',
    tagline: 'A friend you can type to.',
    concept: 'The AI Brain — a model that understands and writes language.',
    objective:
      'Build an AI that can hold a text conversation. At its heart every chatbot needs an AI Brain to understand what you type and write a reply.',
    difficulty: 'Beginner',
    accent: 'primary',
    required: ['brain'],
    optional: ['memory', 'knowledge'],
    invalid: ['vision', 'voice_input'],
    solution: ['brain'],
  },
  {
    id: 'voice_assistant',
    emoji: '🎤',
    title: 'Build a Voice Assistant',
    tagline: 'Talk to it, it talks back.',
    concept: 'A voice pipeline — hear, understand, answer, speak.',
    objective:
      'Build an AI you can speak to out loud. It has to hear you, turn speech into text, think of an answer, then say it back.',
    difficulty: 'Intermediate',
    accent: 'accent',
    required: ['voice_input', 'stt', 'brain', 'tts'],
    optional: ['memory', 'knowledge'],
    invalid: ['vision'],
    solution: ['voice_input', 'stt', 'brain', 'tts'],
  },
  {
    id: 'ai_tutor',
    emoji: '📚',
    title: 'Build an AI Tutor',
    tagline: 'Explains anything, patiently.',
    concept: 'Grounding — an AI Brain backed by real Knowledge.',
    objective:
      'Build an AI that teaches a subject accurately. A Brain alone can guess — pair it with Knowledge so its answers are grounded in facts.',
    difficulty: 'Beginner',
    accent: 'success',
    required: ['brain', 'knowledge'],
    optional: ['memory'],
    invalid: ['vision', 'voice_input'],
    solution: ['knowledge', 'brain'],
  },
  {
    id: 'plant_ai',
    emoji: '🌱',
    title: 'Build a Plant AI',
    tagline: 'Snap a leaf, learn the plant.',
    concept: 'Vision + Knowledge — see something, then explain it.',
    objective:
      'Build an AI that identifies a plant from a photo and tells you about it. It needs Vision to see the plant and Knowledge to describe it.',
    difficulty: 'Intermediate',
    accent: 'success',
    required: ['vision', 'knowledge', 'brain'],
    optional: [],
    invalid: ['voice_input', 'stt'],
    solution: ['vision', 'knowledge', 'brain'],
  },
  {
    id: 'image_detective',
    emoji: '👁️',
    title: 'Build an Image Detective',
    tagline: 'Finds what is hiding in a picture.',
    concept: 'Computer Vision — recognising objects in an image.',
    objective:
      'Build an AI that looks at a picture and reports what it finds. Vision does the seeing; the Brain turns detections into a clear answer.',
    difficulty: 'Intermediate',
    accent: 'primary',
    required: ['vision', 'brain'],
    optional: ['knowledge'],
    invalid: ['voice_input', 'stt', 'tts'],
    solution: ['vision', 'brain'],
  },
  {
    id: 'ai_game',
    emoji: '🎮',
    title: 'Build an AI Game',
    tagline: 'An opponent that plays to win.',
    concept: 'Tools & actions — an AI that decides and acts.',
    objective:
      'Build an AI that plays a game. The Brain decides the move and a Tool lets it actually make that move in the game.',
    difficulty: 'Advanced',
    accent: 'coins',
    required: ['brain', 'tool'],
    optional: ['memory'],
    invalid: ['voice_input', 'tts'],
    solution: ['brain', 'tool'],
  },
  {
    id: 'research_assistant',
    emoji: '🔎',
    title: 'Build a Research Assistant',
    tagline: 'Digs up answers with sources.',
    concept: 'Retrieval-Augmented Generation — search, then reason.',
    objective:
      'Build an AI that answers hard questions using real sources. It Searches a Knowledge store for relevant facts, then the Brain writes the answer.',
    difficulty: 'Advanced',
    accent: 'accent',
    required: ['search', 'knowledge', 'brain'],
    optional: ['memory'],
    invalid: ['vision', 'voice_input'],
    solution: ['search', 'knowledge', 'brain'],
  },
  {
    id: 'memory_assistant',
    emoji: '🧠',
    title: 'Build a Memory Assistant',
    tagline: 'Never forgets what you told it.',
    concept: 'Memory & retrieval — recalling past context.',
    objective:
      'Build an AI that remembers you across conversations. The Brain thinks, while Memory stores and recalls what happened before.',
    difficulty: 'Intermediate',
    accent: 'warning',
    required: ['brain', 'memory'],
    optional: ['search'],
    invalid: ['vision'],
    solution: ['brain', 'memory'],
  },
  {
    id: 'code_copilot',
    emoji: '💻',
    title: 'Build a Code Co-pilot',
    tagline: 'Writes and executes python code.',
    concept: 'Sandboxed Execution — generating & evaluating live scripts.',
    objective:
      'Build an AI that generates code and executes it in a sandbox. The Brain plans the logic, and the Code Interpreter executes it.',
    difficulty: 'Intermediate',
    accent: 'accent',
    required: ['brain', 'code_interpreter'],
    optional: ['memory', 'calculator'],
    invalid: ['voice_input', 'image_gen'],
    solution: ['brain', 'code_interpreter'],
  },
  {
    id: 'guarded_banking_bot',
    emoji: '🛡️',
    title: 'Build a Guarded Banking Bot',
    tagline: 'Safe, policy-compliant finance bot.',
    concept: 'Safety Guardrails — filtering toxic or unaligned inputs/outputs.',
    objective:
      'Build a secure AI financial bot. A Guardrail filters malicious inputs before Search & Brain access banking records.',
    difficulty: 'Advanced',
    accent: 'primary',
    required: ['guardrail', 'search', 'brain'],
    optional: ['knowledge', 'memory'],
    invalid: ['image_gen', 'vision'],
    solution: ['guardrail', 'search', 'brain'],
  },
  {
    id: 'multimodal_vision_artist',
    emoji: '🎨',
    title: 'Build a Vision Artist',
    tagline: 'Sees an image, generates art back.',
    concept: 'Multimodal Synthesis — Vision analysis into Diffusion generation.',
    objective:
      'Build an AI that inspects a visual image with Vision, interprets it with an AI Brain, and creates a stylized artwork using Image Generator.',
    difficulty: 'Advanced',
    accent: 'coins',
    required: ['vision', 'brain', 'image_gen'],
    optional: ['fine_tuner'],
    invalid: ['stt', 'calculator'],
    solution: ['vision', 'brain', 'image_gen'],
  },
  {
    id: 'hyper_personalized_rag',
    emoji: '⚡',
    title: 'Build a High-Speed RAG Engine',
    tagline: 'Ultra-fast vector search & reranking.',
    concept: 'Advanced Vector RAG — Vector DB indexing + Reranker relevance.',
    objective:
      'Build an enterprise RAG pipeline. Vector DB retrieves candidate matches, Reranker scores top facts, and Brain synthesizes the answer.',
    difficulty: 'Advanced',
    accent: 'success',
    required: ['vector_db', 'reranker', 'brain'],
    optional: ['knowledge', 'memory'],
    invalid: ['voice_input', 'tts'],
    solution: ['vector_db', 'reranker', 'brain'],
  },
];

export const getMission = (id: string): Mission | undefined =>
  MISSIONS.find(m => m.id === id);

/**
 * The blocks offered in the builder tray for a mission: the required + optional
 * components plus the invalid ones as distractors. Deduped, stable order so a
 * build can be reproduced (true randomisation arrives in Phase 7).
 */
export const missionPool = (mission: Mission): LabComponentId[] => [
  ...new Set([...mission.required, ...mission.optional, ...mission.invalid]),
];

/** Picks a random mission id, optionally avoiding one (for "Surprise Me"). */
export const pickRandomMissionId = (avoid?: string): string => {
  const pool = avoid ? MISSIONS.filter(m => m.id !== avoid) : MISSIONS;
  const list = pool.length ? pool : MISSIONS;
  return list[Math.floor(Math.random() * list.length)].id;
};

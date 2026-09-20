/**
 * The AI Lab component catalog — the source of truth for every building block.
 * Missions reference these by id; the builder tray renders straight from here.
 */

import { LabComponent, LabComponentId } from '../types';

export const LAB_COMPONENTS: Record<LabComponentId, LabComponent> = {
  voice_input: {
    id: 'voice_input',
    emoji: '🎤',
    label: 'Voice Input',
    icon: 'mic',
    blurb: "Captures the user's spoken words as audio.",
    category: 'input',
  },
  stt: {
    id: 'stt',
    emoji: '🗣️',
    label: 'Speech-to-Text',
    icon: 'chatbox-ellipses',
    blurb: 'Turns spoken audio into written text the AI can read.',
    category: 'process',
  },
  brain: {
    id: 'brain',
    emoji: '🧠',
    label: 'AI Brain',
    icon: 'sparkles',
    blurb: 'Understands the input and works out what to say or do.',
    category: 'process',
  },
  memory: {
    id: 'memory',
    emoji: '💾',
    label: 'Memory',
    icon: 'save',
    blurb: 'Remembers earlier parts of the conversation.',
    category: 'memory',
  },
  knowledge: {
    id: 'knowledge',
    emoji: '📚',
    label: 'Knowledge',
    icon: 'library',
    blurb: 'A store of facts the AI can look things up in.',
    category: 'knowledge',
  },
  search: {
    id: 'search',
    emoji: '🔎',
    label: 'Search',
    icon: 'search',
    blurb: 'Finds the most relevant information for a question.',
    category: 'knowledge',
  },
  tts: {
    id: 'tts',
    emoji: '🔊',
    label: 'Text-to-Speech',
    icon: 'volume-high',
    blurb: 'Reads the answer back out loud.',
    category: 'output',
  },
  calculator: {
    id: 'calculator',
    emoji: '🧮',
    label: 'Calculator',
    icon: 'calculator',
    blurb: 'Does exact maths the AI can call on.',
    category: 'tool',
  },
  vision: {
    id: 'vision',
    emoji: '👁️',
    label: 'Vision',
    icon: 'eye',
    blurb: 'Looks at an image and recognises what is in it.',
    category: 'input',
  },
  tool: {
    id: 'tool',
    emoji: '🔧',
    label: 'Tool',
    icon: 'construct',
    blurb: 'Lets the AI take an action in the outside world.',
    category: 'tool',
  },
  guardrail: {
    id: 'guardrail',
    emoji: '🛡️',
    label: 'Guardrail',
    icon: 'shield-checkmark',
    blurb: 'Filters out unsafe, harmful, or policy-violating prompts & replies.',
    category: 'security',
  },
  vector_db: {
    id: 'vector_db',
    emoji: '⚡',
    label: 'Vector DB',
    icon: 'server',
    blurb: 'Indexes high-dimensional vector embeddings for instant semantic search.',
    category: 'knowledge',
  },
  reranker: {
    id: 'reranker',
    emoji: '🎯',
    label: 'Reranker',
    icon: 'filter',
    blurb: 'Reranks retrieved context items by relevance score before reasoning.',
    category: 'process',
  },
  code_interpreter: {
    id: 'code_interpreter',
    emoji: '💻',
    label: 'Code Interpreter',
    icon: 'code-slash',
    blurb: 'Executes Python and algorithm logic in a secure sandbox.',
    category: 'tool',
  },
  fine_tuner: {
    id: 'fine_tuner',
    emoji: '🎛️',
    label: 'Model Adapter',
    icon: 'options',
    blurb: 'Applies domain-specific LoRA weights to specialize AI behavior.',
    category: 'process',
  },
  image_gen: {
    id: 'image_gen',
    emoji: '🎨',
    label: 'Image Generator',
    icon: 'image',
    blurb: 'Synthesizes new images and graphics directly from text prompts.',
    category: 'output',
  },
};

/** Stable ordered list for the component tray. */
export const LAB_COMPONENT_LIST: LabComponent[] = Object.values(LAB_COMPONENTS);

export const getComponent = (id: LabComponentId): LabComponent =>
  LAB_COMPONENTS[id];

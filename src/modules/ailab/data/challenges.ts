/**
 * Local challenge pool — the game-loop hurdles for each mission. All offline,
 * data-driven (see challenges/resolve.ts). Every challenge starts from a broken
 * or sub-optimal build and is fixed by adding, removing or reordering blocks.
 */

import { Challenge } from '../types';

export const CHALLENGES: Challenge[] = [
  // ── Chatbot ──────────────────────────────────────────────
  {
    id: 'chatbot-memory',
    missionId: 'chatbot',
    type: 'missing_capability',
    prompt: 'Your chatbot answers well, but forgets everything you said a moment ago.',
    promptVariants: [
      'Every reply starts from scratch — the bot has no sense of history.',
      'Ask a follow-up and your chatbot has no idea what you meant.',
    ],
    hint: 'It needs somewhere to keep the conversation.',
    startComponents: ['brain'],
    options: ['memory', 'knowledge', 'vision'],
    expectAdd: ['memory'],
    success: 'Memory lets the chatbot recall earlier messages, so the chat feels continuous.',
  },
  {
    id: 'chatbot-facts',
    missionId: 'chatbot',
    type: 'missing_capability',
    prompt: 'Your chatbot confidently makes up facts it isn\'t sure about.',
    hint: 'Ground it in something real.',
    startComponents: ['brain', 'memory'],
    options: ['knowledge', 'vision', 'calculator'],
    expectAdd: ['knowledge'],
    success: 'Knowledge gives the Brain real facts to draw on instead of guessing.',
  },

  // ── Voice Assistant ──────────────────────────────────────
  {
    id: 'voice-stt',
    missionId: 'voice_assistant',
    type: 'missing_component',
    prompt: 'Your AI can hear the user but cannot understand the words.',
    promptVariants: [
      'What component converts spoken language into text?',
      'Your voice pipeline is missing an interpretation step.',
      'The AI receives audio but has no idea what was said.',
    ],
    hint: 'What turns spoken sound into text?',
    startComponents: ['voice_input', 'brain', 'tts'],
    options: ['stt', 'vision', 'knowledge'],
    expectAdd: ['stt'],
    success: 'Speech-to-Text converts the audio into words the AI Brain can read.',
  },
  {
    id: 'voice-remove-vision',
    missionId: 'voice_assistant',
    type: 'wrong_component',
    prompt: 'A component snuck in that a voice assistant has no use for.',
    hint: 'Voice is about sound, not pictures.',
    startComponents: ['voice_input', 'stt', 'brain', 'tts', 'vision'],
    options: [],
    expectRemove: ['vision'],
    success: 'Vision is for images — removing it leaves a clean voice pipeline.',
  },

  // ── AI Tutor ─────────────────────────────────────────────
  {
    id: 'tutor-knowledge',
    missionId: 'ai_tutor',
    type: 'missing_component',
    prompt: 'Your tutor sometimes gives confident but wrong answers.',
    hint: 'Accuracy needs a source of truth.',
    startComponents: ['brain'],
    options: ['knowledge', 'vision', 'tool'],
    expectAdd: ['knowledge'],
    success: 'Knowledge grounds every lesson in real facts, so answers stay correct.',
  },
  {
    id: 'tutor-remove-voice',
    missionId: 'ai_tutor',
    type: 'wrong_component',
    prompt: 'Your text-based tutor has an unnecessary listening component.',
    hint: 'It reads and writes — it does not listen.',
    startComponents: ['knowledge', 'brain', 'voice_input'],
    options: [],
    expectRemove: ['voice_input'],
    success: 'A text tutor needs no microphone — dropping Voice Input simplifies it.',
  },

  // ── Plant AI ─────────────────────────────────────────────
  {
    id: 'plant-knowledge',
    missionId: 'plant_ai',
    type: 'missing_component',
    prompt: 'Your AI can see the plant but knows nothing about it.',
    promptVariants: [
      'It recognises a leaf shape but can\'t say what species it is.',
      'Your AI detects a plant, then has nothing useful to tell the user.',
    ],
    hint: 'Seeing is not the same as knowing.',
    startComponents: ['vision', 'brain'],
    options: ['knowledge', 'stt', 'tool'],
    expectAdd: ['knowledge'],
    success: 'Knowledge turns "a green leafy thing" into real facts about the plant.',
  },
  {
    id: 'plant-vision',
    missionId: 'plant_ai',
    type: 'missing_component',
    prompt: 'Your AI has facts about plants but can\'t actually look at the photo.',
    hint: 'It needs eyes.',
    startComponents: ['knowledge', 'brain'],
    options: ['vision', 'tts', 'search'],
    expectAdd: ['vision'],
    success: 'Vision lets the AI see the plant in the image before describing it.',
  },

  // ── Image Detective ──────────────────────────────────────
  {
    id: 'detective-vision',
    missionId: 'image_detective',
    type: 'missing_component',
    prompt: 'Your image detective has no way to see the picture.',
    hint: 'Detection starts with sight.',
    startComponents: ['brain'],
    options: ['vision', 'stt', 'memory'],
    expectAdd: ['vision'],
    success: 'Vision detects the objects; the Brain turns those into a clear answer.',
  },
  {
    id: 'detective-remove-tts',
    missionId: 'image_detective',
    type: 'wrong_component',
    prompt: 'A speaking component slipped into an image-only tool.',
    hint: 'This one reports in text, not speech.',
    startComponents: ['vision', 'brain', 'tts'],
    options: [],
    expectRemove: ['tts'],
    success: 'An image detective returns text results — Text-to-Speech is unneeded.',
  },

  // ── AI Game ──────────────────────────────────────────────
  {
    id: 'game-tool',
    missionId: 'ai_game',
    type: 'missing_component',
    prompt: 'Your AI works out a great move but can\'t actually play it.',
    promptVariants: [
      'Your AI has a plan but no way to make a move on the board.',
      'The Brain decides — but nothing connects that decision to the game.',
    ],
    hint: 'Deciding is not the same as doing.',
    startComponents: ['brain'],
    options: ['tool', 'vision', 'tts'],
    expectAdd: ['tool'],
    success: 'A Tool lets the Brain turn its decision into a real move in the game.',
  },
  {
    id: 'game-memory',
    missionId: 'ai_game',
    type: 'optimization',
    prompt: 'Your AI keeps repeating the same losing move.',
    hint: 'It should learn from what already happened.',
    startComponents: ['brain', 'tool'],
    options: ['memory', 'knowledge', 'stt'],
    expectAdd: ['memory'],
    success: 'Memory lets the AI recall past moves and stop repeating mistakes.',
  },

  // ── Research Assistant ───────────────────────────────────
  {
    id: 'research-search',
    missionId: 'research_assistant',
    type: 'missing_component',
    prompt: 'Your assistant has a huge library but can\'t find the right facts in it.',
    hint: 'It needs a way to look things up.',
    startComponents: ['knowledge', 'brain'],
    options: ['search', 'vision', 'tts'],
    expectAdd: ['search'],
    success: 'Search finds the most relevant facts; the Brain writes the answer from them.',
  },
  {
    id: 'research-knowledge',
    missionId: 'research_assistant',
    type: 'missing_component',
    prompt: 'Your assistant can search, but there is no library for it to search through.',
    hint: 'Search needs something to search.',
    startComponents: ['search', 'brain'],
    options: ['knowledge', 'tool', 'memory'],
    expectAdd: ['knowledge'],
    success: 'Knowledge is the library Search draws relevant facts from — together they do RAG.',
  },

  // ── Memory Assistant ─────────────────────────────────────
  {
    id: 'memory-add',
    missionId: 'memory_assistant',
    type: 'missing_component',
    prompt: 'Your assistant never remembers anything from past conversations.',
    promptVariants: [
      'Come back tomorrow and the assistant has forgotten you entirely.',
      'Nothing you tell this assistant sticks around.',
    ],
    hint: 'The name of the mission is a hint.',
    startComponents: ['brain'],
    options: ['memory', 'vision', 'tts'],
    expectAdd: ['memory'],
    success: 'Memory stores and recalls what happened before, so nothing is forgotten.',
  },
  {
    id: 'memory-order',
    missionId: 'memory_assistant',
    type: 'wrong_connection',
    prompt: 'Both pieces are here, but they are wired back-to-front.',
    hint: 'The Brain thinks first, then reaches into Memory.',
    startComponents: ['memory', 'brain'],
    options: [],
    expectOrder: ['brain', 'memory'],
    success: 'The Brain leads and calls on Memory — order matters in a pipeline.',
  },
];

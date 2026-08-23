import { Question, QuestionMedia } from './types';

/**
 * Curated concept → icon rules. A question gets a visual ONLY when its text
 * clearly names one of these concepts, so icons support understanding and are
 * never decorative filler. Order matters — the first match wins, so specific
 * concepts sit above general ones. Icons are Ionicons names (offline, instant).
 */
const RULES: { match: RegExp; icon: string; alt: string }[] = [
  { match: /neural network|neuron/, icon: 'git-network', alt: 'A neural network of connected nodes' },
  { match: /generative|gen ?ai/, icon: 'sparkles', alt: 'Generative AI creating new content' },
  { match: /large language model|\bllm\b/, icon: 'chatbubbles', alt: 'A large language model' },
  { match: /speech|text-to-speech|speech-to-text|\bvoice\b|spoken/, icon: 'mic', alt: 'Speech and voice' },
  { match: /computer vision|image recognition|\bvision\b|\bface\b|photo|camera/, icon: 'image', alt: 'Computer vision and images' },
  { match: /translat/, icon: 'language', alt: 'Language translation' },
  { match: /recommend/, icon: 'thumbs-up', alt: 'A recommendation system' },
  { match: /self-driving|self driving|autonomous (car|vehicle)|driverless/, icon: 'car', alt: 'A self-driving car' },
  { match: /chatbot|conversation|\bchat\b/, icon: 'chatbubbles', alt: 'A chatbot conversation' },
  { match: /\brobot/, icon: 'hardware-chip', alt: 'A robot' },
  { match: /\bagent\b|workflow/, icon: 'git-branch', alt: 'An AI agent workflow' },
  { match: /\bprompt/, icon: 'create', alt: 'Writing a prompt' },
  { match: /retriev|\brag\b|\bsearch\b/, icon: 'search', alt: 'Search and retrieval' },
  { match: /predict|forecast/, icon: 'trending-up', alt: 'Making a prediction' },
  { match: /classif|categor|\bsort\b/, icon: 'file-tray-stacked', alt: 'Classifying into categories' },
  { match: /privacy|\bbias\b|ethic|fair|\bsafe(ty)?\b/, icon: 'shield-checkmark', alt: 'AI safety and ethics' },
  { match: /\bgpu\b|hardware|\bchip\b|processor/, icon: 'hardware-chip', alt: 'AI hardware' },
  { match: /\bcloud\b/, icon: 'cloud', alt: 'Cloud computing' },
  { match: /training data|dataset|\bdata\b/, icon: 'server', alt: 'Training data' },
  { match: /algorithm/, icon: 'cube', alt: 'An algorithm' },
];

/** Resolve a concept icon for a question, or undefined if none clearly fits. */
export const resolveQuestionMedia = (q: Question): QuestionMedia | undefined => {
  const hay = `${q.topic} ${q.prompt}`.toLowerCase();
  const rule = RULES.find(r => r.match.test(hay));
  return rule ? { icon: rule.icon, alt: rule.alt } : undefined;
};

/** Attach a resolved icon unless the question already carries explicit media. */
export const attachMedia = (q: Question): Question => {
  if (q.media) return q;
  const media = resolveQuestionMedia(q);
  return media ? { ...q, media } : q;
};

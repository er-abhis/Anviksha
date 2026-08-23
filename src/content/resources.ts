/**
 * Curated external learning resources. Every URL is a real, reputable, stable
 * root from an official source — NONE are invented. Shown under a clear
 * "Learn More" label so the learner knows these open external sites, not
 * Anviksha content. Opened via utils/appLinks openExternal (system browser).
 */
export interface Resource {
  label: string;
  /** Shown so the destination is obvious before tapping. */
  source: string;
  url: string;
}

export interface ResourceCategory {
  title: string;
  blurb: string;
  items: Resource[];
}

export const RESOURCES: ResourceCategory[] = [
  {
    title: 'Start Here',
    blurb: 'Friendly, no-code introductions to AI.',
    items: [
      { label: 'Elements of AI — free intro course', source: 'elementsofai.com', url: 'https://www.elementsofai.com/' },
      { label: 'Google Machine Learning Crash Course', source: 'developers.google.com', url: 'https://developers.google.com/machine-learning/crash-course' },
      { label: 'Microsoft — AI for Beginners', source: 'microsoft.github.io', url: 'https://microsoft.github.io/AI-For-Beginners/' },
    ],
  },
  {
    title: 'Hands-on Learning',
    blurb: 'Practical courses to build real skills.',
    items: [
      { label: 'Kaggle Learn — short practical courses', source: 'kaggle.com', url: 'https://www.kaggle.com/learn' },
      { label: 'DeepLearning.AI — courses', source: 'deeplearning.ai', url: 'https://www.deeplearning.ai/courses/' },
      { label: 'fast.ai — practical deep learning', source: 'fast.ai', url: 'https://www.fast.ai/' },
      { label: 'Hugging Face — learn hub', source: 'huggingface.co', url: 'https://huggingface.co/learn' },
    ],
  },
  {
    title: 'Official Documentation',
    blurb: 'Reference docs from the model makers.',
    items: [
      { label: 'Anthropic (Claude) docs', source: 'docs.anthropic.com', url: 'https://docs.anthropic.com/' },
      { label: 'OpenAI API docs', source: 'platform.openai.com', url: 'https://platform.openai.com/docs' },
      { label: 'Google AI', source: 'ai.google', url: 'https://ai.google/' },
      { label: 'Hugging Face docs', source: 'huggingface.co', url: 'https://huggingface.co/docs' },
    ],
  },
  {
    title: 'Go Deeper',
    blurb: 'Foundational research for the curious.',
    items: [
      { label: '“Attention Is All You Need” (Transformers)', source: 'arxiv.org', url: 'https://arxiv.org/abs/1706.03762' },
      { label: 'arXiv — AI research papers', source: 'arxiv.org', url: 'https://arxiv.org/list/cs.AI/recent' },
    ],
  },
];

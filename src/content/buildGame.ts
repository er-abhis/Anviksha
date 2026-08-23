/**
 * "Build the AI" — data for the architecture-building game. The learner picks
 * components and arranges them into the correct pipeline for a scenario. This
 * is authored data (like lessons); the screen renders whatever is here.
 * Components + blurbs are shared with the "What would you build?" flow (Phase 11).
 */

export interface AIComponent {
  id: string;
  label: string;
  icon: string; // Ionicons
  /** One-line plain explanation, shown when explaining the built stack. */
  blurb: string;
}

export interface BuildScenario {
  id: string;
  title: string;
  /** The "You want to build…" setup shown to the learner. */
  brief: string;
  /** Component ids offered (solution + plausible distractors). */
  pool: string[];
  /** The correct pipeline, in order. */
  solution: string[];
  /** Why this flow is right — shown after a correct build. */
  explanation: string;
}

export const BUILD_COMPONENTS: Record<string, AIComponent> = {
  stt: { id: 'stt', label: 'Speech-to-Text', icon: 'mic', blurb: 'Converts spoken audio into written text.' },
  tts: { id: 'tts', label: 'Text-to-Speech', icon: 'volume-high', blurb: 'Converts text back into natural speech.' },
  llm: { id: 'llm', label: 'LLM', icon: 'chatbubbles', blurb: 'A large language model that understands and generates language.' },
  vision: { id: 'vision', label: 'Computer Vision', icon: 'eye', blurb: 'Detects objects and features in images.' },
  imageModel: { id: 'imageModel', label: 'Image Model', icon: 'image', blurb: 'Generates or edits images from a description.' },
  embeddings: { id: 'embeddings', label: 'Embeddings', icon: 'grid', blurb: 'Turns text or data into meaning vectors.' },
  vectorDb: { id: 'vectorDb', label: 'Vector Database', icon: 'search', blurb: 'Finds items by meaning using embeddings.' },
  database: { id: 'database', label: 'Database', icon: 'server', blurb: 'Stores and retrieves structured data.' },
  api: { id: 'api', label: 'API', icon: 'git-network', blurb: 'Connects the app to a service over the network.' },
  backend: { id: 'backend', label: 'Backend', icon: 'construct', blurb: 'Runs the app logic and ties components together.' },
  recommender: { id: 'recommender', label: 'Recommendation Engine', icon: 'thumbs-up', blurb: 'Ranks the items a user is most likely to want.' },
  camera: { id: 'camera', label: 'Camera', icon: 'camera', blurb: 'Captures the photo or video the app works with.' },
  docs: { id: 'docs', label: 'Documents', icon: 'document-text', blurb: 'The source files the system reads from.' },
  dataset: { id: 'dataset', label: 'Training Data', icon: 'albums', blurb: 'Examples the model learns patterns from.' },
};

export const BUILD_SCENARIOS: BuildScenario[] = [
  {
    id: 'voice-assistant',
    title: 'Voice Assistant',
    brief: 'You want to build an AI app that understands a user’s voice and answers out loud.',
    pool: ['stt', 'llm', 'tts', 'imageModel', 'database'],
    solution: ['stt', 'llm', 'tts'],
    explanation: 'Speech-to-Text turns the spoken question into text, the LLM works out an answer, and Text-to-Speech reads it back aloud.',
  },
  {
    id: 'image-recognition',
    title: 'Image Recognition',
    brief: 'You want to build an app that recognises what’s in a photo.',
    pool: ['camera', 'vision', 'backend', 'tts', 'llm'],
    solution: ['camera', 'vision', 'backend'],
    explanation: 'The Camera captures the image, Computer Vision detects what’s in it, and the Backend returns the result to the app.',
  },
  {
    id: 'photo-caption',
    title: 'Photo Caption Writer',
    brief: 'You want an app that looks at a photo and writes a caption for it.',
    pool: ['camera', 'vision', 'llm', 'tts', 'database'],
    solution: ['camera', 'vision', 'llm'],
    explanation: 'The Camera captures the photo, Computer Vision identifies what’s in it, and the LLM turns that into a natural caption.',
  },
  {
    id: 'doc-qa',
    title: 'Document Q&A',
    brief: 'You want to build an app that answers questions about your own documents.',
    pool: ['docs', 'embeddings', 'vectorDb', 'llm', 'camera'],
    solution: ['docs', 'embeddings', 'vectorDb', 'llm'],
    explanation: 'Documents are turned into Embeddings, stored in a Vector Database so the most relevant parts can be found by meaning, then the LLM answers using them. This is “RAG”.',
  },
  {
    id: 'recommendation',
    title: 'Recommendation System',
    brief: 'You want to build an app that recommends items a user will like.',
    pool: ['dataset', 'embeddings', 'recommender', 'tts', 'camera'],
    solution: ['dataset', 'embeddings', 'recommender'],
    explanation: 'Training Data of past behaviour becomes Embeddings that capture taste, and the Recommendation Engine ranks what to show next.',
  },
  {
    id: 'semantic-search',
    title: 'Search by Meaning',
    brief: 'You want a search that finds results by meaning, not just exact words.',
    pool: ['docs', 'embeddings', 'vectorDb', 'llm', 'backend'],
    solution: ['docs', 'embeddings', 'vectorDb'],
    explanation: 'Documents become Embeddings, and a Vector Database finds the closest matches by meaning — no LLM needed for search itself.',
  },
  {
    id: 'chatbot',
    title: 'Chatbot',
    brief: 'You want to build a simple chatbot that answers users in text.',
    pool: ['llm', 'backend', 'vision', 'tts', 'camera'],
    solution: ['llm', 'backend'],
    explanation: 'The LLM generates the reply and the Backend serves it to the app — the core of a text chatbot.',
  },
  {
    id: 'plant-id',
    title: 'Plant Identifier',
    brief: 'You want to build an AI app that recognises plants from a photo.',
    pool: ['camera', 'vision', 'backend', 'database', 'tts', 'llm'],
    solution: ['camera', 'vision', 'backend', 'database'],
    explanation: 'The Camera captures the plant, Computer Vision identifies the species, the Backend handles the request, and the Database stores and looks up plant details.',
  },
  {
    id: 'image-generator',
    title: 'Image Generator',
    brief: 'You want an app where a user types a description and gets an image.',
    pool: ['llm', 'imageModel', 'backend', 'vision', 'camera'],
    solution: ['llm', 'imageModel', 'backend'],
    explanation: 'The LLM refines the user’s prompt, the Image Model creates the picture, and the Backend delivers it to the app.',
  },
];

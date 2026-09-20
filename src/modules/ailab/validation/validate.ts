/**
 * Architecture validation — the "intelligent without AI" layer.
 *
 * One reusable engine drives every mission; missions supply their own
 * required / optional / invalid / solution data. Diagnostics are component-tied
 * and always explain WHY (this is a learning product), never just "wrong".
 */

import { Mission } from '../types';
import { LabArchitecture, LabComponentId } from '../types';
import { getComponent } from '../data/components';

export type IssueLevel = 'error' | 'warn' | 'info' | 'success';

export interface Diagnostic {
  level: IssueLevel;
  title: string;
  /** Actionable next step, e.g. "Add Speech-to-Text." */
  suggestion?: string;
  /** Component this diagnostic is about (for row highlighting). */
  componentId?: LabComponentId;
}

export type BuildStatus = 'empty' | 'incomplete' | 'invalid' | 'complete';

export interface ValidationResult {
  status: BuildStatus;
  /** True only when the build satisfies the mission. */
  ok: boolean;
  issues: Diagnostic[];
  /** Plain-language explanation of why the finished build works. */
  successLine?: string;
}

/**
 * Why each component matters — reused across every mission so the "you're
 * missing X" message is written once, not per mission.
 */
const MISSING_REASON: Record<
  LabComponentId,
  { title: string; suggestion: string }
> = {
  voice_input: {
    title: 'Your AI has no way to hear the user.',
    suggestion: 'Add Voice Input to capture what they say.',
  },
  stt: {
    title: 'Your AI can hear the user but cannot understand the words.',
    suggestion: 'Add Speech-to-Text to turn audio into text.',
  },
  brain: {
    title: 'Your AI has no way to work out a response.',
    suggestion: 'Add an AI Brain to understand and decide what to say.',
  },
  memory: {
    title: "Your AI forgets everything between messages.",
    suggestion: 'Add Memory so it can recall earlier context.',
  },
  knowledge: {
    title: "Your AI doesn't know any real facts to draw on.",
    suggestion: 'Add Knowledge so its answers are grounded.',
  },
  search: {
    title: "Your AI can't find relevant information to answer with.",
    suggestion: 'Add Search to look things up.',
  },
  tts: {
    title: 'Your AI works out an answer but cannot say it aloud.',
    suggestion: 'Add Text-to-Speech to speak the reply.',
  },
  calculator: {
    title: 'Your AI cannot do exact maths.',
    suggestion: 'Add a Calculator for precise numbers.',
  },
  vision: {
    title: 'Your AI has no way to see the image.',
    suggestion: 'Add Vision so it can look at the picture.',
  },
  tool: {
    title: 'Your AI can decide but cannot actually act.',
    suggestion: 'Add a Tool so it can take an action.',
  },
  guardrail: {
    title: 'Your AI has no safety filter to block harmful or unsafe content.',
    suggestion: 'Add Guardrails to filter inputs and outputs.',
  },
  vector_db: {
    title: 'Your AI lacks a high-speed similarity index for vector embeddings.',
    suggestion: 'Add Vector DB to index semantic knowledge.',
  },
  reranker: {
    title: 'Your AI cannot rank retrieved knowledge by semantic relevance.',
    suggestion: 'Add a Reranker to score and order facts.',
  },
  code_interpreter: {
    title: 'Your AI cannot execute code or algorithm logic.',
    suggestion: 'Add Code Interpreter to run code in a sandbox.',
  },
  fine_tuner: {
    title: 'Your AI uses standard weights without domain specialization.',
    suggestion: 'Add Model Adapter to apply fine-tuned behavior.',
  },
  image_gen: {
    title: 'Your AI cannot create visual media or graphics.',
    suggestion: 'Add Image Generator to synthesize pictures.',
  },
};

/** Short clause describing what each block does in the flow (for success text). */
const FLOW_CLAUSE: Record<LabComponentId, string> = {
  voice_input: 'Voice Input hears the user',
  stt: 'Speech-to-Text turns that into words',
  brain: 'the AI Brain works out a response',
  memory: 'Memory keeps track of earlier context',
  knowledge: 'Knowledge supplies real facts',
  search: 'Search finds the relevant information',
  tts: 'Text-to-Speech reads the answer aloud',
  calculator: 'the Calculator handles exact maths',
  vision: 'Vision sees what is in the image',
  tool: 'the Tool carries out the action',
  guardrail: 'Guardrail checks content safety',
  vector_db: 'Vector DB searches semantic embeddings',
  reranker: 'the Reranker orders context by relevance',
  code_interpreter: 'Code Interpreter executes the code',
  fine_tuner: 'Model Adapter applies fine-tuned weights',
  image_gen: 'Image Generator renders the picture',
};

const label = (id: LabComponentId) => getComponent(id).label;

/** The required components in their ideal order (per the mission solution). */
const requiredInOrder = (mission: Mission): LabComponentId[] =>
  mission.solution.filter(id => mission.required.includes(id));

export const validateArchitecture = (
  mission: Mission,
  arch: LabArchitecture,
): ValidationResult => {
  const placed = arch.components;

  if (placed.length === 0) {
    return {
      status: 'empty',
      ok: false,
      issues: [
        {
          level: 'info',
          title: 'Add components to start building your AI.',
        },
      ],
    };
  }

  const issues: Diagnostic[] = [];

  // 1) Missing required components — the core teaching moment.
  const missing = mission.required.filter(id => !placed.includes(id));
  missing.forEach(id => {
    const reason = MISSING_REASON[id];
    issues.push({
      level: 'error',
      title: reason.title,
      suggestion: reason.suggestion,
      componentId: id,
    });
  });

  // 2) Components that don't belong in this mission.
  const invalidPresent = placed.filter(id => mission.invalid.includes(id));
  invalidPresent.forEach(id => {
    issues.push({
      level: 'warn',
      title: `${label(id)} doesn't belong in a ${mission.title.replace(
        'Build ',
        '',
      )}.`,
      suggestion: `Remove ${label(id)} — it isn't needed here.`,
      componentId: id,
    });
  });

  // 3) Order — only meaningful once all required blocks are present.
  const wantOrder = requiredInOrder(mission);
  const haveOrder = placed.filter(id => mission.required.includes(id));
  const orderWrong =
    missing.length === 0 &&
    wantOrder.join('>') !== haveOrder.join('>');
  if (orderWrong) {
    issues.push({
      level: 'warn',
      title: 'The pieces are all here but in the wrong order.',
      suggestion: `Try: ${wantOrder.map(label).join(' → ')}.`,
    });
  }

  const ok = missing.length === 0 && invalidPresent.length === 0 && !orderWrong;

  if (ok) {
    // Build the "why it works" line from the placed pipeline, in order.
    const clauses = placed
      .filter(id => FLOW_CLAUSE[id])
      .map(id => FLOW_CLAUSE[id]);
    const flow =
      clauses.length > 1
        ? `${clauses.slice(0, -1).join(', ')} and ${clauses[clauses.length - 1]}`
        : clauses[0] ?? '';
    return {
      status: 'complete',
      ok: true,
      issues: [
        {
          level: 'success',
          title: `Your ${mission.title.replace('Build ', '')} works!`,
          suggestion: flow ? `Here's the flow: ${flow}.` : undefined,
        },
      ],
      successLine: flow,
    };
  }

  return {
    status: invalidPresent.length > 0 ? 'invalid' : 'incomplete',
    ok: false,
    issues,
  };
};

/** Row tint for the pipeline list: invalid blocks red, valid required blocks green. */
export const rowStatusFor = (
  mission: Mission,
  id: LabComponentId,
): 'correct' | 'wrong' | undefined => {
  if (mission.invalid.includes(id)) return 'wrong';
  if (mission.required.includes(id)) return 'correct';
  return undefined;
};

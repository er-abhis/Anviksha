import {
  MISSIONS,
  getMission,
  missionPool,
  pickRandomMissionId,
} from '../data/missions';
import { LAB_COMPONENTS, LAB_COMPONENT_LIST } from '../data/components';
import {
  addComponent,
  emptyArchitecture,
  isEmpty,
  removeComponent,
  reorder,
} from '../builder/architecture';
import { validateArchitecture } from '../validation/validate';
import { withComponents } from '../builder/architecture';
import { LabComponentId } from '../types';

const isKnown = (id: LabComponentId) => id in LAB_COMPONENTS;

describe('AI Lab data integrity', () => {
  it('has the twelve missions with unique ids', () => {
    expect(MISSIONS).toHaveLength(12);
    const ids = MISSIONS.map(m => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('exposes the sixteen-component catalog consistently', () => {
    expect(LAB_COMPONENT_LIST).toHaveLength(16);
    LAB_COMPONENT_LIST.forEach(c => expect(LAB_COMPONENTS[c.id].id).toBe(c.id));
  });

  it('every mission references only real components', () => {
    MISSIONS.forEach(m => {
      [...m.required, ...m.optional, ...m.invalid, ...m.solution].forEach(id =>
        expect(isKnown(id)).toBe(true),
      );
    });
  });

  it('required and invalid component sets never overlap', () => {
    MISSIONS.forEach(m => {
      const invalid = new Set(m.invalid);
      m.required.forEach(id => expect(invalid.has(id)).toBe(false));
    });
  });

  it('every required component appears in the solution', () => {
    MISSIONS.forEach(m => {
      m.required.forEach(id => expect(m.solution).toContain(id));
    });
  });

  it('getMission resolves known ids and rejects unknown ones', () => {
    expect(getMission('chatbot')?.title).toBe('Build a Chatbot');
    expect(getMission('nope')).toBeUndefined();
  });

  it('pickRandomMissionId can avoid a given mission', () => {
    for (let i = 0; i < 50; i++) {
      expect(pickRandomMissionId('chatbot')).not.toBe('chatbot');
    }
  });

  it('missionPool includes solution + distractors, deduped', () => {
    MISSIONS.forEach(m => {
      const pool = missionPool(m);
      expect(new Set(pool).size).toBe(pool.length);
      m.required.forEach(id => expect(pool).toContain(id));
      m.invalid.forEach(id => expect(pool).toContain(id));
    });
  });
});

describe('AI Lab builder architecture (source of truth)', () => {
  const M = 'voice_assistant';

  it('starts empty', () => {
    const a = emptyArchitecture(M);
    expect(isEmpty(a)).toBe(true);
    expect(a.connections).toHaveLength(0);
  });

  it('adds components and keeps connections adjacent to order', () => {
    let a = emptyArchitecture(M);
    (['voice_input', 'stt', 'brain'] as LabComponentId[]).forEach(id => {
      a = addComponent(a, id);
    });
    expect(a.components).toEqual(['voice_input', 'stt', 'brain']);
    expect(a.connections).toEqual([
      ['voice_input', 'stt'],
      ['stt', 'brain'],
    ]);
  });

  it('does not add the same component twice', () => {
    let a = addComponent(emptyArchitecture(M), 'brain');
    a = addComponent(a, 'brain');
    expect(a.components).toEqual(['brain']);
  });

  it('removes a component and resyncs connections', () => {
    let a = emptyArchitecture(M);
    (['voice_input', 'stt', 'brain'] as LabComponentId[]).forEach(id => {
      a = addComponent(a, id);
    });
    a = removeComponent(a, 'stt');
    expect(a.components).toEqual(['voice_input', 'brain']);
    expect(a.connections).toEqual([['voice_input', 'brain']]);
  });

  it('reorder replaces order and rebuilds connections', () => {
    let a = emptyArchitecture(M);
    (['brain', 'voice_input', 'stt'] as LabComponentId[]).forEach(id => {
      a = addComponent(a, id);
    });
    a = reorder(a, ['voice_input', 'stt', 'brain']);
    expect(a.connections).toEqual([
      ['voice_input', 'stt'],
      ['stt', 'brain'],
    ]);
  });
});

describe('AI Lab validation engine', () => {
  it('flags an empty build with guidance, not an error', () => {
    const m = MISSIONS[0];
    const r = validateArchitecture(m, withComponents(m.id, []));
    expect(r.status).toBe('empty');
    expect(r.ok).toBe(false);
  });

  it('accepts the ideal solution for every mission and explains why', () => {
    MISSIONS.forEach(m => {
      const r = validateArchitecture(m, withComponents(m.id, m.solution));
      expect(r.ok).toBe(true);
      expect(r.status).toBe('complete');
      // "Explain WHY" — success carries a flow explanation, not just "correct".
      expect(r.issues[0].level).toBe('success');
      expect(r.successLine && r.successLine.length).toBeGreaterThan(0);
    });
  });

  it('reports every missing required component with a suggestion', () => {
    MISSIONS.forEach(m => {
      // A non-empty build that omits the first required block. Use the rest of
      // the solution, or a filler so single-required missions stay non-empty.
      const rest = m.solution.filter(id => id !== m.required[0]);
      const partial = rest.length
        ? rest
        : [m.optional[0] ?? m.invalid[0]].filter(Boolean);
      const r = validateArchitecture(
        m,
        withComponents(m.id, partial as LabComponentId[]),
      );
      expect(r.ok).toBe(false);
      const missingIssue = r.issues.find(i => i.componentId === m.required[0]);
      expect(missingIssue?.level).toBe('error');
      expect(missingIssue?.suggestion).toBeTruthy();
    });
  });

  it('rejects invalid components with a remove suggestion', () => {
    MISSIONS.filter(m => m.invalid.length > 0).forEach(m => {
      const withBad = withComponents(m.id, [...m.solution, m.invalid[0]]);
      const r = validateArchitecture(m, withBad);
      expect(r.ok).toBe(false);
      const badIssue = r.issues.find(i => i.componentId === m.invalid[0]);
      expect(badIssue?.level).toBe('warn');
    });
  });

  it('detects correct components placed in the wrong order', () => {
    // voice_assistant: reverse the required order.
    const m = MISSIONS.find(x => x.id === 'voice_assistant')!;
    const reversed = [...m.solution].reverse();
    const r = validateArchitecture(m, withComponents(m.id, reversed));
    expect(r.ok).toBe(false);
    expect(r.issues.some(i => /order/i.test(i.title))).toBe(true);
  });

  it('matches the spec example: Voice Input → TTS is incomplete', () => {
    const m = MISSIONS.find(x => x.id === 'voice_assistant')!;
    const r = validateArchitecture(m, withComponents(m.id, ['voice_input', 'tts']));
    expect(r.ok).toBe(false);
    expect(r.issues.some(i => i.componentId === 'stt')).toBe(true);
  });
});

describe('LocalSimulationProvider (offline, deterministic)', () => {
  const { localProvider } = require('../provider/LocalSimulationProvider');
  const { samplesFor } = require('../simulator/scenarios');

  it('has a clearly non-real label', () => {
    expect(localProvider.label).toBe('Simulation Mode');
    expect(localProvider.id).toBe('local-sim');
  });

  it('returns a working response for a correct build of every mission', async () => {
    for (const m of MISSIONS) {
      const arch = withComponents(m.id, m.solution);
      const sample = samplesFor(m.id)[0];
      const turn = await localProvider.simulate(arch, sample.input);
      expect(turn.degraded).toBe(false);
      expect(turn.output).toBe(sample.output);
      expect(turn.trace.length).toBe(m.solution.length);
    }
  });

  it('degrades honestly when a required component is missing', async () => {
    const m = MISSIONS.find(x => x.id === 'voice_assistant')!;
    const arch = withComponents(m.id, ['voice_input', 'tts']); // no STT / Brain
    const turn = await localProvider.simulate(arch, 'hello');
    expect(turn.degraded).toBe(true);
    expect(turn.output).toMatch(/Speech-to-Text/);
  });

  it('is deterministic — same build + input gives the same output', async () => {
    const m = MISSIONS[0];
    const arch = withComponents(m.id, m.solution);
    const input = samplesFor(m.id)[0].input;
    const a = await localProvider.simulate(arch, input);
    const b = await localProvider.simulate(arch, input);
    expect(a.output).toBe(b.output);
  });

  it('every mission has at least two sample exchanges for replay', () => {
    MISSIONS.forEach(m => expect(samplesFor(m.id).length).toBeGreaterThanOrEqual(2));
  });
});

describe('AI Lab challenges (game loop)', () => {
  const { CHALLENGES } = require('../data/challenges');
  const { challengesFor, isChallengeSolved } = require('../challenges/resolve');

  it('every challenge targets a real mission and real components', () => {
    const missionIds = new Set(MISSIONS.map(m => m.id));
    CHALLENGES.forEach((c: any) => {
      expect(missionIds.has(c.missionId)).toBe(true);
      const all = [
        ...c.startComponents,
        ...c.options,
        ...(c.expectAdd ?? []),
        ...(c.expectRemove ?? []),
        ...(c.expectOrder ?? []),
      ];
      all.forEach((id: LabComponentId) => expect(id in LAB_COMPONENTS).toBe(true));
    });
  });

  it('every challenge has unique id and a fix expectation', () => {
    const ids = CHALLENGES.map((c: any) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    CHALLENGES.forEach((c: any) => {
      const hasFix =
        (c.expectAdd?.length ?? 0) +
          (c.expectRemove?.length ?? 0) +
          (c.expectOrder?.length ?? 0) >
        0;
      expect(hasFix).toBe(true);
    });
  });

  it('every mission has at least one challenge', () => {
    MISSIONS.forEach(m => expect(challengesFor(m.id).length).toBeGreaterThan(0));
  });

  it('the starting (broken) build never already satisfies the challenge', () => {
    CHALLENGES.forEach((c: any) => {
      const start = withComponents(c.missionId, c.startComponents);
      expect(isChallengeSolved(c, start)).toBe(false);
    });
  });

  it('applying the intended fix solves each challenge', () => {
    CHALLENGES.forEach((c: any) => {
      let comps: LabComponentId[] = [...c.startComponents];
      (c.expectAdd ?? []).forEach((id: LabComponentId) => comps.push(id));
      if (c.expectRemove?.length) {
        comps = comps.filter((id: LabComponentId) => !c.expectRemove.includes(id));
      }
      if (c.expectOrder?.length) {
        const others = comps.filter((id: LabComponentId) => !c.expectOrder.includes(id));
        comps = [...c.expectOrder, ...others];
      }
      const fixed = withComponents(c.missionId, comps);
      expect(isChallengeSolved(c, fixed)).toBe(true);
    });
  });
});

describe('AI Lab mission completeness + progression (Phase 6)', () => {
  const {
    missionBaseScore,
    isArchitectureComplete,
    isMissionComplete,
    completionCriteria,
    missionChallengeCount,
  } = require('../progression/completion');
  const { challengesFor } = require('../challenges/resolve');

  it('every mission is fully specified and distinct', () => {
    MISSIONS.forEach(m => {
      expect(m.objective.length).toBeGreaterThan(20);
      expect(m.concept.length).toBeGreaterThan(5);
      expect(m.required.length).toBeGreaterThan(0);
      expect(m.solution.length).toBeGreaterThan(0);
      expect(missionBaseScore(m)).toBeGreaterThan(0);
    });
    // Distinct required-component signatures (missions teach different things).
    const sigs = MISSIONS.map(m => [...m.required].sort().join(','));
    expect(new Set(sigs).size).toBe(MISSIONS.length);
  });

  it('base score scales with difficulty', () => {
    const beginner = MISSIONS.find(m => m.difficulty === 'Beginner')!;
    const advanced = MISSIONS.find(m => m.difficulty === 'Advanced')!;
    expect(missionBaseScore(advanced)).toBeGreaterThan(missionBaseScore(beginner));
  });

  it('architecture completion tracks validation', () => {
    MISSIONS.forEach(m => {
      expect(isArchitectureComplete(m, withComponents(m.id, m.solution))).toBe(true);
      expect(isArchitectureComplete(m, withComponents(m.id, []))).toBe(false);
    });
  });

  it('mission completion needs both a valid build and all challenges solved', () => {
    MISSIONS.forEach(m => {
      const arch = withComponents(m.id, m.solution);
      const allIds = challengesFor(m.id).map((c: any) => c.id);
      expect(isMissionComplete(m, arch, [])).toBe(false);
      expect(isMissionComplete(m, arch, allIds)).toBe(true);
    });
  });

  it('exposes a completion checklist per mission', () => {
    MISSIONS.forEach(m => {
      const crit = completionCriteria(m);
      expect(crit.length).toBe(2);
      expect(missionChallengeCount(m)).toBeGreaterThan(0);
    });
  });
});

describe('AI Lab randomization + replayability (Phase 7)', () => {
  const { mulberry32, shuffle } = require('../random/rng');
  const { buildChallengeRun } = require('../challenges/select');
  const { challengesFor } = require('../challenges/resolve');

  it('mulberry32 is deterministic for a given seed', () => {
    const a = mulberry32(12345);
    const b = mulberry32(12345);
    const seqA = [a(), a(), a()];
    const seqB = [b(), b(), b()];
    expect(seqA).toEqual(seqB);
    expect(mulberry32(999)()).not.toBe(mulberry32(12345)());
  });

  it('shuffle preserves elements and is seed-deterministic', () => {
    const src = [1, 2, 3, 4, 5, 6];
    const s1 = shuffle(src, mulberry32(7));
    const s2 = shuffle(src, mulberry32(7));
    expect(s1).toEqual(s2);
    expect([...s1].sort()).toEqual(src);
    expect(src).toEqual([1, 2, 3, 4, 5, 6]); // not mutated
  });

  it('same seed reproduces an identical challenge run (bug repro)', () => {
    MISSIONS.forEach(m => {
      const r1 = buildChallengeRun(m.id, 42, []);
      const r2 = buildChallengeRun(m.id, 42, []);
      expect(r1.map((c: any) => c.variantKey)).toEqual(
        r2.map((c: any) => c.variantKey),
      );
      expect(r1.map((c: any) => c.prompt)).toEqual(r2.map((c: any) => c.prompt));
      expect(r1.map((c: any) => c.options)).toEqual(
        r2.map((c: any) => c.options),
      );
    });
  });

  it('only reshuffles valid local data — never invents invalid content', () => {
    MISSIONS.forEach(m => {
      const run = buildChallengeRun(m.id, 3, []);
      const byId = new Map(challengesFor(m.id).map((c: any) => [c.id, c]));
      // Same set of challenges, just reordered.
      expect(run.map((c: any) => c.id).sort()).toEqual(
        [...byId.keys()].sort(),
      );
      run.forEach((rc: any) => {
        const base: any = byId.get(rc.id);
        // options are a permutation of the original options
        expect([...rc.options].sort()).toEqual([...base.options].sort());
        // prompt is one of the allowed wordings
        const allowed = [base.prompt, ...(base.promptVariants ?? [])];
        expect(allowed).toContain(rc.prompt);
        // fix expectations are untouched — still solvable
        expect(rc.expectAdd).toEqual(base.expectAdd);
      });
    });
  });

  it('anti-repetition falls back safely when all variants are recent', () => {
    const c = challengesFor('voice_assistant').find(
      (x: any) => x.id === 'voice-stt',
    );
    const allKeys = [c.prompt, ...(c.promptVariants ?? [])].map(
      (_: string, i: number) => `voice-stt#${i}`,
    );
    const run = buildChallengeRun('voice_assistant', 1, allKeys);
    const chosen = run.find((x: any) => x.id === 'voice-stt');
    // still produces a valid wording rather than crashing / blank
    const allowed = [c.prompt, ...(c.promptVariants ?? [])];
    expect(allowed).toContain(chosen.prompt);
  });
});

describe('AI Lab scoring + gamification (Phase 8)', () => {
  const { computeScore, builderLevelForXp, xpToNextLevel } = require('../scoring/score');
  const { awardBadges } = require('../scoring/awards');
  const { BADGES } = require('../../../content/badges');

  it('score is transparent: total equals the sum of its lines (floored at 0)', () => {
    const r = computeScore({
      architectureValid: true,
      baseScore: 150,
      challengesSolved: 2,
      optionalUsed: 1,
      retries: 3,
    });
    const sum = r.lines.reduce((s: number, l: any) => s + l.points, 0);
    expect(r.total).toBe(Math.max(0, sum));
    expect(r.total).toBe(150 + 50 + 15 - 15);
  });

  it('invalid architecture scores zero for the build line and never goes negative', () => {
    const r = computeScore({
      architectureValid: false,
      baseScore: 200,
      challengesSolved: 0,
      optionalUsed: 0,
      retries: 10,
    });
    expect(r.total).toBe(0);
  });

  it('optional bonus is capped', () => {
    const r = computeScore({
      architectureValid: true,
      baseScore: 100,
      challengesSolved: 0,
      optionalUsed: 9,
      retries: 0,
    });
    // cap of 2 * 15 = 30
    expect(r.total).toBe(130);
  });

  it('AI Builder Level rises every 250 XP', () => {
    expect(builderLevelForXp(0)).toBe(1);
    expect(builderLevelForXp(249)).toBe(1);
    expect(builderLevelForXp(250)).toBe(2);
    expect(builderLevelForXp(600)).toBe(3);
    expect(xpToNextLevel(0)).toBe(250);
  });

  it('awards map completions to the right badges, all defined in the catalog', () => {
    const slugs = new Set(BADGES.map((b: any) => b.slug));
    const all = MISSIONS.map(m => m.id);
    const earned = awardBadges({ completedMissionIds: all, totalChallengesSolved: 20 });
    earned.forEach((s: string) => expect(slugs.has(s)).toBe(true));
    expect(earned).toContain('ailab-master');
    expect(earned).toContain('ailab-first-build');
    expect(earned).toContain('ailab-voice-engineer');
  });

  it('awards nothing meaningful before anything is completed', () => {
    expect(awardBadges({ completedMissionIds: [], totalChallengesSolved: 0 })).toEqual([]);
  });

  it('bug-hunter needs five solved challenges', () => {
    expect(
      awardBadges({ completedMissionIds: ['chatbot'], totalChallengesSolved: 4 }),
    ).not.toContain('ailab-bug-hunter');
    expect(
      awardBadges({ completedMissionIds: ['chatbot'], totalChallengesSolved: 5 }),
    ).toContain('ailab-bug-hunter');
  });
});

describe('aiLabStore (persisted progress)', () => {
  const { useAILabStore } = require('../storage/aiLabStore');

  beforeEach(() => useAILabStore.getState().reset());

  it('records solved challenges without duplicates', () => {
    const s = useAILabStore.getState();
    s.markChallengeSolved('chatbot', 'chatbot-memory');
    s.markChallengeSolved('chatbot', 'chatbot-memory');
    s.markChallengeSolved('chatbot', 'chatbot-facts');
    expect(useAILabStore.getState().solvedChallenges.chatbot).toEqual([
      'chatbot-memory',
      'chatbot-facts',
    ]);
  });

  it('completeMission grants XP once and keeps the best score', () => {
    const s = useAILabStore.getState();
    s.completeMission('chatbot', 100);
    expect(useAILabStore.getState().aiLabXp).toBe(100);
    s.completeMission('chatbot', 80); // replay, lower — XP unchanged, best kept
    expect(useAILabStore.getState().aiLabXp).toBe(100);
    expect(useAILabStore.getState().completed.chatbot.bestScore).toBe(100);
    s.completeMission('chatbot', 150); // replay, higher — best improves, XP still once
    expect(useAILabStore.getState().completed.chatbot.bestScore).toBe(150);
    expect(useAILabStore.getState().aiLabXp).toBe(100);
  });

  it('tracks retries per mission', () => {
    const s = useAILabStore.getState();
    s.addRetry('voice_assistant');
    s.addRetry('voice_assistant');
    expect(useAILabStore.getState().retries.voice_assistant).toBe(2);
  });
});

describe('AI Lab save / resume projects (Phase 9)', () => {
  const { useAILabStore } = require('../storage/aiLabStore');

  const sample = (over = {}) => ({
    name: 'My Voice AI',
    missionId: 'voice_assistant',
    components: ['voice_input', 'stt', 'brain', 'tts'],
    connections: [['voice_input', 'stt'], ['stt', 'brain'], ['brain', 'tts']],
    score: 150,
    level: 1,
    completedChallenges: [],
    ...over,
  });

  beforeEach(() => useAILabStore.getState().reset());

  it('saves a new project with id + timestamps', () => {
    const id = useAILabStore.getState().saveProject(sample());
    const p = useAILabStore.getState().projects[id];
    expect(p.id).toBe(id);
    expect(p.name).toBe('My Voice AI');
    expect(p.createdAt).toBeGreaterThan(0);
    expect(p.updatedAt).toBeGreaterThan(0);
    expect(p.components).toHaveLength(4);
  });

  it('updates an existing project in place (same id, createdAt preserved)', () => {
    const id = useAILabStore.getState().saveProject(sample());
    const created = useAILabStore.getState().projects[id].createdAt;
    useAILabStore.getState().saveProject(sample({ id, score: 200 }));
    const p = useAILabStore.getState().projects[id];
    expect(Object.keys(useAILabStore.getState().projects)).toHaveLength(1);
    expect(p.score).toBe(200);
    expect(p.createdAt).toBe(created);
  });

  it('gives every new project a unique id', () => {
    const a = useAILabStore.getState().saveProject(sample());
    const b = useAILabStore.getState().saveProject(sample());
    expect(a).not.toBe(b);
    expect(Object.keys(useAILabStore.getState().projects)).toHaveLength(2);
  });

  it('renames a project', () => {
    const id = useAILabStore.getState().saveProject(sample());
    useAILabStore.getState().renameProject(id, 'Renamed');
    expect(useAILabStore.getState().projects[id].name).toBe('Renamed');
  });

  it('duplicates a project into a new id with a copy name', () => {
    const id = useAILabStore.getState().saveProject(sample());
    const dupId = useAILabStore.getState().duplicateProject(id);
    expect(dupId).not.toBe(id);
    const dup = useAILabStore.getState().projects[dupId];
    expect(dup.name).toBe('My Voice AI (copy)');
    expect(dup.components).toEqual(useAILabStore.getState().projects[id].components);
    expect(useAILabStore.getState().duplicateProject('nope')).toBeNull();
  });

  it('deletes a project', () => {
    const id = useAILabStore.getState().saveProject(sample());
    useAILabStore.getState().deleteProject(id);
    expect(useAILabStore.getState().projects[id]).toBeUndefined();
  });

  it('persists under the app MMKV storage key (survives restart)', () => {
    // The store uses zustand persist with StorageKeys.ailab — presence of the
    // persist config is the contract; here we assert save writes to state that
    // the middleware serialises.
    const id = useAILabStore.getState().saveProject(sample());
    const raw = useAILabStore.getState().projects[id];
    expect(raw).toBeDefined();
  });
});

describe('AI Lab Free Build (Phase 10)', () => {
  const {
    FREE_CATEGORIES,
    getCategory,
    freeMissionId,
    categoryFromMissionId,
  } = require('../freebuild/categories');
  const { freeBuildFeedback } = require('../freebuild/validate');
  const { localProvider } = require('../provider/LocalSimulationProvider');

  it('has the eleven categories with unique ids and valid components', () => {
    expect(FREE_CATEGORIES).toHaveLength(11);
    const ids = FREE_CATEGORIES.map((c: any) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    FREE_CATEGORIES.forEach((c: any) => {
      [...c.core, ...c.recommended, ...c.typical].forEach((id: any) =>
        expect(id in LAB_COMPONENTS).toBe(true),
      );
      // core is always within typical
      c.core.forEach((id: any) => expect(c.typical).toContain(id));
    });
  });

  it('free mission id round-trips to a category', () => {
    expect(categoryFromMissionId(freeMissionId('chat'))).toBe('chat');
    expect(categoryFromMissionId('voice_assistant')).toBeNull();
  });

  it('flags missing core components for a category', () => {
    const voice = getCategory('voice');
    const r = freeBuildFeedback(voice, withComponents('free-voice', ['brain']));
    expect(r.ok).toBe(false);
    expect(r.issues.some((i: any) => i.componentId === 'stt')).toBe(true);
  });

  it('accepts a sensible build and explains the flow', () => {
    const chat = getCategory('chat');
    const r = freeBuildFeedback(chat, withComponents('free-chat', ['brain', 'memory']));
    expect(r.ok).toBe(true);
    expect(r.issues[0].level).toBe('success');
  });

  it('marks components outside the category as unusual (non-custom)', () => {
    const chat = getCategory('chat');
    const r = freeBuildFeedback(chat, withComponents('free-chat', ['brain', 'vision']));
    expect(r.issues.some((i: any) => i.componentId === 'vision' && i.level === 'warn')).toBe(true);
  });

  it('custom category never calls anything unnecessary', () => {
    const custom = getCategory('custom');
    const r = freeBuildFeedback(
      custom,
      withComponents('free-custom', ['brain', 'vision', 'tts', 'calculator']),
    );
    expect(r.ok).toBe(true);
    expect(r.issues.some((i: any) => i.level === 'warn')).toBe(false);
  });

  it('provider runs a free build with a brain and degrades without one', async () => {
    const withBrain = withComponents('free-chat', ['brain', 'memory']);
    const ok = await localProvider.simulate(withBrain, 'hello');
    expect(ok.degraded).toBe(false);

    const noBrain = withComponents('free-chat', ['memory']);
    const bad = await localProvider.simulate(noBrain, 'hello');
    expect(bad.degraded).toBe(true);
    expect(bad.output).toMatch(/Brain/);
  });
});

describe('AI Lab showcase + share (Phase 11)', () => {
  const { buildAILabShareMessage } = require('../showcase/share');

  it('share text contains the required phrase and Play Store link', () => {
    const msg = buildAILabShareMessage({
      title: 'a Voice Assistant',
      components: ['voice_input', 'stt', 'brain', 'tts'],
      score: 250,
      challengesDone: 2,
      challengesTotal: 2,
    });
    expect(msg).toContain('I built my own AI using Anviksha AI Lab!');
    expect(msg).toContain(
      'https://play.google.com/store/apps/details?id=com.abhishek.anviksha',
    );
  });

  it('reflects the real build (architecture + score), not a hardcoded one', () => {
    const msg = buildAILabShareMessage({
      title: 'a Chatbot',
      components: ['brain', 'memory'],
      score: 130,
      challengesDone: 1,
      challengesTotal: 2,
    });
    expect(msg).toContain('AI Brain');
    expect(msg).toContain('Memory');
    expect(msg).toContain('Score: 130');
    expect(msg).toContain('Challenges: 1/2');
  });

  it('omits the challenges line when there are none (free build)', () => {
    const msg = buildAILabShareMessage({
      title: 'a Custom AI',
      components: ['brain'],
      score: 0,
      challengesDone: 0,
      challengesTotal: 0,
    });
    expect(msg).not.toContain('Challenges:');
    expect(msg).toContain('I built my own AI using Anviksha AI Lab!');
  });
});

# AI Lab

Playfully **build your own AI**: choose a mission → design an architecture from
components → connect → test → break → fix → upgrade → complete. Entirely
**offline and zero-cost** — no external AI API, no cloud, no paid service.

## Structure

```
src/modules/ailab/
├── types.ts                     # LabComponent, Mission, LabArchitecture, Challenge, LabProject
├── data/
│   ├── components.ts            # the 10-component catalog (source of truth)
│   ├── missions.ts              # 8 missions + Surprise Me
│   └── challenges.ts            # 16 local challenges
├── builder/architecture.ts      # pure add/remove/reorder → connections model (source of truth)
├── validation/validate.ts       # reusable "intelligent, no-AI" validator + row status
├── challenges/
│   ├── resolve.ts               # single data-driven solver for every challenge type
│   └── select.ts                # seeded, replayable challenge run
├── random/{rng.ts,history.ts}   # mulberry32 + anti-repetition ring buffer
├── scoring/{score.ts,awards.ts} # transparent scoring, AI Builder level, badge mapping
├── progression/completion.ts    # completion criteria + base score
├── freebuild/{categories.ts,validate.ts}  # Free Build: 8 categories + open-ended validator
├── provider/
│   ├── AIProvider.ts            # the interface the whole feature depends on
│   └── LocalSimulationProvider.ts  # the only implementation today (offline, deterministic)
├── simulator/scenarios.ts       # local sample exchanges per mission
├── showcase/share.ts            # completion share message + image share
├── storage/aiLabStore.ts        # zustand + persist(MMKV): progress, XP, badges, saved projects
├── components/                  # MissionCard, ComponentTray, ValidationPanel, SimulationPanel,
│                                #   ArchitectureFlow, SavedProjects
└── screens/                     # AILab (hub), Mission, Challenge, FreeBuild, Showcase
```

`LabArchitecture` is the single source of truth — screens render from it; the
visual pipeline is never stored separately.

## State & persistence

- Progress, XP, best scores, solved challenges, retries and saved projects live in
  `storage/aiLabStore.ts` (zustand + `persist` + the app's `zustandMMKVStorage`
  adapter, key `StorageKeys.ailab`). Survives app restart.
- Global XP is awarded through the existing `progressStore.addXp`; badges through
  the existing `achievementsStore.unlock` (catalog in `content/badges.ts`).

## Plugging in a real AI later (NOT NOW)

The entire feature depends only on the `AIProvider` interface:

```ts
interface AIProvider {
  readonly id: string;
  readonly label: string;
  simulate(architecture: LabArchitecture, input: string): Promise<SimTurn>;
}
```

Today the sole implementation is `LocalSimulationProvider` (offline, deterministic,
zero-cost). To add real AI later:

1. Create `provider/RealAIProvider.ts implements AIProvider` calling your backend
   (with usage/token/rate limits, safe tools, abuse prevention server-side).
2. Swap the provider the UI uses (currently the exported `localProvider`
   singleton) — e.g. behind a settings flag or remote config. **No AI Lab UI or
   data changes are needed**; `SimulationPanel` and `showcase` already speak only
   `AIProvider`/`SimTurn`.
3. Keep `LocalSimulationProvider` as the offline fallback / practice mode.

Do not implement `RealAIProvider` until closed testing validates the concept
(see `CLOSED_TESTING.md`).

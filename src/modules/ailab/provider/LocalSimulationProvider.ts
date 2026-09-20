/**
 * LocalSimulationProvider — the initial, zero-cost AIProvider.
 *
 * Fully offline and deterministic: it never calls a network or a real model.
 * It maps a built architecture + a sample input to a canned response, and
 * degrades honestly when the architecture is missing required components (so
 * "Test My AI" also teaches what breaks). A future RealAIProvider implements
 * the same AIProvider interface and drops in without any UI change.
 */

import { AIProvider, SimTurn } from './AIProvider';
import { LabArchitecture } from '../types';
import { getMission } from '../data/missions';
import { getComponent } from '../data/components';
import { samplesFor } from '../simulator/scenarios';
import { LightweightAIEngine } from '../engine/LightweightAIEngine';

export class LocalSimulationProvider implements AIProvider {
  readonly id = 'local-sim';
  readonly label = 'Simulation Mode';

  async simulate(
    architecture: LabArchitecture,
    input: string,
  ): Promise<SimTurn> {
    const mission = getMission(architecture.missionId);
    const placed = architecture.components;
    const trace = placed.map(id => getComponent(id)?.label ?? id);

    // Nothing built yet.
    if (placed.length === 0) {
      return {
        input,
        output: 'Add some components first, then run the simulation.',
        trace,
        degraded: true,
      };
    }

    // Free Build (no fixed mission): use Lightweight AI Engine
    if (!mission) {
      return LightweightAIEngine.generateResponse(architecture, input);
    }

    // Missing a required block → stop early and explain the break honestly.
    const missing = mission.required.filter(id => !placed.includes(id));
    if (missing.length > 0) {
      const first = getComponent(missing[0]);
      return {
        input,
        output: `⚠️ Simulation stopped early — this build has no ${first.label}, so it can't complete the task. Add ${first.label} and try again.`,
        trace,
        degraded: true,
      };
    }

    // A working build: if matching sample exists, use it; otherwise run Lightweight AI Engine!
    const samples = samplesFor(mission.id);
    const match = samples.find(s => s.input === input);
    if (match) {
      return {
        input: match.input,
        output: match.output,
        trace,
        degraded: false,
      };
    }

    return LightweightAIEngine.generateResponse(architecture, input);
  }
}

/** Shared singleton — the app depends on the AIProvider interface, not this. */
export const localProvider: AIProvider = new LocalSimulationProvider();

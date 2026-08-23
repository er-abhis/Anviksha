/**
 * Provider abstraction for the AI Lab.
 *
 * The whole product depends only on this interface. Today the sole implementation
 * is LocalSimulationProvider (offline, deterministic, zero-cost — added in
 * Phase 4). Later a RealAIProvider can be dropped in behind the same interface
 * without touching any AI Lab UI. DO NOT implement RealAIProvider yet.
 */

import { LabArchitecture } from '../types';

/** One simulated exchange with a built AI. */
export interface SimTurn {
  /** What the user "said"/provided (predefined sample input). */
  input: string;
  /** The AI's response text. */
  output: string;
  /** The stages the input flowed through, in order (for the animated pipeline). */
  trace: string[];
  /** True when the current architecture can't actually handle the input. */
  degraded?: boolean;
}

export interface AIProvider {
  /** Stable id, e.g. 'local-sim'. */
  readonly id: string;
  /** Human label shown in the UI, e.g. 'Simulation Mode'. */
  readonly label: string;
  /** Run one exchange through the given architecture. */
  simulate(architecture: LabArchitecture, input: string): Promise<SimTurn>;
}

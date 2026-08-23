/**
 * Pure helpers for the LabArchitecture — the single source of truth for a build.
 * The builder UI holds one of these in state and renders straight from it;
 * connections are always kept in sync with component order so no screen ever
 * stores the pipeline shape separately.
 */

import { LabArchitecture, LabComponentId } from '../types';

/** Adjacency pairs for the current vertical pipeline (each block feeds the next). */
const connectionsFor = (
  components: LabComponentId[],
): Array<[LabComponentId, LabComponentId]> =>
  components.slice(0, -1).map((c, i) => [c, components[i + 1]]);

export const emptyArchitecture = (missionId: string): LabArchitecture => ({
  missionId,
  components: [],
  connections: [],
});

/** Rebuild an architecture from an ordered component list. */
export const withComponents = (
  missionId: string,
  components: LabComponentId[],
): LabArchitecture => ({
  missionId,
  components,
  connections: connectionsFor(components),
});

/** Append a component if it isn't already placed (blocks are unique). */
export const addComponent = (
  arch: LabArchitecture,
  id: LabComponentId,
): LabArchitecture =>
  arch.components.includes(id)
    ? arch
    : withComponents(arch.missionId, [...arch.components, id]);

export const removeComponent = (
  arch: LabArchitecture,
  id: LabComponentId,
): LabArchitecture =>
  withComponents(
    arch.missionId,
    arch.components.filter(c => c !== id),
  );

/** Apply a new order (from the drag list) and resync connections. */
export const reorder = (
  arch: LabArchitecture,
  components: LabComponentId[],
): LabArchitecture => withComponents(arch.missionId, components);

export const isEmpty = (arch: LabArchitecture): boolean =>
  arch.components.length === 0;

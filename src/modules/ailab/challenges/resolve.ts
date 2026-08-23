/**
 * One resolver for every challenge type. A challenge is solved when the current
 * architecture satisfies all of its data-driven expectations. No per-challenge
 * or per-type branching — the type only drives presentation elsewhere.
 */

import { Challenge, LabArchitecture, LabComponentId } from '../types';
import { CHALLENGES } from '../data/challenges';

export const challengesFor = (missionId: string): Challenge[] =>
  CHALLENGES.filter(c => c.missionId === missionId);

const orderSatisfied = (
  expectOrder: LabComponentId[],
  components: LabComponentId[],
): boolean => {
  const filtered = components.filter(c => expectOrder.includes(c));
  return filtered.join('>') === expectOrder.join('>');
};

export const isChallengeSolved = (
  challenge: Challenge,
  arch: LabArchitecture,
): boolean => {
  const present = arch.components;
  const addOk = (challenge.expectAdd ?? []).every(id => present.includes(id));
  const removeOk = (challenge.expectRemove ?? []).every(
    id => !present.includes(id),
  );
  const orderOk =
    !challenge.expectOrder || orderSatisfied(challenge.expectOrder, present);
  return addOk && removeOk && orderOk;
};

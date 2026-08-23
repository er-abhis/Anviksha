/**
 * Builds the "Share My AI" caption from the REAL build (no hardcoded, misleading
 * achievement) and shares it through the native sheet. Reuses the app's existing
 * share helper (react-native-share with a graceful text fallback).
 */

import { shareAchievement, webStoreUrl } from '../../../utils/appLinks';
import { getComponent } from '../data/components';
import { LabComponentId } from '../types';

export interface ShareBuildInput {
  title: string;
  components: LabComponentId[];
  score: number;
  challengesDone: number;
  challengesTotal: number;
}

export const buildAILabShareMessage = (input: ShareBuildInput): string => {
  const flow = [
    'Input',
    ...input.components.map(id => getComponent(id).label),
    'Answer',
  ].join(' → ');

  const stats = [`Score: ${input.score}`];
  if (input.challengesTotal > 0) {
    stats.push(`Challenges: ${input.challengesDone}/${input.challengesTotal}`);
  }

  return (
    `🤖 ${input.title}\n\n` +
    'I built my own AI using Anviksha AI Lab!\n\n' +
    `Architecture: ${flow}\n` +
    `${stats.join(' · ')}\n\n` +
    `Build your own AI:\n${webStoreUrl()}`
  );
};

export const shareMyAI = (
  input: ShareBuildInput,
  imageUri?: string,
): Promise<void> => shareAchievement(buildAILabShareMessage(input), imageUri);

/**
 * Recent challenge-variant history — mirrors utils/quizHistory. A small ring
 * buffer of variant keys the learner has just seen, so the randomizer avoids
 * repeating the same wording immediately. Kept small so variants recycle soon.
 */

import { kv } from '../../../storage/mmkv';

const KEY = 'ailab.recentVariantKeys';
const MAX = 24;

export const getRecentVariantKeys = (): string[] => {
  try {
    const parsed = JSON.parse(kv.getString(KEY, '[]'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const pushRecentVariantKeys = (keys: string[]): void => {
  const merged = [...keys, ...getRecentVariantKeys()].slice(0, MAX);
  kv.setString(KEY, JSON.stringify(merged));
};

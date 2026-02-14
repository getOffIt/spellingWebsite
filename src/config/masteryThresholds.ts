import { SPELLING_LIST_A, SPELLING_LIST_B } from '../data/words';

/**
 * Single source of truth for per-word mastery thresholds.
 * Default is 3 consecutive correct. Some lists require more.
 */
const DEFAULT_THRESHOLD = 3;

const highThresholdIds = new Set([
  ...SPELLING_LIST_A.map(w => w.id),
  ...SPELLING_LIST_B.map(w => w.id),
]);

export function getMasteryThreshold(wordId: string): number {
  return highThresholdIds.has(wordId) ? 10 : DEFAULT_THRESHOLD;
}

export { DEFAULT_THRESHOLD };

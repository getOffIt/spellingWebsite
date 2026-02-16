/**
 * Single source of truth for mastery threshold.
 * All words require 10 consecutive correct answers to be mastered.
 */
const MASTERY_THRESHOLD = 10;

export function getMasteryThreshold(wordId: string): number {
  return MASTERY_THRESHOLD;
}

export { MASTERY_THRESHOLD };

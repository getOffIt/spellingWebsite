import { Word } from '../data/words';

export type WordStatus = 'mastered' | 'unmastered' | 'in-progress' | 'not-started';

export interface WordWithStatus extends Word {
  status: WordStatus;
}

/**
 * Priority order for word selection:
 * - unmastered: Highest priority (lost progress needs attention)
 * - in-progress: Second priority (continue building streaks)  
 * - not-started: Third priority (new learning)
 * - mastered: Lowest priority (already achieved)
 */
export const WORD_PRIORITY: Record<WordStatus, number> = {
  'unmastered': 0,    // Highest priority - words that lost mastery
  'in-progress': 1,
  'not-started': 2,
  'mastered': 3       // Lowest priority - already mastered
};

/**
 * Gets the priority value for a word status, with fallback for unknown statuses
 */
export function getWordPriority(status: WordStatus | string): number {
  return WORD_PRIORITY[status as WordStatus] ?? 2; // Default to 'not-started' priority
}

/**
 * Sorts words by priority (unmastered > in-progress > not-started > mastered)
 */
export function sortWordsByPriority<T extends { status: WordStatus | string }>(words: T[]): T[] {
  return [...words].sort((a, b) => {
    return getWordPriority(a.status) - getWordPriority(b.status);
  });
}

/**
 * Selects the next words to practice based on priority, limiting to a maximum count
 */
export function selectNextWords<T extends { status: WordStatus | string; text: string }>(
  words: T[], 
  maxCount: number = 3
): string[] {
  const sortedWords = sortWordsByPriority(words);
  return sortedWords.slice(0, maxCount).map(w => w.text);
}

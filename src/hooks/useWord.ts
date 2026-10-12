import { useMemo } from 'react'
import { useProgress, type WordAttempt } from '../contexts/ProgressProvider'
import { ALL_WORDS } from '../data/words'
import { getMasteryThreshold } from '../config/masteryThresholds'

export function useWord(wordId: string) {
  const { progress, recordAttempt, getWordStats } = useProgress();
  const word = useMemo(() => {
    const foundWord = ALL_WORDS.find(w => w.text === wordId);
    if (!foundWord) {
      console.warn(`Word "${wordId}" not found in ALL_WORDS`);
      return { text: wordId, year: 1 as const, category: 'unknown' };
    }
    return foundWord;
  }, [wordId]);
  const stats = getWordStats(wordId);
  const attempts = progress[wordId] || [];

  const enhancedStatus = getEnhancedWordStatus(wordId, stats.status, attempts);

  return {
    ...word,
    ...stats,
    status: enhancedStatus,
    attempts, // array of {date, correct, attempt}
    recordAttempt // Use the ProgressProvider's recordAttempt directly
  };
}
// Share the same lost-mastery semantics with overview pages without calling hooks in loops.
export function getEnhancedWordStatus(
  wordId: string,
  status: 'not-started' | 'in-progress' | 'mastered',
  attempts: WordAttempt[]
): 'not-started' | 'in-progress' | 'mastered' | 'unmastered' {
  if (status === 'mastered') return status;
  const threshold = getMasteryThreshold(wordId);
  let consecutive = 0;
  for (const attempt of attempts) {
    if (attempt.correct) consecutive++;
    else {
      if (consecutive >= threshold) return 'unmastered';
      consecutive = 0;
    }
  }
  return status;
}

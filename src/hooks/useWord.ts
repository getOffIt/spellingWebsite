import { useMemo } from 'react'
import { useProgress } from '../contexts/ProgressProvider'
import { ALL_WORDS } from '../data/words'

export function useWord(wordId: string) {
  const { progress, recordAttempt, getWordStats } = useProgress();
  const word = useMemo(() => ALL_WORDS.find(w => w.id === wordId)!, [wordId]);
  const stats = getWordStats(wordId);
  const attempts = progress[wordId] || [];

  return {
    ...word,
    ...stats,
    attempts, // array of {date, correct, attempt}
    recordAttempt // Use the ProgressProvider's recordAttempt directly
  };
} 
import { useMemo } from 'react'
import { useProgress } from '../contexts/ProgressProvider'
import { ALL_WORDS } from '../data/words'

export function useWord(wordId: string) {
  const { progress, recordAttempt, getWordStats } = useProgress();
  const word = useMemo(() => {
    const foundWord = ALL_WORDS.find(w => w.id === wordId);
    if (!foundWord) {
      console.warn(`Word with id "${wordId}" not found in ALL_WORDS`);
      return { id: wordId, text: wordId, year: 1 as const, category: 'unknown' };
    }
    return foundWord;
  }, [wordId]);
  const stats = getWordStats(wordId);
  const attempts = progress[wordId] || [];

  // Check if this word was previously mastered but is no longer mastered
  const wasUnmastered = useMemo(() => {
    if (stats.status === 'mastered' || attempts.length === 0) return false;
    
    // Look through attempt history to see if word was ever mastered
    let consecutiveCorrect = 0;
    let hadMastery = false;
    
    for (let i = 0; i < attempts.length; i++) {
      if (attempts[i].correct) {
        consecutiveCorrect++;
        if (consecutiveCorrect >= 3) {
          hadMastery = true;
        }
      } else {
        // If we had mastery and now got an incorrect answer, this word was unmastered
        if (hadMastery && consecutiveCorrect >= 3) {
          return true;
        }
        consecutiveCorrect = 0;
        hadMastery = false;
      }
    }
    
    return false;
  }, [attempts, stats.status]);

  // Override status if word was unmastered
  const enhancedStatus = wasUnmastered ? 'unmastered' : stats.status;

  return {
    ...word,
    ...stats,
    status: enhancedStatus,
    attempts, // array of {date, correct, attempt}
    recordAttempt // Use the ProgressProvider's recordAttempt directly
  };
} 
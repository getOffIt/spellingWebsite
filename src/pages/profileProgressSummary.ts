import { getMasteryThreshold } from '../config/masteryThresholds';
import { ALL_WORDS, type Word } from '../data/words';
import type { ProgressData } from '../contexts/ProgressProvider';

export type DailyWordStatusChanges = {
  mastered: string[];
  unmastered: string[];
  remastered: string[];
};

export type DailyActivity = Record<string, number>;
export type DailyMasteredWords = Record<string, DailyWordStatusChanges>;

export type TodayProgressSummary = {
  dateKey: string;
  greenWordsToday: number;
  metThreeGreenTarget: boolean;
  attemptsToday: number;
  miniTestsToday: string[];
  remasteredToday: string[];
  bonusGreenWords: number;
};

export function getDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function buildDailyActivity(progress: ProgressData): DailyActivity {
  const dailyActivity: DailyActivity = {};

  Object.values(progress).forEach((attempts) => {
    attempts.forEach((attempt) => {
      const date = attempt.date.split('T')[0];
      dailyActivity[date] = (dailyActivity[date] || 0) + 1;
    });
  });

  return dailyActivity;
}

export function buildDailyMasteredWords(progress: ProgressData): DailyMasteredWords {
  const dailyMasteredWords: DailyMasteredWords = {};

  Object.entries(progress).forEach(([wordId, attempts]) => {
    if (attempts.length === 0) return;

    const threshold = getMasteryThreshold(wordId);
    let consecutiveCorrect = 0;
    let wasMastered = false;

    attempts.forEach((attempt) => {
      const attemptDate = attempt.date.split('T')[0];

      if (attempt.correct) {
        consecutiveCorrect++;

        if (consecutiveCorrect === threshold && !wasMastered) {
          if (!dailyMasteredWords[attemptDate]) {
            dailyMasteredWords[attemptDate] = { mastered: [], unmastered: [], remastered: [] };
          }
          dailyMasteredWords[attemptDate].mastered.push(wordId);
          wasMastered = true;
        }
      } else {
        if (wasMastered && consecutiveCorrect >= threshold) {
          if (!dailyMasteredWords[attemptDate]) {
            dailyMasteredWords[attemptDate] = { mastered: [], unmastered: [], remastered: [] };
          }
          if (!dailyMasteredWords[attemptDate].unmastered.includes(wordId)) {
            dailyMasteredWords[attemptDate].unmastered.push(wordId);
          }
          wasMastered = false;
        }
        consecutiveCorrect = 0;
      }
    });
  });

  Object.keys(dailyMasteredWords).forEach((date) => {
    const dayData = dailyMasteredWords[date];
    const remastered = dayData.mastered.filter((wordId) => dayData.unmastered.includes(wordId));

    if (remastered.length > 0) {
      dayData.remastered = remastered;
      dayData.mastered = dayData.mastered.filter((wordId) => !remastered.includes(wordId));
      dayData.unmastered = dayData.unmastered.filter((wordId) => !remastered.includes(wordId));
    }
  });

  return dailyMasteredWords;
}

export function buildWordsByCategory(words: Word[] = ALL_WORDS): Record<string, string[]> {
  return words.reduce<Record<string, string[]>>((acc, word) => {
    const existingWords = acc[word.category] || [];

    if (!existingWords.includes(word.text)) {
      existingWords.push(word.text);
    }

    acc[word.category] = existingWords;
    return acc;
  }, {});
}

export function getAttemptedWordIdsForDate(progress: ProgressData, dateKey: string): Set<string> {
  const attemptedWordIds = new Set<string>();

  Object.entries(progress).forEach(([wordId, attempts]) => {
    const attemptedToday = attempts.some((attempt) => attempt.date.split('T')[0] === dateKey);
    if (attemptedToday) {
      attemptedWordIds.add(wordId);
    }
  });

  return attemptedWordIds;
}

export function getTodayProgressSummary(
  progress: ProgressData,
  dailyActivity: DailyActivity,
  dailyMasteredWords: DailyMasteredWords,
  wordsByCategory: Record<string, string[]>,
  dateKey: string = getDateKey(new Date())
): TodayProgressSummary {
  const greenWordsToday = dailyMasteredWords[dateKey]?.mastered.length || 0;
  const remasteredToday = dailyMasteredWords[dateKey]?.remastered || [];
  const attemptsToday = dailyActivity[dateKey] || 0;
  const attemptedWordIds = getAttemptedWordIdsForDate(progress, dateKey);

  const miniTestsToday = Object.entries(wordsByCategory)
    .filter(([, categoryWords]) => categoryWords.length > 0 && categoryWords.every((wordId) => attemptedWordIds.has(wordId)))
    .map(([category]) => category)
    .sort((a, b) => a.localeCompare(b));

  return {
    dateKey,
    greenWordsToday,
    metThreeGreenTarget: greenWordsToday >= 3,
    attemptsToday,
    miniTestsToday,
    remasteredToday,
    bonusGreenWords: Math.max(0, greenWordsToday - 3),
  };
}

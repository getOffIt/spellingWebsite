import { describe, expect, it } from 'vitest';
import type { ProgressData } from '../contexts/ProgressProvider';
import {
  buildDailyActivity,
  buildDailyMasteredWords,
  buildWordsByCategory,
  getAttemptedWordIdsForDate,
  getTodayProgressSummary,
} from './profileProgressSummary';

const makeCorrectAttempts = (count: number, date: string) =>
  Array.from({ length: count }, (_, index) => ({
    date: `${date}T10:${String(index).padStart(2, '0')}:00Z`,
    correct: true,
    attempt: 'correct',
  }));

describe('profileProgressSummary', () => {
  it('builds daily activity totals from all attempts', () => {
    const progress: ProgressData = {
      cat: [
        { date: '2026-04-03T10:00:00Z', correct: true, attempt: 'cat' },
        { date: '2026-04-03T11:00:00Z', correct: false, attempt: 'kat' },
      ],
      dog: [{ date: '2026-04-02T09:00:00Z', correct: true, attempt: 'dog' }],
    };

    expect(buildDailyActivity(progress)).toEqual({
      '2026-04-03': 2,
      '2026-04-02': 1,
    });
  });

  it('separates remastered words from newly mastered words on the same day', () => {
    const progress: ProgressData = {
      green: makeCorrectAttempts(10, '2026-04-03'),
      remastered: [
        ...makeCorrectAttempts(10, '2026-04-02'),
        { date: '2026-04-03T09:00:00Z', correct: false, attempt: 'wrong' },
        ...Array.from({ length: 10 }, (_, index) => ({
          date: `2026-04-03T10:${String(index).padStart(2, '0')}:00Z`,
          correct: true,
          attempt: 'right',
        })),
      ],
    };

    const dailyMasteredWords = buildDailyMasteredWords(progress);

    expect(dailyMasteredWords['2026-04-03']).toEqual({
      mastered: ['green'],
      unmastered: [],
      remastered: ['remastered'],
    });
  });

  it('finds attempted word ids for a given date', () => {
    const progress: ProgressData = {
      cat: [{ date: '2026-04-03T10:00:00Z', correct: true, attempt: 'cat' }],
      dog: [{ date: '2026-04-02T10:00:00Z', correct: true, attempt: 'dog' }],
    };

    expect(Array.from(getAttemptedWordIdsForDate(progress, '2026-04-03'))).toEqual(['cat']);
  });

  it('computes today summary with mini tests, green target, bonus greens and remastered kept separate', () => {
    const today = '2026-04-03';
    const progress: ProgressData = {
      cat: [{ date: `${today}T09:00:00Z`, correct: true, attempt: 'cat' }],
      dog: [{ date: `${today}T09:05:00Z`, correct: true, attempt: 'dog' }],
      sun: [{ date: `${today}T09:10:00Z`, correct: true, attempt: 'sun' }],
      moon: [{ date: `${today}T09:15:00Z`, correct: true, attempt: 'moon' }],
    };

    const wordsByCategory = buildWordsByCategory([
      { text: 'cat', year: 1, category: 'pets' },
      { text: 'dog', year: 1, category: 'pets' },
      { text: 'sun', year: 1, category: 'space' },
      { text: 'moon', year: 1, category: 'space' },
      { text: 'star', year: 1, category: 'space' },
    ]);

    const summary = getTodayProgressSummary(
      progress,
      { [today]: 7 },
      {
        [today]: {
          mastered: ['cat', 'dog', 'sun', 'moon'],
          unmastered: [],
          remastered: ['redo'],
        },
      },
      wordsByCategory,
      today
    );

    expect(summary).toEqual({
      dateKey: today,
      greenWordsToday: 4,
      metThreeGreenTarget: true,
      attemptsToday: 7,
      miniTestsToday: ['pets'],
      remasteredToday: ['redo'],
      bonusGreenWords: 1,
    });
  });
});

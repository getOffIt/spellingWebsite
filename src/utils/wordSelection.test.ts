import { describe, expect, it } from 'vitest';
import { selectNextWords, selectTestWords } from './wordSelection';

describe('selectNextWords', () => {
  it('excludes green/mastered words from the three-word practice selection', () => {
    const words = [
      { text: 'green-one', status: 'mastered' },
      { text: 'lost-green', status: 'unmastered' },
      { text: 'building', status: 'in-progress' },
      { text: 'new-word', status: 'not-started' },
      { text: 'green-two', status: 'mastered' },
    ];

    expect(selectNextWords(words, 3)).toEqual(['lost-green', 'building', 'new-word']);
  });

  it('returns fewer than three practice words when the remaining words are green', () => {
    const words = [
      { text: 'still-learning', status: 'in-progress' },
      { text: 'green-one', status: 'mastered' },
      { text: 'green-two', status: 'mastered' },
    ];

    expect(selectNextWords(words, 3)).toEqual(['still-learning']);
  });

  it('keeps green/mastered words eligible for full tests', () => {
    const words = [
      { text: 'still-learning', status: 'in-progress' },
      { text: 'green-word', status: 'mastered' },
    ];

    expect(selectTestWords(words)).toEqual(['still-learning', 'green-word']);
  });
});

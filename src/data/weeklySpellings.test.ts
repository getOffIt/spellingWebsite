import { describe, expect, it } from 'vitest';
import voiceManifest from '../../public/voices/voice-manifest.json';
import { WEEKLY_SPELLING_WORDS, SEPTEMBER_24_SPELLING_WORDS } from './words';
import { wordSelectionConfigs } from '../config/wordSelectionConfigs';

describe('weekly spelling homework', () => {
  it('contains the exact ten words from the parent photo, in row order', () => {
    expect(WEEKLY_SPELLING_WORDS.map(word => word.text)).toEqual([
      'favourite', 'gold', 'omnivore', 'cold', 'old',
      'carnivore', 'herbivore', 'poor', 'floor', 'favour',
    ]);
    expect(new Set(WEEKLY_SPELLING_WORDS.map(word => word.text)).size).toBe(10);
  });

  it('preserves the exact Must and linked ELS words assigned on 24 September', () => {
    expect(SEPTEMBER_24_SPELLING_WORDS.filter(word => word.category === 'Must words').map(word => word.text)).toEqual([
      'colourful',
      'beautiful',
      'colossal',
      'gigantic',
      'enormous',
    ]);

    expect(SEPTEMBER_24_SPELLING_WORDS.filter(word => word.category === 'Linked ELS words').map(word => word.text)).toEqual([
      'scribe',
      'describe',
      'description',
    ]);
  });

  it('is exposed as the weekly practice section', () => {
    expect(wordSelectionConfigs.weeklySpellings.words).toBe(WEEKLY_SPELLING_WORDS);
    expect(wordSelectionConfigs.weeklySpellings.title).toContain('18 October');
  });

  it('preserves recorded audio for the previous September spellings', () => {
    for (const word of SEPTEMBER_24_SPELLING_WORDS) {
      expect(voiceManifest[word.text as keyof typeof voiceManifest]).toMatch(
        new RegExp(`/voices/.+/${word.text}\\.mp3$`),
      );
    }
  });
});

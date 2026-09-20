import { describe, expect, it } from 'vitest';
import voiceManifest from '../../public/voices/voice-manifest.json';
import { WEEKLY_SPELLING_WORDS } from './words';
import { wordSelectionConfigs } from '../config/wordSelectionConfigs';

describe('weekly spelling homework', () => {
  it('contains the exact core and challenge words assigned on 17 September', () => {
    expect(WEEKLY_SPELLING_WORDS.filter(word => word.category === "This week's words").map(word => word.text)).toEqual([
      'ancient',
      'colossal',
      'excited',
      'gigantic',
      'hour',
      'our',
      'minute',
      'really',
      'were',
      'where',
    ]);

    expect(WEEKLY_SPELLING_WORDS.filter(word => word.category === 'Challenge words').map(word => word.text)).toEqual([
      'incisor',
      'canine',
      'molar',
    ]);
  });

  it('is exposed as the weekly practice section', () => {
    expect(wordSelectionConfigs.weeklySpellings.words).toBe(WEEKLY_SPELLING_WORDS);
    expect(wordSelectionConfigs.weeklySpellings.title).toContain('17 September');
  });

  it('has recorded audio for every weekly spelling', () => {
    for (const word of WEEKLY_SPELLING_WORDS) {
      expect(voiceManifest[word.text as keyof typeof voiceManifest]).toMatch(
        new RegExp(`/voices/.+/${word.text}\\.mp3$`),
      );
    }
  });
});

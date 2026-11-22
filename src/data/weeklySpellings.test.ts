import { describe, expect, it } from 'vitest';
import voiceManifest from '../../public/voices/voice-manifest.json';
import { WEEKLY_SPELLING_WORDS, OCTOBER_18_SPELLING_WORDS, SEPTEMBER_24_SPELLING_WORDS } from './words';
import { currentWeek, previousSnapshots, snapshotWords, weeklyTitle } from './weeklyHomework';
import { wordSelectionConfigs } from '../config/wordSelectionConfigs';

describe('weekly spelling homework', () => {
  it('contains the exact ten words from the parent photo, in row order', () => {
    expect(OCTOBER_18_SPELLING_WORDS.map(word => word.text)).toEqual([
      'favourite', 'gold', 'omnivore', 'cold', 'old',
      'carnivore', 'herbivore', 'poor', 'floor', 'favour',
    ]);
    expect(new Set(OCTOBER_18_SPELLING_WORDS.map(word => word.text)).size).toBe(10);
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

  it('preserves both assigned tests, but counts their shared word only once overall', () => {
    const week47 = [currentWeek, ...previousSnapshots].find(week => week.id === '2026-11-19')!;
    expect(week47.groups.find(group => group.id === 'spelling-frame')?.words).toEqual(['again', 'any', 'central', 'centre', 'concentrate', 'concentrating', 'concentration', 'many', 'most', 'who']);
    expect(week47.groups.find(group => group.id === 'keep-going')?.words).toEqual(['called', 'centre', 'girl', 'have', 'hear', 'laugh']);
    expect(week47.groups.find(group => group.id === 'history')?.words).toEqual(['soldier', 'battle', 'arrow', 'marching', 'leader']);
    expect(snapshotWords(week47).filter(word => word.text === 'centre')).toHaveLength(1);
    expect(snapshotWords(week47)).toHaveLength(25);
  });

  it('is exposed as the weekly practice section' , () => {
    expect(wordSelectionConfigs.weeklySpellings.words).toBe(WEEKLY_SPELLING_WORDS);
    expect(wordSelectionConfigs.weeklySpellings.title).toBe(weeklyTitle);
  });

  it('preserves recorded audio for the previous September spellings', () => {
    for (const word of SEPTEMBER_24_SPELLING_WORDS) {
      expect(voiceManifest[word.text as keyof typeof voiceManifest]).toMatch(
        new RegExp(`/voices/.+/${word.text}\\.mp3$`),
      );
    }
  });
});

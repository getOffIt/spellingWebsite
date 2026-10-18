import React from 'react';
import WordListChart, { type WordListChartConfig } from '../components/WordListChart';
import { WEEKLY_SPELLING_WORDS } from '../data/words';

const config: WordListChartConfig = {
  title: 'Words of the Week',
  eyebrow: '18 October 2026 · Your spelling sheet',
  description: 'Your ten weekly words, grouped by their spelling patterns.',
  words: WEEKLY_SPELLING_WORDS,
  columns: [
    [{ id: 'favour', title: "'favour' letter string", color: 'blue', words: ['favourite', 'favour'] }],
    [{ id: 'old', title: "'old' letter string", color: 'red', words: ['gold', 'cold', 'old'] }],
    [{ id: 'vore', title: 'Animal diets — -vore', color: 'gold', words: ['omnivore', 'carnivore', 'herbivore'] }],
    [{ id: 'oor', title: "'oor' letter string", color: 'green', words: ['poor', 'floor'] }],
  ],
  returnTo: '/weekly-spellings',
  fullTestLabel: 'Test all words',
  nextCount: 3,
};

export default function WeeklySpellingsSelection({ onSelectWords }: Pick<React.ComponentProps<typeof WordListChart>, 'onSelectWords'>) {
  return <WordListChart config={config} onSelectWords={onSelectWords} />;
}

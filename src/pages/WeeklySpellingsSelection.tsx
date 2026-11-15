import React from 'react';
import WordListChart, { type WordListChartConfig } from '../components/WordListChart';
import { WEEKLY_SPELLING_WORDS } from '../data/words';

const config: WordListChartConfig = {
  title: 'Words of the Week',
  eyebrow: '12 November 2026 · Classroom spelling',
  description: 'Optional English words and two ELS examples. Still practise your next five big-list words and complete one Spelling Frame test.',
  words: WEEKLY_SPELLING_WORDS,
  columns: [
    [{ id: 'english', title: 'Could · English extension', color: 'blue', words: ['circus', 'magic', 'magician', 'acrobat', 'unicycle'] }],
    [{ id: 'els', title: 'Linked ELS examples', color: 'green', words: ['century', 'centimetre'] }],
  ],
  returnTo: '/weekly-spellings',
  fullTestLabel: 'Test all words',
  nextCount: 3,
};

export default function WeeklySpellingsSelection({ onSelectWords }: Pick<React.ComponentProps<typeof WordListChart>, 'onSelectWords'>) {
  return <WordListChart config={config} onSelectWords={onSelectWords} />;
}

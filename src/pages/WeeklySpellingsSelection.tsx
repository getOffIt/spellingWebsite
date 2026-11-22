import React from 'react';
import { Link } from 'react-router-dom';
import WordListChart, { type WordListChartConfig } from '../components/WordListChart';
import {
  WEEKLY_FRAME_WORDS,
  WEEKLY_HISTORY_WORDS,
  WEEKLY_KEEP_GOING_WORDS,
  WEEKLY_PERSONAL_WORDS,
  WEEKLY_SPELLING_WORDS,
} from '../data/words';

const config: WordListChartConfig = {
  title: 'Words of the Week — Week 47',
  eyebrow: '19–26 November 2026 · Weekly spelling',
  description: 'Start with your personal five, then practise your Spelling Frame lists. The history words are optional.',
  words: WEEKLY_SPELLING_WORDS,
  columns: [
    [{ id: 'personal', title: 'Perso · Must · Your five', color: 'green', words: WEEKLY_PERSONAL_WORDS }],
    [{ id: 'spelling-frame', title: 'Should · Spelling Frame · Due 24 November', color: 'green', words: WEEKLY_FRAME_WORDS }],
    [{ id: 'keep-going', title: 'Keep going · Spelling Frame · Due 26 November', color: 'gold', words: WEEKLY_KEEP_GOING_WORDS }],
    [{ id: 'history', title: 'Could · Optional history words', color: 'blue', words: WEEKLY_HISTORY_WORDS }],
  ],
  returnTo: '/weekly-spellings',
  fullTestLabel: 'Test all words',
  nextCount: 3,
};

export default function WeeklySpellingsSelection({ onSelectWords }: Pick<React.ComponentProps<typeof WordListChart>, 'onSelectWords'>) {
  return <WordListChart config={config} onSelectWords={onSelectWords} beforeGroups={
    <section className="chart-section" aria-labelledby="perso-heading">
      <h2 id="perso-heading">Perso · Must · Year 3 words</h2>
      <p>Look, cover, write and check your five personal words. They stay here all week, including when they turn green.</p>
      <Link to="/october-spelling-chart">Open Year 3 words →</Link>
    </section>
  } />;
}

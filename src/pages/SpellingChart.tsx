import React from 'react';
import WordListChart, { type WordListChartConfig } from '../components/WordListChart';
import { SPELLING_CHART_COLUMNS, SPELLING_CHART_WORDS } from '../data/spellingChart';

const config: WordListChartConfig = {
  title: 'Spelling Chart!',
  eyebrow: 'September 2026 · School spelling sheet',
  description: 'The complete 64-word chart, just like your sheet.',
  words: SPELLING_CHART_WORDS,
  columns: SPELLING_CHART_COLUMNS,
  returnTo: '/spelling-chart',
  fullTestLabel: 'Test full year',
  nextCount: 5,
  fullYear: true,
};

export default function SpellingChart({ onSelectWords }: Pick<React.ComponentProps<typeof WordListChart>, 'onSelectWords'>) {
  return <WordListChart config={config} onSelectWords={onSelectWords} />;
}

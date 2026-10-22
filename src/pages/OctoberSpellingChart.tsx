import React from 'react';
import WordListChart, { type WordListChartConfig } from '../components/WordListChart';
import { OCTOBER_CHART_COLUMNS, OCTOBER_CHART_WORDS } from '../data/octoberSpellingChart';

const config: WordListChartConfig = {
  title: 'Spelling Chart — October',
  eyebrow: 'Added 22 October 2026 · School spelling sheet',
  description: 'All 57 words from your new sheet, in the same six columns and rule groups.',
  words: OCTOBER_CHART_WORDS,
  columns: OCTOBER_CHART_COLUMNS,
  returnTo: '/october-spelling-chart',
  fullTestLabel: 'Test all words',
  nextCount: 5,
  fullYear: true,
};

export default function OctoberSpellingChart({ onSelectWords }: Pick<React.ComponentProps<typeof WordListChart>, 'onSelectWords'>) {
  return <WordListChart config={config} onSelectWords={onSelectWords} />;
}

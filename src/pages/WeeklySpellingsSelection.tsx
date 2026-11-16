import React from 'react';
import { Link } from 'react-router-dom';
import WordListChart, { type WordListChartConfig } from '../components/WordListChart';
import { OCTOBER_CHART_WORDS } from '../data/octoberSpellingChart';
import { useProgress } from '../contexts/ProgressProvider';
import { getEnhancedWordStatus } from '../hooks/useWord';
import { selectNextWords } from '../utils/wordSelection';
import { WEEKLY_SPELLING_WORDS } from '../data/words';

const config: WordListChartConfig = {
  title: 'Words of the Week — Week 46',
  eyebrow: '12–17 November 2026 · Weekly spelling',
  description: 'Keep your green words! Start with Perso below, then the Spelling Frame words, and finish with optional topic words. Take the assigned test on Spelling Frame too.',
  words: WEEKLY_SPELLING_WORDS,
  columns: [
    [{ id: 'spelling-frame', title: 'Should · Spelling Frame weekly test', color: 'green', words: ['Mr', 'Mrs', 'any', 'busy', 'centimetre', 'centipede', 'century', 'many', 'recent', 'recently'] }],
    [{ id: 'english', title: 'Last · Could · Optional topic words', color: 'blue', words: ['circus', 'magic', 'magician', 'acrobat', 'unicycle'] }],
  ],
  returnTo: '/weekly-spellings',
  fullTestLabel: 'Test all words',
  nextCount: 3,
};

export default function WeeklySpellingsSelection({ onSelectWords }: Pick<React.ComponentProps<typeof WordListChart>, 'onSelectWords'>) {
  const { getWordStats, progress } = useProgress();
  const personal = selectNextWords(OCTOBER_CHART_WORDS.map(word => ({
    ...word,
    status: getEnhancedWordStatus(word.text, getWordStats(word.text).status, progress[word.text] || []),
  })), 5);
  const personalWords = personal.map(text => OCTOBER_CHART_WORDS.find(word => word.text === text)!);
  const weeklyConfig: WordListChartConfig = {
    ...config,
    words: [...personalWords, ...WEEKLY_SPELLING_WORDS.filter(word => !personal.includes(word.text))],
    columns: [
      [{ id: 'personal', title: 'First · Must · Year 3 next 5', color: 'green', words: personal }],
      ...config.columns,
    ],
  };
  return <WordListChart config={weeklyConfig} onSelectWords={onSelectWords} beforeGroups={
    <section className="chart-section" aria-labelledby="perso-heading">
      <h2 id="perso-heading">Perso · Must · Year 3 words</h2>
      <p>Practise your next five personal words below using look–cover–write–check. These come from your Year 3 list, using your shared progress.</p>
      {!personal.length && <p>All your Year 3 words are green!</p>}
      <Link to="/october-spelling-chart">Open Year 3 words →</Link>
      <p>Green ticks and word history are shared across every list. Already-green words stay green.</p>
    </section>
  } />;
}

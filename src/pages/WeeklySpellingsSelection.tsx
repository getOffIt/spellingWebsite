import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import WordListChart, { type WordListChartConfig } from '../components/WordListChart';
import {
  OCTOBER_18_SPELLING_WORDS,
  SEPTEMBER_24_SPELLING_WORDS,
  WEEK_46_SPELLING_WORDS,
  WEEKLY_SPELLING_WORDS,
} from '../data/words';
import { currentWeek, previousSnapshots, snapshotWords } from '../data/weeklyHomework';
import type { ChartSection } from '../data/spellingChart';
import type { Word } from '../data/words';

const currentConfig: WordListChartConfig = {
  title: `Words of the Week — ${currentWeek.label}`,
  eyebrow: `${currentWeek.dates} ${currentWeek.year} · Weekly spelling`,
  description: currentWeek.description,
  words: WEEKLY_SPELLING_WORDS,
  columns: currentWeek.groups.map(group => [group]),
  returnTo: '/weekly-spellings',
  fullTestLabel: 'Test all words',
  nextCount: 3,
};

const archive: Array<{ id: string; title: string; words: Word[]; groups?: ChartSection[] }> = [
  ...previousSnapshots.map(week => ({
    id: week.id,
    title: `${week.label} · ${week.dates} ${week.year}`,
    words: snapshotWords(week),
    groups: week.groups,
  })),
  {
    id: '2026-11-12',
    title: 'Week 46 · 12–17 November 2026',
    words: WEEK_46_SPELLING_WORDS,
  },
  {
    id: '2026-10-18',
    title: '18 October 2026',
    words: OCTOBER_18_SPELLING_WORDS,
  },
  {
    id: '2026-09-24',
    title: '24 September 2026',
    words: SEPTEMBER_24_SPELLING_WORDS,
  },
];

export default function WeeklySpellingsSelection({ onSelectWords }: Pick<React.ComponentProps<typeof WordListChart>, 'onSelectWords'>) {
  const [params] = useSearchParams();
  const previous = archive.find(week => week.id === params.get('week'));
  const config: WordListChartConfig = previous ? {
    ...currentConfig,
    title: previous.title,
    eyebrow: 'Previous weeks',
    description: 'Review an earlier spelling list. Your progress is shared with the current week.',
    words: previous.words,
    returnTo: `/weekly-spellings?week=${previous.id}`,
    columns: previous.groups?.map(group => [group]) ?? Array.from(new Set(previous.words.map(word => word.category))).map((category, index) => [{
      id: `archive-${index}`,
      title: category,
      color: index === 0 ? 'green' : 'blue',
      words: previous.words.filter(word => word.category === category).map(word => word.text),
    }]),
  } : currentConfig;

  return <>
    <WordListChart key={config.returnTo} config={config} onSelectWords={onSelectWords} beforeGroups={previous
      ? <Link to="/weekly-spellings">← Current week</Link>
      : <section className="chart-section" aria-labelledby="perso-heading">
          <h2 id="perso-heading">Perso · Must · Year 3 words</h2>
          <p>Look, cover, write and check your five personal words. They stay here all week, including when they turn green.</p>
          <Link to="/october-spelling-chart">Open Year 3 words →</Link>
        </section>
    } />
    <nav className="spelling-chart-page" aria-labelledby="previous-weeks-heading">
      <h2 id="previous-weeks-heading">Previous weeks</h2>
      <ul>
        {archive.map(week => <li key={week.id}>
          <Link to={`?week=${week.id}`} aria-current={previous?.id === week.id ? 'page' : undefined}>{week.title}</Link>
        </li>)}
      </ul>
    </nav>
  </>;
}

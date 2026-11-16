import React from 'react';
import { Link } from 'react-router-dom';
import WordListChart, { type WordListChartConfig } from '../components/WordListChart';
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
  return <WordListChart config={config} onSelectWords={onSelectWords} beforeGroups={
    <section className="chart-section" aria-labelledby="perso-heading">
      <div className="chart-rule chart-rule-green"><h2 id="perso-heading">Perso · Must · Personal big list</h2></div>
      <p>Practise your next five personal words using look–cover–write–check. The teacher has not named your five online, so we have not guessed them.</p>
      <Link to="/spelling-chart">Open your personal spelling chart →</Link>
      <p>Green ticks and word history are shared across every list. Already-green words stay green.</p>
    </section>
  } />;
}

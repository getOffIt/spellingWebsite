import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWord, getEnhancedWordStatus } from '../hooks/useWord';
import { useProgress } from '../contexts/ProgressProvider';
import { getMasteryThreshold } from '../config/masteryThresholds';
import type { ChartSection } from '../data/spellingChart';
import type { Word } from '../data/words';
import { selectNextWords } from '../utils/wordSelection';
import { getWordTip } from '../data/wordTips';
import { getLessonForCategory } from '../data/categoryLessons';
import AudioLesson from '../components/AudioLesson';
import { VoiceService } from '../services/VoiceService';
import '../pages/SpellingChart.css';

export interface WordListChartConfig {
  title: string;
  eyebrow: string;
  description: string;
  words: Word[];
  columns: ChartSection[][];
  returnTo: string;
  fullTestLabel: string;
  nextCount: number;
  fullYear?: boolean;
}

interface Props {
  config: WordListChartConfig;
  onSelectWords: (words: string[], type: 'single' | 'less_family', mode?: 'practice' | 'full_test', passThreshold?: number) => void;
}

function ChartWord({ word, onClick }: { word: string; onClick: () => void }) {
  const stats = useWord(word);
  const mastered = stats.status === 'mastered';
  return <button className={`chart-word chart-word-${stats.status}`} onClick={onClick}
    aria-label={`${word}: ${mastered ? 'mastered' : stats.status.replace('-', ' ')}. View effort and history`}>
    <span>{word}</span>
    <span className="chart-word-status">{mastered ? '✓' : `${stats.streak}/${getMasteryThreshold(word)}`}</span>
  </button>;
}

function WordHistory({ word, onClose, onTest }: { word: string; onClose: () => void; onTest: () => void }) {
  const stats = useWord(word);
  const ref = useRef<HTMLDialogElement>(null);
  const voiceRef = useRef<VoiceService | null>(null);
  const [audioError, setAudioError] = useState(false);
  useEffect(() => {
    ref.current?.showModal();
    return () => { voiceRef.current?.stop(); };
  }, []);
  const attempts = stats.attempts;
  const correct = attempts.filter(attempt => attempt.correct).length;
  const recent = attempts.slice(-10);
  const days = new Set(attempts.map(attempt => new Date(attempt.date).toLocaleDateString('en-GB'))).size;
  const tip = getWordTip(word);
  return <dialog ref={ref} className="chart-history" aria-labelledby="chart-history-title" onCancel={onClose} onClose={onClose}>
    <div className="chart-history-heading"><h2 id="chart-history-title">{word} — effort &amp; history</h2><button onClick={onClose} aria-label="Close word history">✕</button></div>
    <p>{stats.status === 'mastered' ? '✓ Mastered' : 'Still learning'} · {stats.streak} correct in a row · {getMasteryThreshold(word)} needed for green</p>
    <dl className="chart-history-stats">
      <div><dt>Attempts</dt><dd>{attempts.length}</dd></div>
      <div><dt>Correct</dt><dd>{correct}/{attempts.length}</dd></div>
      <div><dt>Accuracy</dt><dd>{attempts.length ? `${Math.round(correct / attempts.length * 100)}%` : '—'}</dd></div>
      <div><dt>Practice days</dt><dd>{days}</dd></div>
      <div><dt>Last 10 attempts</dt><dd>{recent.filter(attempt => attempt.correct).length}/{recent.length}</dd></div>
      <div><dt>Last practised</dt><dd>{stats.lastSeen ? new Date(stats.lastSeen).toLocaleDateString('en-GB') : 'Never'}</dd></div>
    </dl>
    <div className="chart-actions"><button onClick={onTest}>Test this word</button><button onClick={async () => {
      setAudioError(false);
      try { voiceRef.current ??= new VoiceService(); await voiceRef.current.speak(word); } catch { setAudioError(true); }
    }}>Listen to word</button></div>
    {audioError && <p role="status">Audio could not play. Please try again.</p>}
    {tip && <aside className="chart-tip"><p>💡 {tip.tip}</p><audio controls preload="none" src={tip.audioFile} aria-label={`Spelling tip for ${word}`} /></aside>}
    <h3>Every attempt · newest first</h3>
    {attempts.length ? <div className="chart-history-table"><table><thead><tr><th>Date &amp; time</th><th>You wrote</th><th>Result</th></tr></thead>
      <tbody>{[...attempts].reverse().map((attempt, index) => <tr key={`${attempt.date}-${index}`}>
        <td>{new Date(attempt.date).toLocaleString('en-GB')}</td><td>{attempt.attempt || '(blank)'}</td><td>{attempt.correct ? '✓ Correct' : '✗ Incorrect'}</td>
      </tr>)}</tbody></table></div> : <p>No attempts yet. Take a test to start your history.</p>}
  </dialog>;
}

export default function WordListChart({ onSelectWords, config }: Props) {
  const navigate = useNavigate();
  const { getWordStats, progress } = useProgress();
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [lessonCategory, setLessonCategory] = useState<string | null>(null);
  // Reuse the enhanced status (including lost mastery) and existing next-word priority.
  const statuses = config.words.map(word => ({
    ...word,
    status: getEnhancedWordStatus(word.text, getWordStats(word.text).status, progress[word.text] || []),
  }));
  const next = selectNextWords(statuses, config.nextCount);
  const mastered = statuses.filter(word => word.status === 'mastered').length;
  const lesson = lessonCategory ? getLessonForCategory(lessonCategory) : null;
  const start = (words: string[]) => {
    if (!words.length) return;
    onSelectWords(words, 'single', 'full_test');
    navigate('/spelling-test', { state: { returnTo: config.returnTo } });
  };
  return <div className="spelling-chart-page">
    <Link to="/">← Challenges</Link>
    <header className="chart-heading"><div><p className="chart-eyebrow">{config.eyebrow}</p><h1>{config.title}</h1><p>{config.description}</p></div><strong>{mastered}/{config.words.length} green ✓</strong></header>
    <div className="chart-actions"><button onClick={() => start(config.words.map(word => word.text))}>{config.fullTestLabel} · {config.words.length} words</button>
      <button onClick={() => start(next)} disabled={!next.length}>Test next {next.length || config.nextCount}</button></div>
    <p className="chart-help">Green + ✓ = {getMasteryThreshold(config.words[0].text)} correct in a row. Click any word for effort and history. Next {config.nextCount} prioritises words needing practice; full-list and group tests include green words.</p>
    {!!next.length && <p className="chart-next">Next up: {next.join(', ')}</p>}
    {!next.length && <p className="chart-next">All words are green! Take a full-list or group test to check recall.</p>}
    {config.fullYear && <p className="chart-mobile-hint">Swipe across to see all six columns →</p>}
    <div className="chart-scroll" tabIndex={0} role="region" aria-label={config.fullYear ? "Six-column spelling chart" : `${config.title} spelling chart`}>
      <div className={`spelling-chart-grid${config.fullYear ? "" : " spelling-chart-grid-compact"}`} style={config.fullYear ? undefined : { '--chart-columns': config.columns.length } as React.CSSProperties}>{config.columns.map((column, index) => <div className="chart-column" key={index}>
        {column.map(section => <section className="chart-section" key={section.id} aria-labelledby={`rule-${section.id}`}>
          <div className={`chart-rule chart-rule-${section.color}`}><h2 id={`rule-${section.id}`}>{section.title}</h2>
            <span>{section.words.filter(word => getWordStats(word).status === 'mastered').length}/{section.words.length} green</span>
            <div className="chart-rule-actions"><button onClick={() => start(section.words)} aria-label={`${config.fullYear ? "Test rule" : "Test group"}: ${section.title}`}>{config.fullYear ? "Test rule" : "Test group"}</button>
              {section.lessonCategory && getLessonForCategory(section.lessonCategory) && <button onClick={() => setLessonCategory(section.lessonCategory!)} aria-label={`Learn rule: ${section.title}`}>Learn</button>}</div>
          </div>
          {section.words.map(word => <ChartWord key={word} word={word} onClick={() => setActiveWord(word)} />)}
        </section>)}
      </div>)}</div>
    </div>
    {activeWord && <WordHistory word={activeWord} onClose={() => setActiveWord(null)} onTest={() => start([activeWord])} />}
    {lesson && <AudioLesson lesson={lesson} onClose={() => setLessonCategory(null)} />}
  </div>;
}

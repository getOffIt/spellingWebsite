import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { YEAR2_WORDS } from '../data/words';
import { useProgress } from '../contexts/ProgressProvider';
import './WordSelection.css';

interface WordSelectionProps {
  onSelectWords: (words: string[], type: 'single' | 'less_family') => void;
}

const getStatusIcon = (status: string) => {
  return <span className={`word-selection-status ${status}`}>•</span>;
};

const WordSelection: React.FC<WordSelectionProps> = ({ onSelectWords }) => {
  const { progress } = useProgress();
  const navigate = useNavigate();
  const [practiceAsFamily, setPracticeAsFamily] = useState(false);

  // Get all -less words
  const lessWords = useMemo(() => 
    YEAR2_WORDS.filter(word => word.category === '-less'),
    []
  );

  // Overall progress calculation for -less words
  const totalWords = lessWords.length;
  const masteredWords = lessWords.filter(word => progress[word.id]?.status === 'mastered').length;
  const overallPercent = Math.round((masteredWords / totalWords) * 100);

  const selectNextWords = (words: typeof YEAR2_WORDS) => {
    // Sort words by priority: in-progress > not-started > mastered
    const sortedWords = [...words].sort((a, b) => {
      const statusA = progress[a.id]?.status || 'not-started';
      const statusB = progress[b.id]?.status || 'not-started';
      
      const priority = {
        'in-progress': 0,
        'not-started': 1,
        'mastered': 2
      };
      
      return priority[statusA] - priority[statusB];
    });

    // Take the first 3 words
    return sortedWords.slice(0, 3).map(w => w.text);
  };

  return (
    <div className="word-selection-container">
      <h1 className="word-selection-title">-less Family Words</h1>
      <div className="word-selection-overall-progress">
        <div className="word-selection-overall-progress-bar">
          <div
            className="word-selection-overall-progress-fill"
            style={{ width: `${overallPercent}%` }}
          />
        </div>
        <span className="word-selection-overall-progress-text">
          {masteredWords}/{totalWords} mastered
        </span>
      </div>

      {/* Special -less family practice option */}
      <div 
        className="word-selection-category word-selection-special"
        onClick={() => {
          const selectedWords = selectNextWords(lessWords);
          onSelectWords(selectedWords, practiceAsFamily ? 'less_family' : 'single');
          navigate('/');
        }}
        style={{ cursor: 'pointer' }}
      >
        <div className="word-selection-category-header">
          <h2 className="word-selection-category-title">Practice -less Family Together</h2>
          <div className="word-selection-category-progress">
            <div className="word-selection-progress-bar">
              <div 
                className="word-selection-progress-fill"
                style={{ width: `${overallPercent}%` }}
              />
            </div>
            <span className="word-selection-progress-text">
              {masteredWords}/{totalWords}
            </span>
          </div>
        </div>

        {/* Toggle switch for practice mode */}
        <div className="word-selection-toggle" onClick={(e) => e.stopPropagation()}>
          <span className="toggle-label">Faster</span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={practiceAsFamily}
              onChange={(e) => setPracticeAsFamily(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Easier</span>
        </div>

        <div className="word-selection-words-list">
          {lessWords.map(word => {
            const status = progress[word.id]?.status || 'not-started';
            return (
              <span
                key={word.id}
                className={`word-selection-word ${status}`}
              >
                {getStatusIcon(status)} {word.text}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WordSelection; 
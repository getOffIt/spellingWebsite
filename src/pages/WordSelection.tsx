import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { YEAR1_WORDS, YEAR2_WORDS } from '../data/words';
import { useWord } from '../hooks/useWord';
import KS11Challenge from '../components/KS11Challenge';
import './WordSelection.css';

interface WordSelectionProps {
  onSelectWords: (words: string[], type: 'single' | 'less_family') => void;
}

const getStatusIcon = (status: string) => {
  return <span className={`word-selection-status ${status}`}>•</span>;
};

const WordSelection: React.FC<WordSelectionProps> = ({ onSelectWords }) => {
  const navigate = useNavigate();
  const [practiceAsFamily, setPracticeAsFamily] = useState(false);

  // Get all -ies words
  const iesWords = useMemo(() => 
    YEAR2_WORDS.filter(word => word.category === '-ies'),
    []
  );

  // Get all KS1-1 words, excluding categories that start with "adding"
  const ks1Words = useMemo(() => 
    YEAR1_WORDS.filter(word => !word.category.startsWith('adding')),
    []
  );

  // Build status arrays for all words (call hooks at top level, not in useMemo or reduce)
  const iesWordsStatusList = iesWords.map(word => useWord(word.id));
  const ks1WordsStatusList = ks1Words.map(word => useWord(word.id));

  // Calculate progress for -ies words
  const iesTotalWords = iesWords.length;
  const iesMasteredWords = iesWordsStatusList.filter(status => status.status === 'mastered').length;
  const iesOverallPercent = Math.round((iesMasteredWords / iesTotalWords) * 100);

  // Calculate progress for KS1-1 words
  const ks1TotalWords = ks1Words.length;
  const ks1MasteredWords = ks1WordsStatusList.filter(status => status.status === 'mastered').length;
  const ks1OverallPercent = Math.round((ks1MasteredWords / ks1TotalWords) * 100);

  // Build wordStatuses array for KS1-1 Challenge
  const ks1WordStatuses = ks1Words.map((word, i) => ({
    ...word,
    status: ks1WordsStatusList[i].status || 'not-started',
  }));

  const selectNextWords = (words: typeof YEAR1_WORDS | typeof YEAR2_WORDS, wordsStatusList: ReturnType<typeof useWord>[]) => {
    // Sort words by priority: in-progress > not-started > mastered
    const sortedWords = [...words].sort((a, b) => {
      const statusA = wordsStatusList[words.findIndex(w => w.id === a.id)]?.status || 'not-started';
      const statusB = wordsStatusList[words.findIndex(w => w.id === b.id)]?.status || 'not-started';
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

  const handleCategoryClick = (words: typeof YEAR1_WORDS) => {
    const selectedWords = selectNextWords(words, ks1WordsStatusList);
    onSelectWords(selectedWords, 'single');
    navigate('/spellingTest', { state: { words: selectedWords } });
  };

  return (
    <div className="word-selection-container">
      <h1 className="word-selection-title">Word Selection</h1>

      {/* -ies Family Section */}
      <div className="word-selection-section">
        <h2 className="word-selection-section-title">-ies Family Words</h2>
        <div className="word-selection-overall-progress">
          <div className="word-selection-overall-progress-bar">
            <div
              className="word-selection-overall-progress-fill"
              style={{ width: `${iesOverallPercent}%` }}
            />
          </div>
          <span className="word-selection-overall-progress-text">
            {iesMasteredWords}/{iesTotalWords} mastered
          </span>
        </div>

        <div 
          className="word-selection-category word-selection-special"
          onClick={() => {
            const selectedWords = selectNextWords(iesWords, iesWordsStatusList);
            onSelectWords(selectedWords, practiceAsFamily ? 'less_family' : 'single');
            navigate('/');
          }}
          style={{ cursor: 'pointer' }}
        >
          <div className="word-selection-category-header">
            <h2 className="word-selection-category-title">Practice -ies Family Together</h2>
            <div className="word-selection-category-progress">
              <div className="word-selection-progress-bar">
                <div 
                  className="word-selection-progress-fill"
                  style={{ width: `${iesOverallPercent}%` }}
                />
              </div>
              <span className="word-selection-progress-text">
                {iesMasteredWords}/{iesTotalWords}
              </span>
            </div>
          </div>

          <div className="word-selection-words-list">
            {iesWords.map(word => {
              const status = iesWordsStatusList[iesWords.findIndex(w => w.id === word.id)]?.status || 'not-started';
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

      {/* KS1-1 Section */}
      <div className="word-selection-section">
        <KS11Challenge wordStatuses={ks1WordStatuses} onSelectWords={onSelectWords} />

        <div className="word-selection-categories">
          {Array.from(new Set(ks1Words.map(word => word.category))).map(category => {
            const categoryWords = ks1Words.filter(word => word.category === category);
            const masteredWords = categoryWords.filter(word => ks1WordsStatusList[ks1Words.findIndex(w => w.id === word.id)]?.status === 'mastered').length;
            const percent = Math.round((masteredWords / categoryWords.length) * 100);

            return (
              <div
                key={category}
                className="word-selection-category"
                onClick={() => handleCategoryClick(categoryWords)}
                style={{ cursor: 'pointer' }}
              >
                <div className="word-selection-category-header">
                  <h2 className="word-selection-category-title">{category}</h2>
                  <div className="word-selection-category-progress">
                    <div className="word-selection-progress-bar">
                      <div 
                        className="word-selection-progress-fill"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="word-selection-progress-text">
                      {masteredWords}/{categoryWords.length}
                    </span>
                  </div>
                </div>
                <div className="word-selection-words-list">
                  {categoryWords.map(word => {
                    const status = ks1WordsStatusList[ks1Words.findIndex(w => w.id === word.id)]?.status || 'not-started';
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
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WordSelection; 
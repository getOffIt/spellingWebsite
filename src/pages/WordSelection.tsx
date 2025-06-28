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

  // Get all this-week words
  const thisWeekWords = useMemo(() => 
    YEAR2_WORDS.filter(word => word.category === 'this-week'),
    []
  );

  // Get all KS1-1 words, excluding categories that start with "adding"
  const ks1Words = useMemo(() => 
    YEAR1_WORDS.filter(word => !word.category.startsWith('adding')),
    []
  );

  // Build status arrays for all words (call hooks at top level, not in useMemo or reduce)
  const thisWeekWordsStatusList = thisWeekWords.map(word => useWord(word.id));
  const ks1WordsStatusList = ks1Words.map(word => useWord(word.id));

  // Calculate progress for this-week words
  const thisWeekTotalWords = thisWeekWords.length;
  const thisWeekMasteredWords = thisWeekWordsStatusList.filter(status => status.status === 'mastered').length;
  const thisWeekOverallPercent = Math.round((thisWeekMasteredWords / thisWeekTotalWords) * 100);

  // Calculate progress for KS1-1 words
  const ks1TotalWords = ks1Words.length;
  const ks1MasteredWords = ks1WordsStatusList.filter(status => status.status === 'mastered').length;
  const ks1OverallPercent = Math.round((ks1MasteredWords / ks1TotalWords) * 100);

  // Build wordStatuses array for KS1-1 Challenge
  const ks1ChallengeWordStatuses = ks1Words.map((word, i) => ({
    ...word,
    status: ks1WordsStatusList[i].status || 'not-started',
  }));

  const selectNextWords = (words: typeof YEAR1_WORDS | typeof YEAR2_WORDS, wordsStatusList: ReturnType<typeof useWord>[]) => {
    // Create a map of word IDs to their statuses for the given word list
    const wordStatusMap = new Map();
    words.forEach((word, index) => {
      wordStatusMap.set(word.id, wordsStatusList[index]?.status || 'not-started');
    });

    // Sort words by priority: in-progress > not-started > mastered
    const sortedWords = [...words].sort((a, b) => {
      const statusA = wordStatusMap.get(a.id) || 'not-started';
      const statusB = wordStatusMap.get(b.id) || 'not-started';
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
    // Create status list for the specific category words
    const categoryWordsStatusList = words.map(word => {
      const index = ks1Words.findIndex(w => w.id === word.id);
      return ks1WordsStatusList[index];
    });
    
    const selectedWords = selectNextWords(words, categoryWordsStatusList);
    onSelectWords(selectedWords, 'single');
    navigate('/spellingTest', { state: { words: selectedWords } });
  };

  return (
    <div className="word-selection-container">
      <h1 className="word-selection-title">Word Selection</h1>

      {/* This Week's Spelling Words Section */}
      <div className="word-selection-section">
        <h2 className="word-selection-section-title">This Week's Spelling Words</h2>
        <div className="word-selection-overall-progress">
          <div className="word-selection-overall-progress-bar">
            <div
              className="word-selection-overall-progress-fill"
              style={{ width: `${thisWeekOverallPercent}%` }}
            />
          </div>
          <span className="word-selection-overall-progress-text">
            {thisWeekMasteredWords}/{thisWeekTotalWords} mastered
          </span>
        </div>

        <div 
          className="word-selection-category word-selection-special"
          onClick={() => {
            const selectedWords = selectNextWords(thisWeekWords, thisWeekWordsStatusList);
            onSelectWords(selectedWords, practiceAsFamily ? 'less_family' : 'single');
            navigate('/');
          }}
          style={{ cursor: 'pointer' }}
        >
          <div className="word-selection-category-header">
            <h2 className="word-selection-category-title">Practice This Week's Words Together</h2>
            <div className="word-selection-category-progress">
              <div className="word-selection-progress-bar">
                <div 
                  className="word-selection-progress-fill"
                  style={{ width: `${thisWeekOverallPercent}%` }}
                />
              </div>
              <span className="word-selection-progress-text">
                {thisWeekMasteredWords}/{thisWeekTotalWords}
              </span>
            </div>
          </div>

          <div className="word-selection-words-list">
            {thisWeekWords.map(word => {
              const status = thisWeekWordsStatusList[thisWeekWords.findIndex(w => w.id === word.id)]?.status || 'not-started';
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
        <KS11Challenge wordStatuses={ks1ChallengeWordStatuses} onSelectWords={onSelectWords} />

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
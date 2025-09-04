import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { YEAR1_WORDS, YEAR2_WORDS } from '../data/words';
import { useWord } from '../hooks/useWord';
import { selectNextWords } from '../utils/wordSelection';
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

  // Get all KS1-1 words, excluding categories that start with "adding"
  const ks1Words = useMemo(() => 
    YEAR1_WORDS.filter(word => !word.category.startsWith('adding')),
    []
  );

  // Build status arrays for all words (call hooks at top level, not in useMemo or reduce)
  const ks1WordsStatusList = ks1Words.map(word => useWord(word.id));

  // Calculate progress for KS1-1 words
  const ks1TotalWords = ks1Words.length;
  const ks1MasteredWords = ks1WordsStatusList.filter(status => status.status === 'mastered').length;
  const ks1OverallPercent = Math.round((ks1MasteredWords / ks1TotalWords) * 100);

  // Build wordStatuses array for KS1-1 Challenge
  const ks1ChallengeWordStatuses = ks1Words.map((word, i) => ({
    ...word,
    status: ks1WordsStatusList[i].status || 'not-started',
  }));

  const selectNextWordsForCategory = (words: typeof YEAR1_WORDS | typeof YEAR2_WORDS, wordsStatusList: ReturnType<typeof useWord>[]) => {
    // Create words with status for the utility function
    const wordsWithStatus = words.map((word, index) => ({
      ...word,
      status: wordsStatusList[index]?.status || 'not-started'
    }));

    return selectNextWords(wordsWithStatus, 3);
  };

  const handleCategoryClick = (words: typeof YEAR1_WORDS) => {
    // Create status list for the specific category words
    const categoryWordsStatusList = words.map(word => {
      const index = ks1Words.findIndex(w => w.id === word.id);
      return ks1WordsStatusList[index];
    });
    
    const selectedWords = selectNextWordsForCategory(words, categoryWordsStatusList);
    onSelectWords(selectedWords, 'single');
    navigate('/spellingTest', { state: { words: selectedWords } });
  };

  return (
    <div className="word-selection-container">
      <h1 className="word-selection-title">Word Selection</h1>
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
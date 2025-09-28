import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { COMMON_WORDS } from '../data/words';
import { useWord } from '../hooks/useWord';
import { selectNextWords } from '../utils/wordSelection';
import './WordSelection.css';
import './CommonWordsSelection.css';

interface CommonWordsSelectionProps {
  onSelectWords: (words: string[], type: 'single' | 'less_family') => void;
}

const getStatusIcon = (status: string) => {
  return <span className={`word-selection-status ${status}`}>•</span>;
};

const CommonWordsSelection: React.FC<CommonWordsSelectionProps> = ({ onSelectWords }) => {
  const navigate = useNavigate();

  // Build status arrays for all common words
  const commonWordsStatusList = COMMON_WORDS.map(word => useWord(word.id));

  // Calculate overall progress
  const totalWords = COMMON_WORDS.length;
  const masteredWords = commonWordsStatusList.filter(status => status.status === 'mastered').length;
  const overallPercent = Math.round((masteredWords / totalWords) * 100);

  // Build wordStatuses array
  const wordStatuses = COMMON_WORDS.map((word, i) => ({
    ...word,
    status: commonWordsStatusList[i].status || 'not-started',
  }));

  const categories = useMemo(() => {
    // Group words by category and maintain order
    const categoryOrder = new Map<string, number>();
    COMMON_WORDS.forEach((word, index) => {
      if (!categoryOrder.has(word.category)) {
        categoryOrder.set(word.category, index);
      }
    });

    const grouped = COMMON_WORDS.reduce((acc, word) => {
      if (!acc[word.category]) {
        acc[word.category] = [];
      }
      acc[word.category].push(word);
      return acc;
    }, {} as Record<string, typeof COMMON_WORDS>);

    return Object.entries(grouped)
      .sort(([a], [b]) => {
        const orderA = categoryOrder.get(a) ?? Infinity;
        const orderB = categoryOrder.get(b) ?? Infinity;
        return orderA - orderB;
      });
  }, []);

  const getCategoryProgress = (categoryWords: typeof COMMON_WORDS) => {
    const wordList = wordStatuses.filter(w => categoryWords.some(ww => ww.id === w.id));
    const total = wordList.length;
    const mastered = wordList.filter(word => word.status === 'mastered').length;
    return {
      total,
      mastered,
      percentage: Math.round((mastered / total) * 100)
    };
  };

  const selectNextWordsForCategory = (words: typeof COMMON_WORDS) => {
    const wordList = wordStatuses.filter(w => words.some(ww => ww.id === w.id));
    return selectNextWords(wordList, 3);
  };

  const handleCategoryClick = (words: typeof COMMON_WORDS) => {
    const selectedWords = selectNextWordsForCategory(words);
    onSelectWords(selectedWords, 'single');
    navigate('/spelling-test');
  };

  return (
    <div className="word-selection-container common-words-page">
      <h1 className="word-selection-title">Common Words Challenge</h1>
      
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

      <div className="word-selection-categories">
        {categories.map(([category, words]) => {
          const catProgress = getCategoryProgress(words);
          return (
            <div
              key={category}
              className="word-selection-category"
              onClick={() => handleCategoryClick(words)}
              style={{ cursor: 'pointer' }}
            >
              <div className="word-selection-category-header">
                <h2 className="word-selection-category-title">{category}</h2>
                <div className="word-selection-category-progress">
                  <div className="word-selection-progress-bar">
                    <div 
                      className="word-selection-progress-fill"
                      style={{ width: `${catProgress.percentage}%` }}
                    />
                  </div>
                  <span className="word-selection-progress-text">
                    {catProgress.mastered}/{catProgress.total}
                  </span>
                </div>
              </div>
              <div className="word-selection-words-list">
                {wordStatuses.filter(w => words.some(ww => ww.id === w.id)).map(word => {
                  const status = word.status;
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
  );
};

export default CommonWordsSelection;

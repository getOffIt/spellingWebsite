import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Word } from '../data/words';
import { useWord } from '../hooks/useWord';
import { selectNextWords } from '../utils/wordSelection';
import '../pages/WordSelection.css';

interface BaseWordSelectionProps {
  words: Word[];
  title: string;
  themeClass?: string;
  wordFilter?: (word: Word) => boolean;
  showOverallProgress?: boolean;
  challengeComponent?: React.ReactNode;
  onSelectWords: (words: string[], type: 'single' | 'less_family') => void;
}

const getStatusIcon = (status: string) => {
  return <span className={`word-selection-status ${status}`}>•</span>;
};

const BaseWordSelection: React.FC<BaseWordSelectionProps> = ({
  words,
  title,
  themeClass,
  wordFilter,
  showOverallProgress = false,
  challengeComponent,
  onSelectWords,
}) => {
  const navigate = useNavigate();

  // Call hooks for ALL words first (must be consistent number of hook calls)
  // This ensures we always call the same number of hooks regardless of filtering
  const allWordsStatusList = words.map(word => useWord(word.id));

  // Create a map of word id to status for efficient lookup
  const statusMap = useMemo(() => {
    const map = new Map<string, ReturnType<typeof useWord>>();
    words.forEach((word, index) => {
      map.set(word.id, allWordsStatusList[index]);
    });
    return map;
  }, [words, allWordsStatusList]);

  // Apply word filter if provided
  const filteredWords = useMemo(() => {
    return wordFilter ? words.filter(wordFilter) : words;
  }, [words, wordFilter]);

  // Build wordStatuses array for filtered words using the status map
  const wordStatuses = useMemo(() => {
    return filteredWords.map(word => ({
      ...word,
      status: statusMap.get(word.id)?.status || 'not-started',
    }));
  }, [filteredWords, statusMap]);

  // Calculate overall progress
  const totalWords = filteredWords.length;
  const masteredWords = wordStatuses.filter(word => word.status === 'mastered').length;
  const overallPercent = Math.round((masteredWords / totalWords) * 100);

  // Group words by category and maintain order (from CommonWordsSelection logic)
  const categories = useMemo(() => {
    const categoryOrder = new Map<string, number>();
    filteredWords.forEach((word, index) => {
      if (!categoryOrder.has(word.category)) {
        categoryOrder.set(word.category, index);
      }
    });

    const grouped = filteredWords.reduce((acc, word) => {
      if (!acc[word.category]) {
        acc[word.category] = [];
      }
      acc[word.category].push(word);
      return acc;
    }, {} as Record<string, Word[]>);

    return Object.entries(grouped)
      .sort(([a], [b]) => {
        const orderA = categoryOrder.get(a) ?? Infinity;
        const orderB = categoryOrder.get(b) ?? Infinity;
        return orderA - orderB;
      });
  }, [filteredWords]);

  const getCategoryProgress = (categoryWords: Word[]) => {
    const wordList = wordStatuses.filter(w => categoryWords.some(ww => ww.id === w.id));
    const total = wordList.length;
    const mastered = wordList.filter(word => word.status === 'mastered').length;
    return {
      total,
      mastered,
      percentage: Math.round((mastered / total) * 100)
    };
  };

  const selectNextWordsForCategory = (categoryWords: Word[]) => {
    const wordList = wordStatuses.filter(w => categoryWords.some(ww => ww.id === w.id));
    return selectNextWords(wordList, 3);
  };

  const handleCategoryClick = (categoryWords: Word[]) => {
    const selectedWords = selectNextWordsForCategory(categoryWords);
    onSelectWords(selectedWords, 'single');
    navigate('/spelling-test');
  };

  const containerClass = themeClass 
    ? `word-selection-container ${themeClass}`
    : 'word-selection-container';

  return (
    <div className={containerClass}>
      <h1 className="word-selection-title">{title}</h1>
      
      {showOverallProgress && (
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
      )}

      {challengeComponent && (
        <div className="word-selection-section">
          {challengeComponent}
        </div>
      )}

      <div className="word-selection-categories">
        {categories.map(([category, categoryWords]) => {
          const catProgress = getCategoryProgress(categoryWords);
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
                      style={{ width: `${catProgress.percentage}%` }}
                    />
                  </div>
                  <span className="word-selection-progress-text">
                    {catProgress.mastered}/{catProgress.total}
                  </span>
                </div>
              </div>
              <div className="word-selection-words-list">
                {wordStatuses.filter(w => categoryWords.some(ww => ww.id === w.id)).map(word => {
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

export default BaseWordSelection;


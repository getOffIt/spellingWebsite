import React, { useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Word } from '../data/words';
import { useWord } from '../hooks/useWord';
import { selectNextWords } from '../utils/wordSelection';
import Challenge, { ChallengeConfig } from './Challenge';
import '../pages/WordSelection.css';

interface BaseWordSelectionProps {
  words: Word[];
  title: string;
  themeClass?: string;
  wordFilter?: (word: Word) => boolean;
  challengeConfig?: ChallengeConfig;
  onSelectWords: (
    words: string[], 
    type: 'single' | 'less_family',
    testMode?: 'practice' | 'full_test',
    passThreshold?: number
  ) => void;
}

const getStatusIcon = (status: string) => {
  return <span className={`word-selection-status ${status}`}>•</span>;
};

const BaseWordSelection: React.FC<BaseWordSelectionProps> = ({
  words,
  title,
  themeClass,
  wordFilter,
  challengeConfig,
  onSelectWords,
}) => {
  const navigate = useNavigate();

  // Call hooks for ALL words first (must be consistent number of hook calls)
  // This ensures we always call the same number of hooks regardless of filtering
  const allWordsStatusList = words.map(word => useWord(word.id));

  // Track previous statuses to detect actual changes (not just array reference changes)
  const prevStatusesRef = useRef<string>('');
  const statusMapRef = useRef<Map<string, ReturnType<typeof useWord>>>(new Map());

  // Build current statuses string for comparison
  const currentStatusesString = allWordsStatusList.map(s => s?.status || 'not-started').join(',');

  // Only recreate statusMap when statuses actually change
  if (prevStatusesRef.current !== currentStatusesString || words.length !== statusMapRef.current.size) {
    const map = new Map<string, ReturnType<typeof useWord>>();
    words.forEach((word, index) => {
      map.set(word.id, allWordsStatusList[index]);
    });
    statusMapRef.current = map;
    prevStatusesRef.current = currentStatusesString;
  }

  const statusMap = statusMapRef.current;

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
  const overallPercent = totalWords > 0 ? Math.round((masteredWords / totalWords) * 100) : 0;

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

  // Build a map from category to wordStatuses for efficient lookup
  const categoryToWordStatuses = useMemo(() => {
    const map: Record<string, typeof wordStatuses> = {};
    wordStatuses.forEach(word => {
      if (!map[word.category]) {
        map[word.category] = [];
      }
      map[word.category].push(word);
    });
    return map;
  }, [wordStatuses]);

  const getCategoryProgress = (category: string) => {
    const wordList = categoryToWordStatuses[category] || [];
    const total = wordList.length;
    const mastered = wordList.filter(word => word.status === 'mastered').length;
    return {
      total,
      mastered,
      percentage: total > 0 ? Math.round((mastered / total) * 100) : 0
    };
  };

  const selectNextWordsForCategory = (category: string) => {
    const wordList = categoryToWordStatuses[category] || [];
    return selectNextWords(wordList, 3);
  };

  const handleCategoryClick = (category: string) => {
    const selectedWords = selectNextWordsForCategory(category);
    onSelectWords(selectedWords, 'single');
    navigate('/spelling-test');
  };

  const containerClass = themeClass 
    ? `word-selection-container ${themeClass}`
    : 'word-selection-container';

  return (
    <div className={containerClass}>
      {!challengeConfig && (
        <>
          <h1 className="word-selection-title">{title}</h1>
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
        </>
      )}

      {challengeConfig && (
        <div className="word-selection-section">
          <Challenge
            wordStatuses={wordStatuses}
            config={challengeConfig}
            onSelectWords={onSelectWords}
            navigate={navigate}
          />
        </div>
      )}

      <div className="word-selection-categories">
        {categories.map(([category, categoryWords]) => {
          const catProgress = getCategoryProgress(category);
          return (
            <div
              key={category}
              className="word-selection-category"
              onClick={() => handleCategoryClick(category)}
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


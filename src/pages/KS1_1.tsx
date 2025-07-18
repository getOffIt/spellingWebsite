import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { YEAR1_WORDS } from '../data/words';
import { useWord } from '../hooks/useWord';
import './KS1_1.css';
import KS11Challenge from '../components/KS11Challenge';

interface KS1_1Props {
  onSelectWords: (words: string[], type: 'single' | 'less_family') => void;
}

const getStatusIcon = (status: string) => {
  return <span className={`ks1-1-word-status ${status}`}>•</span>;
};

const KS1_1: React.FC<KS1_1Props> = ({ onSelectWords }) => {
  const navigate = useNavigate();

  // Build status array for all words (call hooks at top level, not in map inside an object)
  const wordStatusList = YEAR1_WORDS.map(word => useWord(word.id));

  const totalWords = YEAR1_WORDS.length;
  const masteredWords = wordStatusList.filter(status => status.status === 'mastered').length;
  const overallPercent = Math.round((masteredWords / totalWords) * 100);

  // Build wordStatuses array for KS1-1 Challenge
  const wordStatuses = YEAR1_WORDS.map((word, i) => ({
    ...word,
    status: wordStatusList[i].status || 'not-started',
  }));

  const categories = useMemo(() => {
    // Create a map of category to its first occurrence index
    const categoryOrder = new Map<string, number>();
    YEAR1_WORDS.forEach((word, index) => {
      if (!categoryOrder.has(word.category)) {
        categoryOrder.set(word.category, index);
      }
    });

    const grouped = YEAR1_WORDS.reduce((acc, word) => {
      if (!acc[word.category]) {
        acc[word.category] = [];
      }
      acc[word.category].push(word);
      return acc;
    }, {} as Record<string, typeof YEAR1_WORDS>);

    return Object.entries(grouped)
      .filter(([cat]) => !cat.toLowerCase().startsWith('adding'))
      .sort(([a], [b]) => {
        const orderA = categoryOrder.get(a) ?? Infinity;
        const orderB = categoryOrder.get(b) ?? Infinity;
        return orderA - orderB;
      });
  }, []);

  const getCategoryProgress = (categoryWords: typeof YEAR1_WORDS) => {
    const wordList = wordStatuses.filter(w => categoryWords.some(ww => ww.id === w.id));
    const total = wordList.length;
    const mastered = wordList.filter(word => word.status === 'mastered').length;
    return {
      total,
      mastered,
      percentage: Math.round((mastered / total) * 100)
    };
  };

  const selectNextWords = (words: typeof YEAR1_WORDS) => {
    // Use the precomputed statuses
    const wordList = wordStatuses.filter(w => words.some(ww => ww.id === w.id));
    const sortedWords = [...wordList].sort((a, b) => {
      const priority = {
        'in-progress': 0,
        'not-started': 1,
        'mastered': 2
      };
      return priority[a.status] - priority[b.status];
    });
    return sortedWords.slice(0, 3).map(w => w.text);
  };

  return (
    <div className="ks1-1-container">
      <h1 className="ks1-1-title">KS1 - 1 Spelling</h1>
      <KS11Challenge wordStatuses={wordStatuses} onSelectWords={onSelectWords} navigate={navigate} />

      <div className="ks1-1-overall-progress">
        <div className="ks1-1-overall-progress-bar">
          <div
            className="ks1-1-overall-progress-fill"
            style={{ width: `${overallPercent}%` }}
          />
        </div>
        <span className="ks1-1-overall-progress-text">
          {masteredWords}/{totalWords} mastered
        </span>
      </div>
      <div className="ks1-1-categories">
        {categories.map(([category, words]) => {
          const catProgress = getCategoryProgress(words);
          return (
            <div
              key={category}
              className="ks1-1-category"
              onClick={() => {
                const selectedWords = selectNextWords(words);
                onSelectWords(selectedWords, 'single');
                navigate('/');
              }}
              style={{ cursor: 'pointer' }}
            >
              <div className="ks1-1-category-header">
                <h2 className="ks1-1-category-title">{category}</h2>
                <div className="ks1-1-category-progress">
                  <div className="ks1-1-progress-bar">
                    <div 
                      className="ks1-1-progress-fill"
                      style={{ width: `${catProgress.percentage}%` }}
                    />
                  </div>
                  <span className="ks1-1-progress-text">
                    {catProgress.mastered}/{catProgress.total}
                  </span>
                </div>
              </div>
              <div className="ks1-1-words-list">
                {wordStatuses.filter(w => words.some(ww => ww.id === w.id)).map(word => {
                  const status = word.status;
                  return (
                    <span
                      key={word.id}
                      className={`ks1-1-word ${status}`}
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

export default KS1_1; 
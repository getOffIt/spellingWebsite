import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { YEAR1_WORDS } from '../data/words';
import { useProgress } from '../contexts/ProgressProvider';
import './KS1_1.css';

interface KS1_1Props {
  onSelectWords: (words: string[], type: 'single' | 'less_family') => void;
}

const getStatusIcon = (status: string) => {
  return <span className={`ks1-1-word-status ${status}`}>•</span>;
};

const KS1_1: React.FC<KS1_1Props> = ({ onSelectWords }) => {
  const { progress } = useProgress();
  const navigate = useNavigate();

  // Overall progress calculation
  const totalWords = YEAR1_WORDS.length;
  const masteredWords = YEAR1_WORDS.filter(word => progress[word.id]?.status === 'mastered').length;
  const overallPercent = Math.round((masteredWords / totalWords) * 100);

  const categories = useMemo(() => {
    const grouped = YEAR1_WORDS.reduce((acc, word) => {
      if (!acc[word.category]) {
        acc[word.category] = [];
      }
      acc[word.category].push(word);
      return acc;
    }, {} as Record<string, typeof YEAR1_WORDS>);
    return Object.entries(grouped)
      .filter(([cat]) => !cat.toLowerCase().startsWith('adding'))
      .sort(([a], [b]) => a.localeCompare(b));
  }, []);

  const getCategoryProgress = (categoryWords: typeof YEAR1_WORDS) => {
    const total = categoryWords.length;
    const mastered = categoryWords.filter(word => 
      progress[word.id]?.status === 'mastered'
    ).length;
    return {
      total,
      mastered,
      percentage: Math.round((mastered / total) * 100)
    };
  };

  return (
    <div className="ks1-1-container">
      <h1 className="ks1-1-title">KS1 - 1 Spelling</h1>
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
                const firstThree = words.slice(0, 3).map(w => w.text);
                onSelectWords(firstThree, 'single');
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
                {words.map(word => {
                  const status = progress[word.id]?.status || 'not-started';
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
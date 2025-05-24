import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { YEAR1_WORDS } from '../data/words';
import { useProgress } from '../contexts/ProgressProvider';
import './Year1.css';

interface Year1Props {
  onSelectWords: (words: string[], type: 'single' | 'less_family') => void;
}

const getStatusIcon = (status: string) => {
  return <span className={`word-status ${status}`}>•</span>;
};

const Year1: React.FC<Year1Props> = ({ onSelectWords }) => {
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
    <div className="year1-container">
      <h1 className="year1-title">Year 1 Spelling</h1>
      <div className="year1-overall-progress">
        <div className="year1-overall-progress-bar">
          <div
            className="year1-overall-progress-fill"
            style={{ width: `${overallPercent}%` }}
          />
        </div>
        <span className="year1-overall-progress-text">
          {masteredWords}/{totalWords} mastered
        </span>
      </div>
      <div className="year1-categories">
        {categories.map(([category, words]) => {
          const catProgress = getCategoryProgress(words);
          return (
            <div
              key={category}
              className="year1-category"
              onClick={() => {
                const firstThree = words.slice(0, 3).map(w => w.text);
                onSelectWords(firstThree, 'single');
                navigate('/');
              }}
              style={{ cursor: 'pointer' }}
            >
              <div className="year1-category-header">
                <h2 className="year1-category-title">{category}</h2>
                <div className="year1-category-progress">
                  <div className="year1-progress-bar">
                    <div 
                      className="year1-progress-fill"
                      style={{ width: `${catProgress.percentage}%` }}
                    />
                  </div>
                  <span className="year1-progress-text">
                    {catProgress.mastered}/{catProgress.total}
                  </span>
                </div>
              </div>
              <div className="year1-words-list">
                {words.map(word => {
                  const status = progress[word.id]?.status || 'not-started';
                  return (
                    <span
                      key={word.id}
                      className={`year1-word ${status}`}
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

export default Year1; 
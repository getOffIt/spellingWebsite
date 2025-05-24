import React, { useMemo } from 'react';
import { YEAR1_WORDS } from '../data/words';
import { useProgress } from '../contexts/ProgressProvider';
import './Year1.css';

const getStatusIcon = (status: string) => {
  return <span className={`word-status ${status}`}>•</span>;
};

const Year1: React.FC = () => {
  const { progress } = useProgress();

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
    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
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
            <div key={category} className="year1-category">
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
                    {catProgress.mastered}/{catProgress.total} mastered
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
                      // onClick for quiz modal can be added here
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
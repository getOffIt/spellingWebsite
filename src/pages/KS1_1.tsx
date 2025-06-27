import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { YEAR1_WORDS } from '../data/words';
import { useWord } from '../hooks/useWord';
import './KS1_1.css';

interface KS1_1Props {
  onSelectWords: (words: string[], type: 'single' | 'less_family') => void;
}

const getStatusIcon = (status: string) => {
  return <span className={`ks1-1-word-status ${status}`}>•</span>;
};

const KS1_1: React.FC<KS1_1Props> = ({ onSelectWords }) => {
  const navigate = useNavigate();

  // Overall progress calculation using useWord
  const totalWords = YEAR1_WORDS.length;
  const masteredWords = YEAR1_WORDS.filter(word => useWord(word.id).status === 'mastered').length;
  const overallPercent = Math.round((masteredWords / totalWords) * 100);

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
    const total = categoryWords.length;
    const mastered = categoryWords.filter(word => 
      useWord(word.id).status === 'mastered'
    ).length;
    return {
      total,
      mastered,
      percentage: Math.round((mastered / total) * 100)
    };
  };

  const selectNextWords = (words: typeof YEAR1_WORDS) => {
    // Sort words by priority: in-progress > not-started > mastered
    const sortedWords = [...words].sort((a, b) => {
      const statusA = useWord(a.id).status || 'not-started';
      const statusB = useWord(b.id).status || 'not-started';
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

  return (
    <div className="ks1-1-container">
      <h1 className="ks1-1-title">KS1 - 1 Spelling</h1>
      
      {/* Leo's £50 Challenge */}
      <div className="leo-challenge">
        <div className="leo-challenge-header">
          <h2 className="leo-challenge-title">🏆 Leo's £50 Challenge! 🏆</h2>
          <p className="leo-challenge-subtitle">Master all 83 words to earn £50!</p>
        </div>
        
        <div className="leo-challenge-progress">
          <div className="leo-challenge-progress-bar">
            <div
              className="leo-challenge-progress-fill"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
          <div className="leo-challenge-stats">
            <span className="leo-challenge-current">
              {masteredWords}/83 mastered
            </span>
            <span className="leo-challenge-remaining">
              {83 - masteredWords} words to go!
            </span>
          </div>
        </div>
        
        <div className="leo-challenge-motivation">
          {overallPercent >= 100 ? (
            <div className="leo-challenge-complete">
              🎉 CONGRATULATIONS LEO! 🎉<br/>
              You've earned your £50! 🤑
            </div>
          ) : overallPercent >= 80 ? (
            <div className="leo-challenge-close">
              🔥 So close! Just {83 - masteredWords} more words! 🔥
            </div>
          ) : overallPercent >= 60 ? (
            <div className="leo-challenge-good">
              💪 Great progress! Keep going Leo! 💪
            </div>
          ) : overallPercent >= 40 ? (
            <div className="leo-challenge-steady">
              🚀 Steady progress! You're doing amazing! 🚀
            </div>
          ) : overallPercent >= 20 ? (
            <div className="leo-challenge-starting">
              🌟 Off to a great start! Keep it up! 🌟
            </div>
          ) : (
            <div className="leo-challenge-beginning">
              🎯 Ready to start earning that £50? Let's go! 🎯
            </div>
          )}
        </div>
      </div>

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
                {words.map(word => {
                  const status = useWord(word.id).status || 'not-started';
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
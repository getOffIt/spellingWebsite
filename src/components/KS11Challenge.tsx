import React from 'react';

interface WordStatus {
  id: string;
  text: string;
  year: number;
  category: string;
  status: string;
}

interface KS11ChallengeProps {
  wordStatuses: WordStatus[];
  onSelectWords: (words: string[], type: 'single' | 'less_family') => void;
  navigate?: (path: string) => void;
}

const KS11Challenge: React.FC<KS11ChallengeProps> = ({ wordStatuses, onSelectWords, navigate }) => {
  const totalWords = wordStatuses.length;
  const masteredWords = wordStatuses.filter(word => word.status === 'mastered').length;
  const overallPercent = Math.round((masteredWords / totalWords) * 100);

  const selectInProgressWords = () => {
    const inProgressWords = wordStatuses.filter(word => word.status === 'in-progress');
    if (inProgressWords.length >= 3) {
      return inProgressWords.slice(0, 3).map(w => w.text);
    }
    const notStartedWords = wordStatuses.filter(word => word.status === 'not-started');
    const selectedWords = [...inProgressWords];
    const remainingNeeded = 3 - selectedWords.length;
    if (remainingNeeded > 0 && notStartedWords.length > 0) {
      selectedWords.push(...notStartedWords.slice(0, remainingNeeded));
    }
    return selectedWords.slice(0, 3).map(w => w.text);
  };

  const handleMotivationClick = () => {
    const selectedWords = selectInProgressWords();
    if (selectedWords.length > 0) {
      onSelectWords(selectedWords, 'single');
      if (navigate) navigate('/spelling-test');
    }
  };

  return (
    <div className="leo-challenge">
      <div className="leo-challenge-header">
        <h2 className="leo-challenge-title">🏆 KS1-1 Challenge! 🏆</h2>
        <p className="leo-challenge-subtitle">Master all {totalWords} words to earn £50!</p>
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
            {masteredWords}/{totalWords} mastered
          </span>
          <span className="leo-challenge-remaining">
            {totalWords - masteredWords} words to go!
          </span>
        </div>
      </div>
      <div className="leo-challenge-motivation">
        {overallPercent >= 100 ? (
          <div className="leo-challenge-complete">
            🎉 CONGRATULATIONS! 🎉<br/>
            You've earned your £50! 🤑
          </div>
        ) : overallPercent >= 80 ? (
          <div className="leo-challenge-close" onClick={handleMotivationClick} style={{ cursor: 'pointer' }}>
            🔥 So close! Just {totalWords - masteredWords} more words! 🔥<br/>
            <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>Click to practice!</span>
          </div>
        ) : overallPercent >= 60 ? (
          <div className="leo-challenge-good" onClick={handleMotivationClick} style={{ cursor: 'pointer' }}>
            💪 Great progress! Keep going! 💪<br/>
            <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>Click to practice!</span>
          </div>
        ) : overallPercent >= 40 ? (
          <div className="leo-challenge-steady" onClick={handleMotivationClick} style={{ cursor: 'pointer' }}>
            🚀 Steady progress! You're doing amazing! 🚀<br/>
            <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>Click to practice!</span>
          </div>
        ) : overallPercent >= 20 ? (
          <div className="leo-challenge-starting" onClick={handleMotivationClick} style={{ cursor: 'pointer' }}>
            🌟 Off to a great start! Keep it up! 🌟<br/>
            <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>Click to practice!</span>
          </div>
        ) : (
          <div className="leo-challenge-beginning" onClick={handleMotivationClick} style={{ cursor: 'pointer' }}>
            🎯 Ready to start earning that £50? Let's go! 🎯<br/>
            <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>Click to practice!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KS11Challenge; 
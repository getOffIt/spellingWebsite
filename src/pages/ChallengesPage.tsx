import React from 'react';
import { useNavigate } from 'react-router-dom';
import { YEAR1_WORDS } from '../data/words';
import { useWord } from '../hooks/useWord';
import './ChallengesPage.css';

const ChallengesPage: React.FC = () => {
  const navigate = useNavigate();

  // Calculate KS1-1 progress for Leo's challenge
  const ks1Words = YEAR1_WORDS.filter(word => !word.category.startsWith('adding'));
  const ks1WordsStatusList = ks1Words.map(word => useWord(word.id));
  const ks1MasteredWords = ks1WordsStatusList.filter(status => status.status === 'mastered').length;
  const ks1TotalWords = ks1Words.length;
  const ks1Progress = Math.round((ks1MasteredWords / ks1TotalWords) * 100);

  const challenges = [
    {
      id: 'leo-ks1-challenge',
      title: "Leo's £50 KS1-1 Challenge",
      description: "Master all KS1-1 spelling words to earn £50!",
      progress: ks1Progress,
      masteredWords: ks1MasteredWords,
      totalWords: ks1TotalWords,
      status: ks1Progress === 100 ? 'completed' : ks1Progress > 75 ? 'close' : ks1Progress > 50 ? 'good' : ks1Progress > 25 ? 'steady' : ks1Progress > 0 ? 'starting' : 'beginning',
      route: '/word-selection',
      bgColor: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)',
      borderColor: '#ffb347'
    }
    // More challenges will be added here
  ];

  const getStatusMessage = (status: string, progress: number) => {
    if (status === 'completed') return "🎉 Challenge Complete! Congratulations!";
    if (status === 'close') return `🔥 Almost there! ${100 - progress}% to go!`;
    if (status === 'good') return "💪 Great progress! Keep it up!";
    if (status === 'steady') return "📈 Steady progress! You're doing well!";
    if (status === 'starting') return "🚀 Good start! Keep practicing!";
    return "🌟 Ready to begin your challenge?";
  };

  const getStatusClass = (status: string) => {
    return `challenge-card-${status}`;
  };

  return (
    <div className="challenges-page-container">
      <h1 className="challenges-page-title">Spelling Challenges</h1>
      <p className="challenges-page-subtitle">Choose a challenge to begin your spelling journey!</p>
      
      <div className="challenges-grid">
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            className={`challenge-card ${getStatusClass(challenge.status)}`}
            style={{ 
              background: challenge.bgColor,
              borderColor: challenge.borderColor 
            }}
            onClick={() => navigate(challenge.route)}
          >
            <div className="challenge-card-header">
              <h2 className="challenge-card-title">{challenge.title}</h2>
              <p className="challenge-card-description">{challenge.description}</p>
            </div>

            <div className="challenge-card-progress">
              <div className="challenge-progress-bar">
                <div 
                  className="challenge-progress-fill"
                  style={{ width: `${challenge.progress}%` }}
                />
              </div>
              <div className="challenge-progress-stats">
                <span className="challenge-progress-percentage">{challenge.progress}%</span>
                <span className="challenge-progress-words">
                  {challenge.masteredWords}/{challenge.totalWords} words
                </span>
              </div>
            </div>

            <div className="challenge-card-motivation">
              <div className={`challenge-motivation-message challenge-motivation-${challenge.status}`}>
                {getStatusMessage(challenge.status, challenge.progress)}
              </div>
            </div>

            <div className="challenge-card-action">
              <button className="challenge-start-button">
                {challenge.progress > 0 ? 'Continue Challenge' : 'Start Challenge'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="challenges-coming-soon">
        <div className="coming-soon-card">
          <h3>More Challenges Coming Soon!</h3>
          <p>Stay tuned for additional spelling challenges and rewards.</p>
        </div>
      </div>
    </div>
  );
};

export default ChallengesPage;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WEEKLY_SPELLING_WORDS } from '../data/words';
import { OCTOBER_CHART_WORDS } from '../data/octoberSpellingChart';
import { useWord } from '../hooks/useWord';
import './ChallengesPage.css';

const ChallengesPage: React.FC = () => {
  const navigate = useNavigate();

  // Calculate this week's homework progress
  const weeklyStatusList = WEEKLY_SPELLING_WORDS.map(word => useWord(word.text));
  const weeklyMastered = weeklyStatusList.filter(status => status.status === 'mastered').length;
  const weeklyTotalWords = WEEKLY_SPELLING_WORDS.length;
  const weeklyProgress = Math.round((weeklyMastered / weeklyTotalWords) * 100);

  const octoberStatusList = OCTOBER_CHART_WORDS.map(word => useWord(word.text));
  const octoberMastered = octoberStatusList.filter(status => status.status === 'mastered').length;
  const octoberTotal = OCTOBER_CHART_WORDS.length;
  const octoberProgress = Math.round(octoberMastered / octoberTotal * 100);

  // Current focus challenge
  const currentChallenges = [
    {
      id: 'weekly-spellings',
      title: "📚 Words of the Week — Week 46 · 12–17 November",
      description: 'Your next five Year 3 words, ten Spelling Frame words and optional topic words.',
      progress: weeklyProgress,
      masteredWords: weeklyMastered,
      totalWords: weeklyTotalWords,
      status: weeklyProgress === 100 ? 'completed' : weeklyProgress > 75 ? 'close' : weeklyProgress > 50 ? 'good' : weeklyProgress > 25 ? 'steady' : weeklyProgress > 0 ? 'starting' : 'beginning',
      route: '/weekly-spellings',
      bgColor: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)',
      borderColor: '#0F766E'
    },
    {
      id: 'october-spelling-chart',
      title: '📋 Year 3 words',
      description: 'Your personal spelling list: all 57 words, rule tests, next 5 and individual word history.',
      progress: octoberProgress,
      masteredWords: octoberMastered,
      totalWords: octoberTotal,
      status: octoberProgress === 100 ? 'completed' : octoberProgress > 50 ? 'good' : 'starting',
      route: '/october-spelling-chart',
      bgColor: 'linear-gradient(135deg, #276346 0%, #408363 100%)',
      borderColor: '#276346'
    },
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

      {/* Current Focus Section */}
      <div className="challenges-section">
        <h2 className="challenges-section-title">🎯 Current Focus</h2>
        <div className="challenges-grid">
          {currentChallenges.map((challenge) => (
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
      </div>


    </div>
  );
};

export default ChallengesPage;

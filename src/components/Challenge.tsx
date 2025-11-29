import React from 'react';
import '../pages/WordSelection.css';

// Default pass threshold for full challenge tests
export const DEFAULT_PASS_THRESHOLD = 85;

interface WordStatus {
  id: string;
  text: string;
  year?: number;
  category: string;
  status: string;
}

export interface ChallengeConfig {
  title: string;
  description: string;
  rewardText?: string;
  themeClass?: string;
  motivationMessages: {
    complete?: string;
    close?: string; // >= 80%
    good?: string; // >= 60%
    steady?: string; // >= 40%
    starting?: string; // >= 20%
    beginning?: string; // < 20%
  };
  thresholds?: {
    close?: number; // default 80
    good?: number; // default 60
    steady?: number; // default 40
    starting?: number; // default 20
  };
  passThreshold?: number; // default 85 - percentage required to pass full test
}

interface ChallengeProps {
  wordStatuses: WordStatus[];
  config: ChallengeConfig;
  onSelectWords: (
    words: string[], 
    type: 'single' | 'less_family',
    testMode?: 'practice' | 'full_test',
    passThreshold?: number
  ) => void;
  navigate?: (path: string) => void;
}

const Challenge: React.FC<ChallengeProps> = ({ 
  wordStatuses, 
  config, 
  onSelectWords, 
  navigate 
}) => {
  const totalWords = wordStatuses.length;
  const masteredWords = wordStatuses.filter(word => word.status === 'mastered').length;
  const overallPercent = totalWords > 0 ? Math.round((masteredWords / totalWords) * 100) : 0;

  const thresholds = {
    close: config.thresholds?.close ?? 80,
    good: config.thresholds?.good ?? 60,
    steady: config.thresholds?.steady ?? 40,
    starting: config.thresholds?.starting ?? 20,
  };

  // Compute pass threshold once with default value
  const passThreshold = config.passThreshold ?? DEFAULT_PASS_THRESHOLD;

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
      onSelectWords(selectedWords, 'single', 'practice');
      if (navigate) navigate('/spelling-test');
    }
  };

  const handleFullTest = () => {
    const allWords = wordStatuses.map(w => w.text);
    if (allWords.length === 0) {
      return;
    }
    onSelectWords(allWords, 'single', 'full_test', passThreshold);
    if (navigate) navigate('/spelling-test');
  };

  const getMotivationMessage = () => {
    if (overallPercent >= 100 && config.motivationMessages.complete) {
      return {
        message: config.motivationMessages.complete,
        className: 'leo-challenge-complete',
        clickable: false,
      };
    }
    if (overallPercent >= thresholds.close && config.motivationMessages.close) {
      return {
        message: config.motivationMessages.close,
        className: 'leo-challenge-close',
        clickable: true,
      };
    }
    if (overallPercent >= thresholds.good && config.motivationMessages.good) {
      return {
        message: config.motivationMessages.good,
        className: 'leo-challenge-good',
        clickable: true,
      };
    }
    if (overallPercent >= thresholds.steady && config.motivationMessages.steady) {
      return {
        message: config.motivationMessages.steady,
        className: 'leo-challenge-steady',
        clickable: true,
      };
    }
    if (overallPercent >= thresholds.starting && config.motivationMessages.starting) {
      return {
        message: config.motivationMessages.starting,
        className: 'leo-challenge-starting',
        clickable: true,
      };
    }
    if (config.motivationMessages.beginning) {
      return {
        message: config.motivationMessages.beginning,
        className: 'leo-challenge-beginning',
        clickable: true,
      };
    }
    return null;
  };

  const replaceTemplateVariables = (message: string): string => {
    return message
      .replace(/{remaining}/g, String(totalWords - masteredWords))
      .replace(/{total}/g, String(totalWords))
      .replace(/{mastered}/g, String(masteredWords));
  };

  const motivation = getMotivationMessage();
  const challengeClass = config.themeClass 
    ? `leo-challenge ${config.themeClass}`
    : 'leo-challenge';

  return (
    <div className={challengeClass}>
      <div className="leo-challenge-header">
        <h2 className="leo-challenge-title">{config.title}</h2>
        <p className="leo-challenge-subtitle">
          {replaceTemplateVariables(config.description)}
          {config.rewardText && ` ${replaceTemplateVariables(config.rewardText)}`}
        </p>
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
      {motivation && (
        <div className="leo-challenge-motivation">
          {motivation.clickable ? (
            <div 
              className={motivation.className} 
              onClick={handleMotivationClick} 
              style={{ cursor: 'pointer' }}
            >
              {replaceTemplateVariables(motivation.message).split('\n').map((line, i, arr) => (
                <React.Fragment key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </React.Fragment>
              ))}
              <br/>
              <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>Click to practice!</span>
            </div>
          ) : (
            <div className={motivation.className}>
              {replaceTemplateVariables(motivation.message).split('\n').map((line, i, arr) => (
                <React.Fragment key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      )}
      {/* Add Full Test button */}
      <div className="challenge-full-test-action">
        <button 
          className="challenge-full-test-button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleFullTest();
          }}
        >
          📝 Take Full Challenge Test
        </button>
        <p className="challenge-full-test-description">
          Test all {totalWords} words. {passThreshold}% required to pass.
        </p>
      </div>
    </div>
  );
};

export default Challenge;


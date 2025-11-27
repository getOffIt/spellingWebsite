import React from 'react';
import { COMMON_WORDS } from '../data/words';
import BaseWordSelection from '../components/BaseWordSelection';
import { ChallengeConfig } from '../components/Challenge';
import './WordSelection.css';
import './CommonWordsSelection.css';

interface CommonWordsSelectionProps {
  onSelectWords: (words: string[], type: 'single' | 'less_family') => void;
}

const CommonWordsSelection: React.FC<CommonWordsSelectionProps> = ({ onSelectWords }) => {
  const challengeConfig: ChallengeConfig = {
    title: '🎃 Spooky Common Words Challenge 👻',
    description: 'Master all spooky common words!',
    rewardText: '',
    themeClass: 'spooky-challenge',
    motivationMessages: {
      complete: '🎉 BOO-TIFUL! You\'ve mastered all the spooky words! 🎉',
      close: `👻 Almost there! Just {remaining} more spooky words! 👻`,
      good: '🦇 Great progress! Keep haunting those words! 🦇',
      steady: '🧙 Steady progress! You\'re doing spooktacular! 🧙',
      starting: '🎃 Off to a great start! Keep it up! 🎃',
      beginning: '🕷️ Ready to start your spooky word adventure? Let\'s go! 🕷️',
    },
  };

  return (
    <BaseWordSelection
      words={COMMON_WORDS}
      title="🎃 Spooky Common Words Challenge 👻"
      themeClass="common-words-page"
      challengeConfig={challengeConfig}
      onSelectWords={onSelectWords}
    />
  );
};

export default CommonWordsSelection;

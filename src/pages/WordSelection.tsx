import React, { useCallback } from 'react';
import { YEAR1_WORDS, Word } from '../data/words';
import BaseWordSelection from '../components/BaseWordSelection';
import { ChallengeConfig } from '../components/Challenge';
import './WordSelection.css';

interface WordSelectionProps {
  onSelectWords: (words: string[], type: 'single' | 'less_family') => void;
}

const WordSelection: React.FC<WordSelectionProps> = ({ onSelectWords }) => {
  // Memoize the wordFilter function to prevent unnecessary recalculations
  const wordFilter = useCallback((word: Word) => {
    return !word.category.startsWith('adding');
  }, []);

  const challengeConfig: ChallengeConfig = {
    title: '🏆 KS1-1 Challenge! 🏆',
    description: 'Master all {total} words to earn £50!',
    rewardText: '',
    motivationMessages: {
      complete: '🎉 CONGRATULATIONS! 🎉\nYou\'ve earned your £50! 🤑',
      close: '🔥 So close! Just {remaining} more words! 🔥',
      good: '💪 Great progress! Keep going! 💪',
      steady: '🚀 Steady progress! You\'re doing amazing! 🚀',
      starting: '🌟 Off to a great start! Keep it up! 🌟',
      beginning: '🎯 Ready to start earning that £50? Let\'s go! 🎯',
    },
  };

  return (
    <BaseWordSelection
      words={YEAR1_WORDS}
      title="Word Selection"
      wordFilter={wordFilter}
      showOverallProgress={false}
      challengeConfig={challengeConfig}
      onSelectWords={onSelectWords}
    />
  );
};

export default WordSelection; 
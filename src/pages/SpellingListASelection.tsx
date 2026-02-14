import React from 'react';
import BaseWordSelection from '../components/BaseWordSelection';
import { wordSelectionConfigs } from '../config/wordSelectionConfigs';
import './WordSelection.css';

interface SpellingListASelectionProps {
  onSelectWords: (
    words: string[], 
    type: 'single' | 'less_family',
    testMode?: 'practice' | 'full_test',
    passThreshold?: number
  ) => void;
}

const SpellingListASelection: React.FC<SpellingListASelectionProps> = ({ onSelectWords }) => {
  const config = wordSelectionConfigs.spellingListA;

  return (
    <BaseWordSelection
      words={config.words}
      title={config.title}
      themeClass={config.themeClass}
      challengeConfig={config.challengeConfig}
      onSelectWords={onSelectWords}
    />
  );
};

export default SpellingListASelection;

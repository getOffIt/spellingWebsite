import React from 'react';
import BaseWordSelection from '../components/BaseWordSelection';
import { wordSelectionConfigs } from '../config/wordSelectionConfigs';
import './WordSelection.css';

interface SpellingListBSelectionProps {
  onSelectWords: (
    words: string[], 
    type: 'single' | 'less_family',
    testMode?: 'practice' | 'full_test',
    passThreshold?: number
  ) => void;
}

const SpellingListBSelection: React.FC<SpellingListBSelectionProps> = ({ onSelectWords }) => {
  const config = wordSelectionConfigs.spellingListB;

  return (
    <BaseWordSelection
      words={config.words}
      title={config.title}
      themeClass={config.themeClass}
      challengeConfig={config.challengeConfig}
      masteryThreshold={config.masteryThreshold}
      onSelectWords={onSelectWords}
    />
  );
};

export default SpellingListBSelection;

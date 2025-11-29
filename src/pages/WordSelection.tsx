import React from 'react';
import BaseWordSelection from '../components/BaseWordSelection';
import { wordSelectionConfigs } from '../config/wordSelectionConfigs';
import './WordSelection.css';

interface WordSelectionProps {
  onSelectWords: (
    words: string[], 
    type: 'single' | 'less_family',
    testMode?: 'practice' | 'full_test',
    passThreshold?: number
  ) => void;
}

const WordSelection: React.FC<WordSelectionProps> = ({ onSelectWords }) => {
  const config = wordSelectionConfigs.year1;

  return (
    <BaseWordSelection
      words={config.words}
      title={config.title}
      wordFilter={config.wordFilter}
      challengeConfig={config.challengeConfig}
      onSelectWords={onSelectWords}
    />
  );
};

export default WordSelection; 
import React from 'react';
import BaseWordSelection from '../components/BaseWordSelection';
import { wordSelectionConfigs } from '../config/wordSelectionConfigs';
import './WordSelection.css';
import './CommonWordsSelection.css';

interface CommonWordsSelectionProps {
  onSelectWords: (
    words: string[], 
    type: 'single' | 'less_family',
    testMode?: 'practice' | 'full_test'
  ) => void;
}

const CommonWordsSelection: React.FC<CommonWordsSelectionProps> = ({ onSelectWords }) => {
  const config = wordSelectionConfigs.common;

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

export default CommonWordsSelection;

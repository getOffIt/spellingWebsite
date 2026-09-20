import React from 'react';
import BaseWordSelection from '../components/BaseWordSelection';
import { wordSelectionConfigs } from '../config/wordSelectionConfigs';
import './WordSelection.css';

interface WeeklySpellingsSelectionProps {
  onSelectWords: (
    words: string[],
    type: 'single' | 'less_family',
    testMode?: 'practice' | 'full_test',
    passThreshold?: number
  ) => void;
}

const WeeklySpellingsSelection: React.FC<WeeklySpellingsSelectionProps> = ({ onSelectWords }) => {
  const config = wordSelectionConfigs.weeklySpellings;

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

export default WeeklySpellingsSelection;

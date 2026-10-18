import React from 'react';
import BaseWordSelection from '../components/BaseWordSelection';
import { wordSelectionConfigs } from '../config/wordSelectionConfigs';
import './WordSelection.css';

interface AnimalDietsSelectionProps {
  onSelectWords: (
    words: string[],
    type: 'single' | 'less_family',
    testMode?: 'practice' | 'full_test',
    passThreshold?: number
  ) => void;
}

const AnimalDietsSelection: React.FC<AnimalDietsSelectionProps> = ({ onSelectWords }) => {
  const config = wordSelectionConfigs.animalDiets;

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

export default AnimalDietsSelection;

import React from 'react';
import { COMMON_WORDS } from '../data/words';
import BaseWordSelection from '../components/BaseWordSelection';
import './WordSelection.css';
import './CommonWordsSelection.css';

interface CommonWordsSelectionProps {
  onSelectWords: (words: string[], type: 'single' | 'less_family') => void;
}

const CommonWordsSelection: React.FC<CommonWordsSelectionProps> = ({ onSelectWords }) => {
  return (
    <BaseWordSelection
      words={COMMON_WORDS}
      title="🎃 Spooky Common Words Challenge 👻"
      themeClass="common-words-page"
      showOverallProgress={true}
      onSelectWords={onSelectWords}
    />
  );
};

export default CommonWordsSelection;

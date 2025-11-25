import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { YEAR1_WORDS } from '../data/words';
import { useWord } from '../hooks/useWord';
import BaseWordSelection from '../components/BaseWordSelection';
import KS11Challenge from '../components/KS11Challenge';
import './WordSelection.css';

interface WordSelectionProps {
  onSelectWords: (words: string[], type: 'single' | 'less_family') => void;
}

const WordSelection: React.FC<WordSelectionProps> = ({ onSelectWords }) => {
  const navigate = useNavigate();

  // Get all KS1-1 words, excluding categories that start with "adding"
  const ks1Words = useMemo(() => 
    YEAR1_WORDS.filter(word => !word.category.startsWith('adding')),
    []
  );

  // Build status arrays for all words (call hooks at top level, not in useMemo or reduce)
  const ks1WordsStatusList = ks1Words.map(word => useWord(word.id));

  // Build wordStatuses array for KS1-1 Challenge
  const ks1ChallengeWordStatuses = ks1Words.map((word, i) => ({
    ...word,
    status: ks1WordsStatusList[i].status || 'not-started',
  }));

  const challengeComponent = (
    <KS11Challenge 
      wordStatuses={ks1ChallengeWordStatuses} 
      onSelectWords={onSelectWords} 
      navigate={navigate} 
    />
  );

  return (
    <BaseWordSelection
      words={YEAR1_WORDS}
      title="Word Selection"
      wordFilter={(word) => !word.category.startsWith('adding')}
      showOverallProgress={false}
      challengeComponent={challengeComponent}
      onSelectWords={onSelectWords}
    />
  );
};

export default WordSelection; 
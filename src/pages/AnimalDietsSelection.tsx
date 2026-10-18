import React from 'react';
import WordListChart, { type WordListChartConfig } from '../components/WordListChart';
import { ANIMAL_DIET_WORDS } from '../data/words';

const config: WordListChartConfig = {
  title: 'Animal Diets',
  eyebrow: 'Science spelling list',
  description: 'Carnivore, herbivore and omnivore — what do animals eat?',
  words: ANIMAL_DIET_WORDS,
  columns: [[{ id: 'animal-diets', title: 'Animal diets', color: 'gold', words: ANIMAL_DIET_WORDS.map(word => word.text) }]],
  returnTo: '/animal-diets',
  fullTestLabel: 'Test all words',
  nextCount: 3,
};

export default function AnimalDietsSelection({ onSelectWords }: Pick<React.ComponentProps<typeof WordListChart>, 'onSelectWords'>) {
  return <WordListChart config={config} onSelectWords={onSelectWords} />;
}

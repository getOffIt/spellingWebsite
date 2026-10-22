import type { ChartSection } from './spellingChart';
import type { Word } from './words';

// Transcribed from Antoine's photograph received 22 October 2026.
// Preserve the six columns, rule boundaries, word order and capitalisation.
// Pencil marks on the paper are not evidence of mastery in the app.
export const OCTOBER_CHART_COLUMNS: ChartSection[][] = [
  [
    { id: 'tion-sion', title: '-tion and -sion', color: 'red', words: ['question', 'mention', 'possession'] },
    { id: 'i-as-u', title: "'i' sound spelt as 'u'", color: 'green', words: ['busy', 'business'] },
    { id: 'suffix-ly', title: 'Suffix -ly, -ally', color: 'red', words: ['accidentally', 'actually', 'occasionally', 'probably'] },
  ],
  [
    { id: 'unstressed', title: 'Unstressed vowels', color: 'red', words: ['February', 'history', 'interest'] },
    { id: 'double', title: 'Double consonants', color: 'green', words: ['appear', 'different', 'difficult', 'disappear', 'possess', 'possible', 'pressure'] },
  ],
  [
    { id: 's-as-c', title: "'s' sound spelt as 'c'", color: 'gold', words: ['bicycle', 'centre', 'century', 'certain', 'circle', 'medicine', 'sentence'] },
    { id: 'ear', title: "'ear' letter string", color: 'red', words: ['early', 'earth', 'heard', 'heart', 'learn'] },
  ],
  [
    { id: 'cross-curricular', title: 'Cross-curricular words', color: 'purple', words: ['group', 'increase', 'length', 'quarter', 'remember', 'straight', 'strength', 'various'] },
    { id: 'split-digraph', title: 'Split digraph — long vowel sounds', color: 'blue', words: ['describe', 'extreme', 'surprise'] },
  ],
  [
    { id: 'other', title: 'Other words', color: 'green', words: ['actual', 'famous', 'important', 'perhaps', 'potatoes', 'strange', 'therefore', 'though', 'woman', 'women'] },
  ],
  [
    { id: 'eigh', title: "'eigh'", color: 'blue', words: ['eight', 'eighth', 'weight', 'height'] },
    { id: 'augh', title: "'or' sound spelt 'augh'", color: 'red', words: ['caught'] },
  ],
];

// Identity is always the exact word text: existing history stays shared across lists.
export const OCTOBER_CHART_WORDS: Word[] = OCTOBER_CHART_COLUMNS.flatMap(column =>
  column.flatMap(section => section.words.map(text => ({ text, year: 2 as const, category: section.title })))
);

import { SPELLING_LIST_B } from './words';

export interface ChartSection {
  id: string;
  title: string;
  color: 'red' | 'blue' | 'gold' | 'green' | 'purple';
  lessonCategory: string;
  words: string[];
}

// The six columns and individual rule boundaries on Leo's September chart.
// Word IDs stay unchanged so all existing practice history is shared.
export const SPELLING_CHART_COLUMNS: ChartSection[][] = [
  [
    { id: 'oor', title: "'-oor' letter string", color: 'red', lessonCategory: 'oor-letter-string', words: ['door', 'floor', 'poor'] },
    { id: 'ea', title: "'ay' sound spelt 'ea'", color: 'blue', lessonCategory: 'oor-letter-string', words: ['break', 'great', 'steak'] },
    { id: 'ould', title: "'ould' letter string", color: 'gold', lessonCategory: 'oor-letter-string', words: ['could', 'should', 'would'] },
  ],
  [
    { id: 'unstressed', title: 'Unstressed vowels', color: 'red', lessonCategory: 'unstressed-vowels', words: ['beautiful', 'because', 'every', 'everybody', 'people'] },
    { id: 'split', title: 'Split digraph — long vowel sounds', color: 'blue', lessonCategory: 'unstressed-vowels', words: ['clothes', 'improve', 'move', 'prove'] },
    { id: 'busy', title: "'i' sound spelt as 'u'", color: 'green', lessonCategory: 'unstressed-vowels', words: ['busy'] },
  ],
  [
    { id: 'sh', title: "'sh' sound spelt as 's'", color: 'gold', lessonCategory: 'sh-as-s', words: ['sugar', 'sure'] },
    { id: 'old', title: "'old' letter string", color: 'red', lessonCategory: 'sh-as-s', words: ['cold', 'gold', 'hold', 'old', 'told'] },
    { id: 'oa', title: "'oa' sound spelt as 'o'", color: 'purple', lessonCategory: 'sh-as-s', words: ['both', 'most', 'only'] },
  ],
  [
    { id: 'ar', title: "'ar' sound spelt as 'a'", color: 'green', lessonCategory: 'ar-as-a', words: ['after', 'bath', 'class', 'fast', 'father', 'grass', 'last', 'pass', 'past', 'path', 'plant'] },
  ],
  [
    { id: 'igh', title: "'igh' sound spelt 'i'", color: 'red', lessonCategory: 'igh-as-i', words: ['behind', 'child', 'climb', 'find', 'kind', 'mind', 'wild'] },
    { id: 'e', title: "'e' sound spelt as 'a'", color: 'blue', lessonCategory: 'igh-as-i', words: ['any', 'many'] },
    { id: 'wh', title: "'wh' letter string", color: 'green', lessonCategory: 'igh-as-i', words: ['who', 'whole'] },
  ],
  [
    { id: 'other', title: 'Other words', color: 'green', lessonCategory: 'other-b', words: ['again', 'children', 'Christmas', 'even', 'eye', 'half', 'hour', 'money', 'Mr', 'Mrs', 'parents', 'pretty', 'water'] },
  ],
];

export const SPELLING_CHART_WORDS = SPELLING_CHART_COLUMNS.flatMap(column =>
  column.flatMap(section => section.words.map(text => {
    const word = SPELLING_LIST_B.find(word => word.text === text);
    if (!word) throw new Error(`Chart word missing from List B: ${text}`);
    return word;
  }))
);

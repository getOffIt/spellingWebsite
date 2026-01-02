export type Word = {
  id: string          // unique (e.g. "ff-off")
  text: string        // plain word
  year: 1 | 2
  category: string    // phonics grouping ("ff", "ll", ...)
}

export const TEST_WORDS: Word[] = [
  { id: 'off', text: 'off', year: 1, category: 'ff' },
  { id: 'stuff', text: 'stuff', year: 1, category: 'ff' },
  { id: 'cliff', text: 'cliff', year: 1, category: 'ff' },
  { id: 'staff', text: 'staff', year: 1, category: 'ff' },
  { id: 'cuff', text: 'cuff', year: 1, category: 'ff' }
];

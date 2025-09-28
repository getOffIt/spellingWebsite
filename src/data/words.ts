export type Word = {
  id: string          // unique (e.g. "ff-off")
  text: string        // plain word
  year: 1 | 2
  category: string    // phonics grouping ("ff", "ll", ...)
}

export const YEAR1_WORDS: Word[] = [
  // Level 1: Simple double consonants
  // ff
  { id: 'off', text: 'off', year: 1, category: 'ff' },
  { id: 'stuff', text: 'stuff', year: 1, category: 'ff' },
  { id: 'cliff', text: 'cliff', year: 1, category: 'ff' },
  { id: 'staff', text: 'staff', year: 1, category: 'ff' },
  { id: 'cuff', text: 'cuff', year: 1, category: 'ff' },
  { id: 'fluff', text: 'fluff', year: 1, category: 'ff' },

  // ll
  { id: 'well', text: 'well', year: 1, category: 'll' },
  { id: 'fell', text: 'fell', year: 1, category: 'll' },
  { id: 'hill', text: 'hill', year: 1, category: 'll' },
  { id: 'bell', text: 'bell', year: 1, category: 'll' },
  { id: 'smell', text: 'smell', year: 1, category: 'll' },
  { id: 'till', text: 'till', year: 1, category: 'll' },
  { id: 'doll', text: 'doll', year: 1, category: 'll' },

  // ss
  { id: 'miss', text: 'miss', year: 1, category: 'ss' },
  { id: 'hiss', text: 'hiss', year: 1, category: 'ss' },
  { id: 'pass', text: 'pass', year: 1, category: 'ss' },
  { id: 'fuss', text: 'fuss', year: 1, category: 'ss' },
  { id: 'kiss', text: 'kiss', year: 1, category: 'ss' },
  { id: 'press', text: 'press', year: 1, category: 'ss' },

  // zz
  { id: 'buzz', text: 'buzz', year: 1, category: 'zz' },
  { id: 'fuzz', text: 'fuzz', year: 1, category: 'zz' },
  { id: 'frizz', text: 'frizz', year: 1, category: 'zz' },
  { id: 'whizz', text: 'whizz', year: 1, category: 'zz' },
  { id: 'jazz', text: 'jazz', year: 1, category: 'zz' },

  // Level 2: Common consonant digraphs
  // ck
  { id: 'back', text: 'back', year: 1, category: 'ck' },
  { id: 'thick', text: 'thick', year: 1, category: 'ck' },
  { id: 'lick', text: 'lick', year: 1, category: 'ck' },
  { id: 'snack', text: 'snack', year: 1, category: 'ck' },
  { id: 'pick', text: 'pick', year: 1, category: 'ck' },
  { id: 'stick', text: 'stick', year: 1, category: 'ck' },

  // nk
  { id: 'bank', text: 'bank', year: 1, category: 'nk' },
  { id: 'think', text: 'think', year: 1, category: 'nk' },
  { id: 'honk', text: 'honk', year: 1, category: 'nk' },
  { id: 'sunk', text: 'sunk', year: 1, category: 'nk' },
  { id: 'link-nk', text: 'link', year: 1, category: 'nk' },
  { id: 'pink', text: 'pink', year: 1, category: 'nk' },

  // tch
  { id: 'catch', text: 'catch', year: 1, category: 'tch' },
  { id: 'fetch', text: 'fetch', year: 1, category: 'tch' },
  { id: 'kitchen', text: 'kitchen', year: 1, category: 'tch' },
  { id: 'notch', text: 'notch', year: 1, category: 'tch' },
  { id: 'match', text: 'match', year: 1, category: 'tch' },

  // Level 3: Common single letter patterns and simple suffixes
  // v
  { id: 'have', text: 'have', year: 1, category: 'v' },
  { id: 'live', text: 'live', year: 1, category: 'v' },
  { id: 'give', text: 'give', year: 1, category: 'v' },
  { id: 'love', text: 'love', year: 1, category: 'v' },
  { id: 'glove', text: 'glove', year: 1, category: 'v' },
  { id: 'above', text: 'above', year: 1, category: 'v' },

  // -s
  { id: 'cats', text: 'cats', year: 1, category: '-s' },
  { id: 'dogs', text: 'dogs', year: 1, category: '-s' },
  { id: 'spends', text: 'spends', year: 1, category: '-s' },
  { id: 'rocks', text: 'rocks', year: 1, category: '-s' },
  { id: 'thanks', text: 'thanks', year: 1, category: '-s' },
  { id: 'hands', text: 'hands', year: 1, category: '-s' },

  // -es
  { id: 'catches', text: 'catches', year: 1, category: '-es' },
  { id: 'batches', text: 'batches', year: 1, category: '-es' },
  { id: 'hatches', text: 'hatches', year: 1, category: '-es' },
  { id: 'patches', text: 'patches', year: 1, category: '-es' },
  { id: 'boxes', text: 'boxes', year: 1, category: '-es' },
  { id: 'foxes', text: 'foxes', year: 1, category: '-es' },

  // Level 4: Vowel digraphs
  // ai
  { id: 'rain', text: 'rain', year: 1, category: 'ai' },
  { id: 'wait', text: 'wait', year: 1, category: 'ai' },
  { id: 'train', text: 'train', year: 1, category: 'ai' },
  { id: 'paid', text: 'paid', year: 1, category: 'ai' },
  { id: 'afraid', text: 'afraid', year: 1, category: 'ai' },
  { id: 'aid', text: 'aid', year: 1, category: 'ai' },

  // oi
  { id: 'oil', text: 'oil', year: 1, category: 'oi' },
  { id: 'join', text: 'join', year: 1, category: 'oi' },
  { id: 'coin', text: 'coin', year: 1, category: 'oi' },
  { id: 'point', text: 'point', year: 1, category: 'oi' },
  { id: 'way', text: 'way', year: 1, category: 'oi' },
  { id: 'soil', text: 'soil', year: 1, category: 'oi' },
  { id: 'boil', text: 'boil', year: 1, category: 'oi' },

  // ay
  { id: 'day', text: 'day', year: 1, category: 'ay' },
  { id: 'play', text: 'play', year: 1, category: 'ay' },
  { id: 'say', text: 'say', year: 1, category: 'ay' },
  { id: 'stay', text: 'stay', year: 1, category: 'ay' },
  { id: 'clay', text: 'clay', year: 1, category: 'ay' },

  // Level 5: Two syllable words (most complex)
  { id: 'pocket', text: 'pocket', year: 1, category: 'two syllable words' },
  { id: 'rabbit', text: 'rabbit', year: 1, category: 'two syllable words' },
  { id: 'carrot', text: 'carrot', year: 1, category: 'two syllable words' },
  { id: 'thunder', text: 'thunder', year: 1, category: 'two syllable words' },
  { id: 'sunset', text: 'sunset', year: 1, category: 'two syllable words' },
];

export const TRICKY_WORDS: Word[] = [
  // Common words 1 (first 6)
  { id: 'i', text: 'I', year: 1, category: 'common words 1' },
  { id: 'the', text: 'the', year: 1, category: 'common words 1' },
  { id: 'no', text: 'no', year: 1, category: 'common words 1' },
  { id: 'put', text: 'put', year: 1, category: 'common words 1' },
  { id: 'of', text: 'of', year: 1, category: 'common words 1' },
  { id: 'is', text: 'is', year: 1, category: 'common words 1' },
  
  // Common words 2 (next 6)
  { id: 'to', text: 'to', year: 1, category: 'common words 2' },
  { id: 'go', text: 'go', year: 1, category: 'common words 2' },
  { id: 'into', text: 'into', year: 1, category: 'common words 2' },
  { id: 'pull', text: 'pull', year: 1, category: 'common words 2' },
  { id: 'as', text: 'as', year: 1, category: 'common words 2' },
  { id: 'his', text: 'his', year: 1, category: 'common words 2' },

  
  // Common words 3 (6 words)
  { id: 'he', text: 'he', year: 1, category: 'common words 3' },
  { id: 'she', text: 'she', year: 1, category: 'common words 3' },
  { id: 'buses', text: 'buses', year: 1, category: 'common words 3' },
  { id: 'we', text: 'we', year: 1, category: 'common words 3' },
  { id: 'me', text: 'me', year: 1, category: 'common words 3' },
  { id: 'be', text: 'be', year: 1, category: 'common words 3' },
  
  // Common words 4 (6 words)
  { id: 'push', text: 'push', year: 1, category: 'common words 4' },
  { id: 'was', text: 'was', year: 1, category: 'common words 4' },
  { id: 'her', text: 'her', year: 1, category: 'common words 4' },
  { id: 'my', text: 'my', year: 1, category: 'common words 4' },
  { id: 'you', text: 'you', year: 1, category: 'common words 4' },
  { id: 'they', text: 'they', year: 1, category: 'common words 4' },
  
  // Common words 5 (6 words)
  { id: 'all', text: 'all', year: 1, category: 'common words 5' },
  { id: 'are', text: 'are', year: 1, category: 'common words 5' },
  { id: 'ball', text: 'ball', year: 1, category: 'common words 5' },
  { id: 'tall', text: 'tall', year: 1, category: 'common words 5' },
  { id: 'when', text: 'when', year: 1, category: 'common words 5' },
  { id: 'what', text: 'what', year: 1, category: 'common words 5' },
  
  // Common words 6 (6 words)
  { id: 'said', text: 'said', year: 1, category: 'common words 6' },
  { id: 'so', text: 'so', year: 1, category: 'common words 6' },
  { id: 'have', text: 'have', year: 1, category: 'common words 6' },
  { id: 'were', text: 'were', year: 1, category: 'common words 6' },
  { id: 'out', text: 'out', year: 1, category: 'common words 6' },
  { id: 'like', text: 'like', year: 1, category: 'common words 6' },
  
  // Common words 7 (6 words)
  { id: 'some', text: 'some', year: 1, category: 'common words 7' },
  { id: 'come', text: 'come', year: 1, category: 'common words 7' },
  { id: 'there', text: 'there', year: 1, category: 'common words 7' },
  { id: 'little', text: 'little', year: 1, category: 'common words 7' },
  { id: 'one', text: 'one', year: 1, category: 'common words 7' },
  { id: 'do', text: 'do', year: 1, category: 'common words 7' },
  
  // Common words 8 (4 words)
  { id: 'children', text: 'children', year: 1, category: 'common words 8' },
  { id: 'oh', text: 'oh', year: 1, category: 'common words 8' },
  { id: 'their', text: 'their', year: 1, category: 'common words 8' },
  { id: 'a', text: 'a', year: 1, category: 'common words 8' },

  // Common words 9 (5 words)
  { id: 'people', text: 'people', year: 1, category: 'common words 9' },
  { id: 'mr', text: 'Mr', year: 1, category: 'common words 9' },
  { id: 'mrs', text: 'Mrs', year: 1, category: 'common words 9' },
  { id: 'your', text: 'your', year: 1, category: 'common words 9' },
  { id: 'ask', text: 'ask', year: 1, category: 'common words 9' },

  // Common words 10 (2 words)
  { id: 'should', text: 'should', year: 1, category: 'common words 10' },
  { id: 'would', text: 'would', year: 1, category: 'common words 10' },

  // Common words 11 (4 words)
  { id: 'could', text: 'could', year: 1, category: 'common words 11' },
  { id: 'asked', text: 'asked', year: 1, category: 'common words 11' },
  { id: 'house', text: 'house', year: 1, category: 'common words 11' },
  { id: 'mouse', text: 'mouse', year: 1, category: 'common words 11' },

  // Common words 12 (3 words)
  { id: 'water', text: 'water', year: 1, category: 'common words 12' },
  { id: 'want', text: 'want', year: 1, category: 'common words 12' },
  { id: 'very', text: 'very', year: 1, category: 'common words 12' },
];

export const YEAR2_WORDS: Word[] = [
  // -less words
  { id: 'careless', text: 'careless', year: 2, category: '-less' },
  { id: 'harmless', text: 'harmless', year: 2, category: '-less' },
  { id: 'helpless', text: 'helpless', year: 2, category: '-less' },
  { id: 'homeless', text: 'homeless', year: 2, category: '-less' },
  { id: 'joyless', text: 'joyless', year: 2, category: '-less' },
  { id: 'mindless', text: 'mindless', year: 2, category: '-less' },
  { id: 'painless', text: 'painless', year: 2, category: '-less' },
  { id: 'speechless', text: 'speechless', year: 2, category: '-less' },
  { id: 'thankless', text: 'thankless', year: 2, category: '-less' },
  { id: 'useless', text: 'useless', year: 2, category: '-less' },

  // -ies words
  { id: 'berries', text: 'berries', year: 2, category: '-ies' },
  { id: 'cries', text: 'cries', year: 2, category: '-ies' },
  { id: 'flies', text: 'flies', year: 2, category: '-ies' },
  { id: 'ladies', text: 'ladies', year: 2, category: '-ies' },
  { id: 'pennies', text: 'pennies', year: 2, category: '-ies' },
  { id: 'tries', text: 'tries', year: 2, category: '-ies' },

  // This week's spelling words
  { id: 'dirtier', text: 'dirtier', year: 2, category: 'this-week' },
  { id: 'dirtiest', text: 'dirtiest', year: 2, category: 'this-week' },
  { id: 'drier', text: 'drier', year: 2, category: 'this-week' },
  { id: 'driest', text: 'driest', year: 2, category: 'this-week' },
  { id: 'funnier', text: 'funnier', year: 2, category: 'this-week' },
  { id: 'funniest', text: 'funniest', year: 2, category: 'this-week' },
  { id: 'happier', text: 'happier', year: 2, category: 'this-week' },
  { id: 'happiest', text: 'happiest', year: 2, category: 'this-week' },

  // Other Year 2 words
  { id: 'door', text: 'door', year: 2, category: 'misc' },
  { id: 'floor', text: 'floor', year: 2, category: 'misc' },
  { id: 'poor', text: 'poor', year: 2, category: 'misc' },
  { id: 'because', text: 'because', year: 2, category: 'misc' },
  { id: 'find', text: 'find', year: 2, category: 'misc' },
  { id: 'kind', text: 'kind', year: 2, category: 'misc' },
  { id: 'mind', text: 'mind', year: 2, category: 'misc' },
  { id: 'behind', text: 'behind', year: 2, category: 'misc' },
  { id: 'child', text: 'child', year: 2, category: 'misc' },
  { id: 'children', text: 'children', year: 2, category: 'misc' },
  { id: 'wild', text: 'wild', year: 2, category: 'misc' },
  { id: 'climb', text: 'climb', year: 2, category: 'misc' },
  { id: 'most', text: 'most', year: 2, category: 'misc' },
  { id: 'only', text: 'only', year: 2, category: 'misc' },
  { id: 'both', text: 'both', year: 2, category: 'misc' },
  { id: 'old', text: 'old', year: 2, category: 'misc' },
  { id: 'cold', text: 'cold', year: 2, category: 'misc' },
  { id: 'gold', text: 'gold', year: 2, category: 'misc' },
  { id: 'hold', text: 'hold', year: 2, category: 'misc' },
  { id: 'told', text: 'told', year: 2, category: 'misc' },
  { id: 'every', text: 'every', year: 2, category: 'misc' },
  { id: 'everybody', text: 'everybody', year: 2, category: 'misc' },
  { id: 'even', text: 'even', year: 2, category: 'misc' },
  { id: 'great', text: 'great', year: 2, category: 'misc' },
  { id: 'break', text: 'break', year: 2, category: 'misc' },
  { id: 'steak', text: 'steak', year: 2, category: 'misc' },
  { id: 'pretty', text: 'pretty', year: 2, category: 'misc' },
  { id: 'beautiful', text: 'beautiful', year: 2, category: 'misc' },
  { id: 'after', text: 'after', year: 2, category: 'misc' },
  { id: 'fast', text: 'fast', year: 2, category: 'misc' },
  { id: 'last', text: 'last', year: 2, category: 'misc' },
  { id: 'past', text: 'past', year: 2, category: 'misc' },
  { id: 'father', text: 'father', year: 2, category: 'misc' },
  { id: 'class', text: 'class', year: 2, category: 'misc' },
  { id: 'grass', text: 'grass', year: 2, category: 'misc' },
  { id: 'pass', text: 'pass', year: 2, category: 'misc' },
  { id: 'plant', text: 'plant', year: 2, category: 'misc' },
  { id: 'path', text: 'path', year: 2, category: 'misc' },
  { id: 'bath', text: 'bath', year: 2, category: 'misc' },
  { id: 'hour', text: 'hour', year: 2, category: 'misc' },
  { id: 'move', text: 'move', year: 2, category: 'misc' },
  { id: 'prove', text: 'prove', year: 2, category: 'misc' },
  { id: 'improve', text: 'improve', year: 2, category: 'misc' },
  { id: 'sure', text: 'sure', year: 2, category: 'misc' },
  { id: 'sugar', text: 'sugar', year: 2, category: 'misc' },
  { id: 'eye', text: 'eye', year: 2, category: 'misc' },
  { id: 'could', text: 'could', year: 2, category: 'misc' },
  { id: 'should', text: 'should', year: 2, category: 'misc' },
  { id: 'would', text: 'would', year: 2, category: 'misc' },
  { id: 'who', text: 'who', year: 2, category: 'misc' },
  { id: 'whole', text: 'whole', year: 2, category: 'misc' },
  { id: 'any', text: 'any', year: 2, category: 'misc' },
  { id: 'many', text: 'many', year: 2, category: 'misc' },
  { id: 'clothes', text: 'clothes', year: 2, category: 'misc' },
  { id: 'busy', text: 'busy', year: 2, category: 'misc' },
  { id: 'people', text: 'people', year: 2, category: 'misc' },
  { id: 'water', text: 'water', year: 2, category: 'misc' },
  { id: 'again', text: 'again', year: 2, category: 'misc' },
  { id: 'half', text: 'half', year: 2, category: 'misc' },
  { id: 'money', text: 'money', year: 2, category: 'misc' },
  { id: 'mr', text: 'Mr', year: 2, category: 'misc' },
  { id: 'mrs', text: 'Mrs', year: 2, category: 'misc' },
  { id: 'parents', text: 'parents', year: 2, category: 'misc' },
  { id: 'christmas', text: 'Christmas', year: 2, category: 'misc' }
];

export const ALL_WORDS = [...YEAR1_WORDS, ...TRICKY_WORDS, ...YEAR2_WORDS] 
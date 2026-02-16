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

export const COMMON_WORDS: Word[] = [
  // Common words 1 (first 5)
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

  // Common words 9 (3 words)
  { id: 'people', text: 'people', year: 1, category: 'common words 9' },
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
  { id: 'parents', text: 'parents', year: 2, category: 'misc' },
  { id: 'christmas', text: 'Christmas', year: 2, category: 'misc' }
];

export const SPELLING_LIST_A: Word[] = [
  // tion-and-sion
  { id: 'occasion', text: 'occasion', year: 2, category: 'tion-and-sion' },
  { id: 'question', text: 'question', year: 2, category: 'tion-and-sion' },
  { id: 'mention', text: 'mention', year: 2, category: 'tion-and-sion' },
  { id: 'position', text: 'position', year: 2, category: 'tion-and-sion' },
  { id: 'eight', text: 'eight', year: 2, category: 'tion-and-sion' },
  { id: 'eighth', text: 'eighth', year: 2, category: 'tion-and-sion' },
  { id: 'weight', text: 'weight', year: 2, category: 'tion-and-sion' },
  { id: 'height', text: 'height', year: 2, category: 'tion-and-sion' },
  { id: 'though', text: 'though', year: 2, category: 'tion-and-sion' },
  { id: 'although', text: 'although', year: 2, category: 'tion-and-sion' },
  { id: 'through', text: 'through', year: 2, category: 'tion-and-sion' },

  // double-consonants
  { id: 'February', text: 'February', year: 2, category: 'double-consonants' },
  { id: 'interest', text: 'interest', year: 2, category: 'double-consonants' },
  { id: 'address', text: 'address', year: 2, category: 'double-consonants' },
  { id: 'appear', text: 'appear', year: 2, category: 'double-consonants' },
  { id: 'difficult', text: 'difficult', year: 2, category: 'double-consonants' },
  { id: 'grammar', text: 'grammar', year: 2, category: 'double-consonants' },
  { id: 'opposite', text: 'opposite', year: 2, category: 'double-consonants' },
  { id: 'occasionally', text: 'occasionally', year: 2, category: 'double-consonants' },
  { id: 'describe', text: 'describe', year: 2, category: 'double-consonants' },
  { id: 'extreme', text: 'extreme', year: 2, category: 'double-consonants' },
  { id: 'guide', text: 'guide', year: 2, category: 'double-consonants' },
  { id: 'surprise', text: 'surprise', year: 2, category: 'double-consonants' },

  // s-as-c
  { id: 'circle', text: 'circle', year: 2, category: 's-as-c' },
  { id: 'exercise', text: 'exercise', year: 2, category: 's-as-c' },
  { id: 'medicine', text: 'medicine', year: 2, category: 's-as-c' },
  { id: 'sentence', text: 'sentence', year: 2, category: 's-as-c' },
  { id: 'busy', text: 'busy', year: 2, category: 's-as-c' },
  { id: 'early', text: 'early', year: 2, category: 's-as-c' },
  { id: 'earth', text: 'earth', year: 2, category: 's-as-c' },
  { id: 'heard', text: 'heard', year: 2, category: 's-as-c' },
  { id: 'heart', text: 'heart', year: 2, category: 's-as-c' },
  { id: 'learn', text: 'learn', year: 2, category: 's-as-c' },
  { id: 'caught', text: 'caught', year: 2, category: 's-as-c' },

  // cross-curricular
  { id: 'answer', text: 'answer', year: 2, category: 'cross-curricular' },
  { id: 'calendar', text: 'calendar', year: 2, category: 'cross-curricular' },
  { id: 'experiment', text: 'experiment', year: 2, category: 'cross-curricular' },
  { id: 'fruit', text: 'fruit', year: 2, category: 'cross-curricular' },
  { id: 'group', text: 'group', year: 2, category: 'cross-curricular' },
  { id: 'increase', text: 'increase', year: 2, category: 'cross-curricular' },
  { id: 'length', text: 'length', year: 2, category: 'cross-curricular' },
  { id: 'material', text: 'material', year: 2, category: 'cross-curricular' },
  { id: 'minute', text: 'minute', year: 2, category: 'cross-curricular' },
  { id: 'quarter', text: 'quarter', year: 2, category: 'cross-curricular' },
  { id: 'remember', text: 'remember', year: 2, category: 'cross-curricular' },
  { id: 'straight', text: 'straight', year: 2, category: 'cross-curricular' },

  // homophones
  { id: 'often', text: 'often', year: 2, category: 'homophones' },
  { id: 'potatoes', text: 'potatoes', year: 2, category: 'homophones' },
  { id: 'promise', text: 'promise', year: 2, category: 'homophones' },
  { id: 'special', text: 'special', year: 2, category: 'homophones' },
  { id: 'woman', text: 'woman', year: 2, category: 'homophones' },
  { id: 'women', text: 'women', year: 2, category: 'homophones' },
  { id: 'there', text: 'there', year: 2, category: 'homophones' },
  { id: 'their', text: 'their', year: 2, category: 'homophones' },
  { id: "they're", text: "they're", year: 2, category: 'homophones' },
  { id: 'ball', text: 'ball', year: 2, category: 'homophones' },
  { id: 'bawl', text: 'bawl', year: 2, category: 'homophones' },
  { id: 'berry', text: 'berry', year: 2, category: 'homophones' },
  { id: 'bury', text: 'bury', year: 2, category: 'homophones' },

  // other-a
  { id: 'brake', text: 'brake', year: 2, category: 'other-a' },
  { id: 'break', text: 'break', year: 2, category: 'other-a' },
  { id: 'fair', text: 'fair', year: 2, category: 'other-a' },
  { id: 'fare', text: 'fare', year: 2, category: 'other-a' },
  { id: 'great', text: 'great', year: 2, category: 'other-a' },
  { id: 'grate', text: 'grate', year: 2, category: 'other-a' },
  { id: 'groan', text: 'groan', year: 2, category: 'other-a' },
  { id: 'grown', text: 'grown', year: 2, category: 'other-a' },
  { id: 'here', text: 'here', year: 2, category: 'other-a' },
  { id: 'hear', text: 'hear', year: 2, category: 'other-a' },
  { id: 'heal', text: 'heal', year: 2, category: 'other-a' },
  { id: 'heel', text: 'heel', year: 2, category: 'other-a' },
  { id: "he'll", text: "he'll", year: 2, category: 'other-a' },
  { id: 'knot', text: 'knot', year: 2, category: 'other-a' },
  { id: 'not', text: 'not', year: 2, category: 'other-a' },
];

export const SPELLING_LIST_B: Word[] = [
  // oor-letter-string
  { id: 'door', text: 'door', year: 2, category: 'oor-letter-string' },
  { id: 'floor', text: 'floor', year: 2, category: 'oor-letter-string' },
  { id: 'poor', text: 'poor', year: 2, category: 'oor-letter-string' },
  { id: 'break', text: 'break', year: 2, category: 'oor-letter-string' },
  { id: 'great', text: 'great', year: 2, category: 'oor-letter-string' },
  { id: 'steak', text: 'steak', year: 2, category: 'oor-letter-string' },
  { id: 'could', text: 'could', year: 2, category: 'oor-letter-string' },
  { id: 'should', text: 'should', year: 2, category: 'oor-letter-string' },
  { id: 'would', text: 'would', year: 2, category: 'oor-letter-string' },

  // unstressed-vowels
  { id: 'beautiful', text: 'beautiful', year: 2, category: 'unstressed-vowels' },
  { id: 'because', text: 'because', year: 2, category: 'unstressed-vowels' },
  { id: 'every', text: 'every', year: 2, category: 'unstressed-vowels' },
  { id: 'everybody', text: 'everybody', year: 2, category: 'unstressed-vowels' },
  { id: 'people', text: 'people', year: 2, category: 'unstressed-vowels' },
  { id: 'clothes', text: 'clothes', year: 2, category: 'unstressed-vowels' },
  { id: 'improve', text: 'improve', year: 2, category: 'unstressed-vowels' },
  { id: 'move', text: 'move', year: 2, category: 'unstressed-vowels' },
  { id: 'prove', text: 'prove', year: 2, category: 'unstressed-vowels' },
  { id: 'busy', text: 'busy', year: 2, category: 'unstressed-vowels' },

  // sh-as-s
  { id: 'sugar', text: 'sugar', year: 2, category: 'sh-as-s' },
  { id: 'sure', text: 'sure', year: 2, category: 'sh-as-s' },
  { id: 'cold', text: 'cold', year: 2, category: 'sh-as-s' },
  { id: 'gold', text: 'gold', year: 2, category: 'sh-as-s' },
  { id: 'hold', text: 'hold', year: 2, category: 'sh-as-s' },
  { id: 'old', text: 'old', year: 2, category: 'sh-as-s' },
  { id: 'told', text: 'told', year: 2, category: 'sh-as-s' },
  { id: 'both', text: 'both', year: 2, category: 'sh-as-s' },
  { id: 'most', text: 'most', year: 2, category: 'sh-as-s' },
  { id: 'only', text: 'only', year: 2, category: 'sh-as-s' },

  // ar-as-a
  { id: 'after', text: 'after', year: 2, category: 'ar-as-a' },
  { id: 'bath', text: 'bath', year: 2, category: 'ar-as-a' },
  { id: 'class', text: 'class', year: 2, category: 'ar-as-a' },
  { id: 'fast', text: 'fast', year: 2, category: 'ar-as-a' },
  { id: 'father', text: 'father', year: 2, category: 'ar-as-a' },
  { id: 'grass', text: 'grass', year: 2, category: 'ar-as-a' },
  { id: 'last', text: 'last', year: 2, category: 'ar-as-a' },
  { id: 'pass', text: 'pass', year: 2, category: 'ar-as-a' },
  { id: 'past', text: 'past', year: 2, category: 'ar-as-a' },
  { id: 'path', text: 'path', year: 2, category: 'ar-as-a' },
  { id: 'plant', text: 'plant', year: 2, category: 'ar-as-a' },

  // igh-as-i
  { id: 'behind', text: 'behind', year: 2, category: 'igh-as-i' },
  { id: 'child', text: 'child', year: 2, category: 'igh-as-i' },
  { id: 'climb', text: 'climb', year: 2, category: 'igh-as-i' },
  { id: 'find', text: 'find', year: 2, category: 'igh-as-i' },
  { id: 'kind', text: 'kind', year: 2, category: 'igh-as-i' },
  { id: 'mind', text: 'mind', year: 2, category: 'igh-as-i' },
  { id: 'wild', text: 'wild', year: 2, category: 'igh-as-i' },
  { id: 'any', text: 'any', year: 2, category: 'igh-as-i' },
  { id: 'many', text: 'many', year: 2, category: 'igh-as-i' },
  { id: 'who', text: 'who', year: 2, category: 'igh-as-i' },
  { id: 'whole', text: 'whole', year: 2, category: 'igh-as-i' },

  // other-b
  { id: 'again', text: 'again', year: 2, category: 'other-b' },
  { id: 'children', text: 'children', year: 2, category: 'other-b' },
  { id: 'Christmas', text: 'Christmas', year: 2, category: 'other-b' },
  { id: 'even', text: 'even', year: 2, category: 'other-b' },
  { id: 'eye', text: 'eye', year: 2, category: 'other-b' },
  { id: 'half', text: 'half', year: 2, category: 'other-b' },
  { id: 'hour', text: 'hour', year: 2, category: 'other-b' },
  { id: 'money', text: 'money', year: 2, category: 'other-b' },
  { id: 'Mr', text: 'Mr', year: 2, category: 'other-b' },
  { id: 'Mrs', text: 'Mrs', year: 2, category: 'other-b' },
  { id: 'parents', text: 'parents', year: 2, category: 'other-b' },
  { id: 'pretty', text: 'pretty', year: 2, category: 'other-b' },
  { id: 'water', text: 'water', year: 2, category: 'other-b' },
];

export const ALL_WORDS = [...YEAR1_WORDS, ...COMMON_WORDS, ...YEAR2_WORDS, ...SPELLING_LIST_A, ...SPELLING_LIST_B] 
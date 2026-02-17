export type Word = {
  text: string        // plain word (used as unique key)
  year: 1 | 2
  category: string    // phonics grouping ("ff", "ll", ...)
}

export const YEAR1_WORDS: Word[] = [
  // Level 1: Simple double consonants
  // ff
  { text: 'off', year: 1, category: 'ff' },
  { text: 'stuff', year: 1, category: 'ff' },
  { text: 'cliff', year: 1, category: 'ff' },
  { text: 'staff', year: 1, category: 'ff' },
  { text: 'cuff', year: 1, category: 'ff' },
  { text: 'fluff', year: 1, category: 'ff' },

  // ll
  { text: 'well', year: 1, category: 'll' },
  { text: 'fell', year: 1, category: 'll' },
  { text: 'hill', year: 1, category: 'll' },
  { text: 'bell', year: 1, category: 'll' },
  { text: 'smell', year: 1, category: 'll' },
  { text: 'till', year: 1, category: 'll' },
  { text: 'doll', year: 1, category: 'll' },

  // ss
  { text: 'miss', year: 1, category: 'ss' },
  { text: 'hiss', year: 1, category: 'ss' },
  { text: 'pass', year: 1, category: 'ss' },
  { text: 'fuss', year: 1, category: 'ss' },
  { text: 'kiss', year: 1, category: 'ss' },
  { text: 'press', year: 1, category: 'ss' },

  // zz
  { text: 'buzz', year: 1, category: 'zz' },
  { text: 'fuzz', year: 1, category: 'zz' },
  { text: 'frizz', year: 1, category: 'zz' },
  { text: 'whizz', year: 1, category: 'zz' },
  { text: 'jazz', year: 1, category: 'zz' },

  // Level 2: Common consonant digraphs
  // ck
  { text: 'back', year: 1, category: 'ck' },
  { text: 'thick', year: 1, category: 'ck' },
  { text: 'lick', year: 1, category: 'ck' },
  { text: 'snack', year: 1, category: 'ck' },
  { text: 'pick', year: 1, category: 'ck' },
  { text: 'stick', year: 1, category: 'ck' },

  // nk
  { text: 'bank', year: 1, category: 'nk' },
  { text: 'think', year: 1, category: 'nk' },
  { text: 'honk', year: 1, category: 'nk' },
  { text: 'sunk', year: 1, category: 'nk' },
  { text: 'link', year: 1, category: 'nk' },
  { text: 'pink', year: 1, category: 'nk' },

  // tch
  { text: 'catch', year: 1, category: 'tch' },
  { text: 'fetch', year: 1, category: 'tch' },
  { text: 'kitchen', year: 1, category: 'tch' },
  { text: 'notch', year: 1, category: 'tch' },
  { text: 'match', year: 1, category: 'tch' },

  // Level 3: Common single letter patterns and simple suffixes
  // v
  { text: 'have', year: 1, category: 'v' },
  { text: 'live', year: 1, category: 'v' },
  { text: 'give', year: 1, category: 'v' },
  { text: 'love', year: 1, category: 'v' },
  { text: 'glove', year: 1, category: 'v' },
  { text: 'above', year: 1, category: 'v' },

  // -s
  { text: 'cats', year: 1, category: '-s' },
  { text: 'dogs', year: 1, category: '-s' },
  { text: 'spends', year: 1, category: '-s' },
  { text: 'rocks', year: 1, category: '-s' },
  { text: 'thanks', year: 1, category: '-s' },
  { text: 'hands', year: 1, category: '-s' },

  // -es
  { text: 'catches', year: 1, category: '-es' },
  { text: 'batches', year: 1, category: '-es' },
  { text: 'hatches', year: 1, category: '-es' },
  { text: 'patches', year: 1, category: '-es' },
  { text: 'boxes', year: 1, category: '-es' },
  { text: 'foxes', year: 1, category: '-es' },

  // Level 4: Vowel digraphs
  // ai
  { text: 'rain', year: 1, category: 'ai' },
  { text: 'wait', year: 1, category: 'ai' },
  { text: 'train', year: 1, category: 'ai' },
  { text: 'paid', year: 1, category: 'ai' },
  { text: 'afraid', year: 1, category: 'ai' },
  { text: 'aid', year: 1, category: 'ai' },

  // oi
  { text: 'oil', year: 1, category: 'oi' },
  { text: 'join', year: 1, category: 'oi' },
  { text: 'coin', year: 1, category: 'oi' },
  { text: 'point', year: 1, category: 'oi' },
  { text: 'way', year: 1, category: 'oi' },
  { text: 'soil', year: 1, category: 'oi' },
  { text: 'boil', year: 1, category: 'oi' },

  // ay
  { text: 'day', year: 1, category: 'ay' },
  { text: 'play', year: 1, category: 'ay' },
  { text: 'say', year: 1, category: 'ay' },
  { text: 'stay', year: 1, category: 'ay' },
  { text: 'clay', year: 1, category: 'ay' },

  // Level 5: Two syllable words (most complex)
  { text: 'pocket', year: 1, category: 'two syllable words' },
  { text: 'rabbit', year: 1, category: 'two syllable words' },
  { text: 'carrot', year: 1, category: 'two syllable words' },
  { text: 'thunder', year: 1, category: 'two syllable words' },
  { text: 'sunset', year: 1, category: 'two syllable words' },
];

export const COMMON_WORDS: Word[] = [
  // Common words 1 (first 5)
  { text: 'the', year: 1, category: 'common words 1' },
  { text: 'no', year: 1, category: 'common words 1' },
  { text: 'put', year: 1, category: 'common words 1' },
  { text: 'of', year: 1, category: 'common words 1' },
  { text: 'is', year: 1, category: 'common words 1' },
  
  // Common words 2 (next 6)
  { text: 'to', year: 1, category: 'common words 2' },
  { text: 'go', year: 1, category: 'common words 2' },
  { text: 'into', year: 1, category: 'common words 2' },
  { text: 'pull', year: 1, category: 'common words 2' },
  { text: 'as', year: 1, category: 'common words 2' },
  { text: 'his', year: 1, category: 'common words 2' },

  
  // Common words 3 (6 words)
  { text: 'he', year: 1, category: 'common words 3' },
  { text: 'she', year: 1, category: 'common words 3' },
  { text: 'buses', year: 1, category: 'common words 3' },
  { text: 'we', year: 1, category: 'common words 3' },
  { text: 'me', year: 1, category: 'common words 3' },
  { text: 'be', year: 1, category: 'common words 3' },
  
  // Common words 4 (6 words)
  { text: 'push', year: 1, category: 'common words 4' },
  { text: 'was', year: 1, category: 'common words 4' },
  { text: 'her', year: 1, category: 'common words 4' },
  { text: 'my', year: 1, category: 'common words 4' },
  { text: 'you', year: 1, category: 'common words 4' },
  { text: 'they', year: 1, category: 'common words 4' },
  
  // Common words 5 (6 words)
  { text: 'all', year: 1, category: 'common words 5' },
  { text: 'are', year: 1, category: 'common words 5' },
  { text: 'ball', year: 1, category: 'common words 5' },
  { text: 'tall', year: 1, category: 'common words 5' },
  { text: 'when', year: 1, category: 'common words 5' },
  { text: 'what', year: 1, category: 'common words 5' },
  
  // Common words 6 (6 words)
  { text: 'said', year: 1, category: 'common words 6' },
  { text: 'so', year: 1, category: 'common words 6' },
  { text: 'have', year: 1, category: 'common words 6' },
  { text: 'were', year: 1, category: 'common words 6' },
  { text: 'out', year: 1, category: 'common words 6' },
  { text: 'like', year: 1, category: 'common words 6' },
  
  // Common words 7 (6 words)
  { text: 'some', year: 1, category: 'common words 7' },
  { text: 'come', year: 1, category: 'common words 7' },
  { text: 'there', year: 1, category: 'common words 7' },
  { text: 'little', year: 1, category: 'common words 7' },
  { text: 'one', year: 1, category: 'common words 7' },
  { text: 'do', year: 1, category: 'common words 7' },
  
  // Common words 8 (4 words)
  { text: 'children', year: 1, category: 'common words 8' },
  { text: 'oh', year: 1, category: 'common words 8' },
  { text: 'their', year: 1, category: 'common words 8' },
  { text: 'a', year: 1, category: 'common words 8' },

  // Common words 9 (3 words)
  { text: 'people', year: 1, category: 'common words 9' },
  { text: 'your', year: 1, category: 'common words 9' },
  { text: 'ask', year: 1, category: 'common words 9' },

  // Common words 10 (2 words)
  { text: 'should', year: 1, category: 'common words 10' },
  { text: 'would', year: 1, category: 'common words 10' },

  // Common words 11 (4 words)
  { text: 'could', year: 1, category: 'common words 11' },
  { text: 'asked', year: 1, category: 'common words 11' },
  { text: 'house', year: 1, category: 'common words 11' },
  { text: 'mouse', year: 1, category: 'common words 11' },

  // Common words 12 (3 words)
  { text: 'water', year: 1, category: 'common words 12' },
  { text: 'want', year: 1, category: 'common words 12' },
  { text: 'very', year: 1, category: 'common words 12' },
];

export const YEAR2_WORDS: Word[] = [
  // -less words
  { text: 'careless', year: 2, category: '-less' },
  { text: 'harmless', year: 2, category: '-less' },
  { text: 'helpless', year: 2, category: '-less' },
  { text: 'homeless', year: 2, category: '-less' },
  { text: 'joyless', year: 2, category: '-less' },
  { text: 'mindless', year: 2, category: '-less' },
  { text: 'painless', year: 2, category: '-less' },
  { text: 'speechless', year: 2, category: '-less' },
  { text: 'thankless', year: 2, category: '-less' },
  { text: 'useless', year: 2, category: '-less' },

  // -ies words
  { text: 'berries', year: 2, category: '-ies' },
  { text: 'cries', year: 2, category: '-ies' },
  { text: 'flies', year: 2, category: '-ies' },
  { text: 'ladies', year: 2, category: '-ies' },
  { text: 'pennies', year: 2, category: '-ies' },
  { text: 'tries', year: 2, category: '-ies' },

  // This week's spelling words
  { text: 'dirtier', year: 2, category: 'this-week' },
  { text: 'dirtiest', year: 2, category: 'this-week' },
  { text: 'drier', year: 2, category: 'this-week' },
  { text: 'driest', year: 2, category: 'this-week' },
  { text: 'funnier', year: 2, category: 'this-week' },
  { text: 'funniest', year: 2, category: 'this-week' },
  { text: 'happier', year: 2, category: 'this-week' },
  { text: 'happiest', year: 2, category: 'this-week' },

  // Other Year 2 words
  { text: 'door', year: 2, category: 'misc' },
  { text: 'floor', year: 2, category: 'misc' },
  { text: 'poor', year: 2, category: 'misc' },
  { text: 'because', year: 2, category: 'misc' },
  { text: 'find', year: 2, category: 'misc' },
  { text: 'kind', year: 2, category: 'misc' },
  { text: 'mind', year: 2, category: 'misc' },
  { text: 'behind', year: 2, category: 'misc' },
  { text: 'child', year: 2, category: 'misc' },
  { text: 'children', year: 2, category: 'misc' },
  { text: 'wild', year: 2, category: 'misc' },
  { text: 'climb', year: 2, category: 'misc' },
  { text: 'most', year: 2, category: 'misc' },
  { text: 'only', year: 2, category: 'misc' },
  { text: 'both', year: 2, category: 'misc' },
  { text: 'old', year: 2, category: 'misc' },
  { text: 'cold', year: 2, category: 'misc' },
  { text: 'gold', year: 2, category: 'misc' },
  { text: 'hold', year: 2, category: 'misc' },
  { text: 'told', year: 2, category: 'misc' },
  { text: 'every', year: 2, category: 'misc' },
  { text: 'everybody', year: 2, category: 'misc' },
  { text: 'even', year: 2, category: 'misc' },
  { text: 'great', year: 2, category: 'misc' },
  { text: 'break', year: 2, category: 'misc' },
  { text: 'steak', year: 2, category: 'misc' },
  { text: 'pretty', year: 2, category: 'misc' },
  { text: 'beautiful', year: 2, category: 'misc' },
  { text: 'after', year: 2, category: 'misc' },
  { text: 'fast', year: 2, category: 'misc' },
  { text: 'last', year: 2, category: 'misc' },
  { text: 'past', year: 2, category: 'misc' },
  { text: 'father', year: 2, category: 'misc' },
  { text: 'class', year: 2, category: 'misc' },
  { text: 'grass', year: 2, category: 'misc' },
  { text: 'pass', year: 2, category: 'misc' },
  { text: 'plant', year: 2, category: 'misc' },
  { text: 'path', year: 2, category: 'misc' },
  { text: 'bath', year: 2, category: 'misc' },
  { text: 'hour', year: 2, category: 'misc' },
  { text: 'move', year: 2, category: 'misc' },
  { text: 'prove', year: 2, category: 'misc' },
  { text: 'improve', year: 2, category: 'misc' },
  { text: 'sure', year: 2, category: 'misc' },
  { text: 'sugar', year: 2, category: 'misc' },
  { text: 'eye', year: 2, category: 'misc' },
  { text: 'could', year: 2, category: 'misc' },
  { text: 'should', year: 2, category: 'misc' },
  { text: 'would', year: 2, category: 'misc' },
  { text: 'who', year: 2, category: 'misc' },
  { text: 'whole', year: 2, category: 'misc' },
  { text: 'any', year: 2, category: 'misc' },
  { text: 'many', year: 2, category: 'misc' },
  { text: 'clothes', year: 2, category: 'misc' },
  { text: 'busy', year: 2, category: 'misc' },
  { text: 'people', year: 2, category: 'misc' },
  { text: 'water', year: 2, category: 'misc' },
  { text: 'again', year: 2, category: 'misc' },
  { text: 'half', year: 2, category: 'misc' },
  { text: 'money', year: 2, category: 'misc' },
  { text: 'parents', year: 2, category: 'misc' },
  { text: 'Christmas', year: 2, category: 'misc' }
];

export const SPELLING_LIST_A: Word[] = [
  // tion-and-sion
  { text: 'occasion', year: 2, category: 'tion-and-sion' },
  { text: 'question', year: 2, category: 'tion-and-sion' },
  { text: 'mention', year: 2, category: 'tion-and-sion' },
  { text: 'position', year: 2, category: 'tion-and-sion' },
  { text: 'eight', year: 2, category: 'tion-and-sion' },
  { text: 'eighth', year: 2, category: 'tion-and-sion' },
  { text: 'weight', year: 2, category: 'tion-and-sion' },
  { text: 'height', year: 2, category: 'tion-and-sion' },
  { text: 'though', year: 2, category: 'tion-and-sion' },
  { text: 'although', year: 2, category: 'tion-and-sion' },
  { text: 'through', year: 2, category: 'tion-and-sion' },

  // double-consonants
  { text: 'February', year: 2, category: 'double-consonants' },
  { text: 'interest', year: 2, category: 'double-consonants' },
  { text: 'address', year: 2, category: 'double-consonants' },
  { text: 'appear', year: 2, category: 'double-consonants' },
  { text: 'difficult', year: 2, category: 'double-consonants' },
  { text: 'grammar', year: 2, category: 'double-consonants' },
  { text: 'opposite', year: 2, category: 'double-consonants' },
  { text: 'occasionally', year: 2, category: 'double-consonants' },
  { text: 'describe', year: 2, category: 'double-consonants' },
  { text: 'extreme', year: 2, category: 'double-consonants' },
  { text: 'guide', year: 2, category: 'double-consonants' },
  { text: 'surprise', year: 2, category: 'double-consonants' },

  // s-as-c
  { text: 'circle', year: 2, category: 's-as-c' },
  { text: 'exercise', year: 2, category: 's-as-c' },
  { text: 'medicine', year: 2, category: 's-as-c' },
  { text: 'sentence', year: 2, category: 's-as-c' },
  { text: 'busy', year: 2, category: 's-as-c' },
  { text: 'early', year: 2, category: 's-as-c' },
  { text: 'earth', year: 2, category: 's-as-c' },
  { text: 'heard', year: 2, category: 's-as-c' },
  { text: 'heart', year: 2, category: 's-as-c' },
  { text: 'learn', year: 2, category: 's-as-c' },
  { text: 'caught', year: 2, category: 's-as-c' },

  // cross-curricular
  { text: 'answer', year: 2, category: 'cross-curricular' },
  { text: 'calendar', year: 2, category: 'cross-curricular' },
  { text: 'experiment', year: 2, category: 'cross-curricular' },
  { text: 'fruit', year: 2, category: 'cross-curricular' },
  { text: 'group', year: 2, category: 'cross-curricular' },
  { text: 'increase', year: 2, category: 'cross-curricular' },
  { text: 'length', year: 2, category: 'cross-curricular' },
  { text: 'material', year: 2, category: 'cross-curricular' },
  { text: 'minute', year: 2, category: 'cross-curricular' },
  { text: 'quarter', year: 2, category: 'cross-curricular' },
  { text: 'remember', year: 2, category: 'cross-curricular' },
  { text: 'straight', year: 2, category: 'cross-curricular' },

  // homophones
  { text: 'often', year: 2, category: 'homophones' },
  { text: 'potatoes', year: 2, category: 'homophones' },
  { text: 'promise', year: 2, category: 'homophones' },
  { text: 'special', year: 2, category: 'homophones' },
  { text: 'woman', year: 2, category: 'homophones' },
  { text: 'women', year: 2, category: 'homophones' },
  { text: 'there', year: 2, category: 'homophones' },
  { text: 'their', year: 2, category: 'homophones' },
  { text: "they're", year: 2, category: 'homophones' },
  { text: 'ball', year: 2, category: 'homophones' },
  { text: 'bawl', year: 2, category: 'homophones' },
  { text: 'berry', year: 2, category: 'homophones' },
  { text: 'bury', year: 2, category: 'homophones' },

  // other-a
  { text: 'brake', year: 2, category: 'other-a' },
  { text: 'break', year: 2, category: 'other-a' },
  { text: 'fair', year: 2, category: 'other-a' },
  { text: 'fare', year: 2, category: 'other-a' },
  { text: 'great', year: 2, category: 'other-a' },
  { text: 'grate', year: 2, category: 'other-a' },
  { text: 'groan', year: 2, category: 'other-a' },
  { text: 'grown', year: 2, category: 'other-a' },
  { text: 'here', year: 2, category: 'other-a' },
  { text: 'hear', year: 2, category: 'other-a' },
  { text: 'heal', year: 2, category: 'other-a' },
  { text: 'heel', year: 2, category: 'other-a' },
  { text: "he'll", year: 2, category: 'other-a' },
  { text: 'knot', year: 2, category: 'other-a' },
  { text: 'not', year: 2, category: 'other-a' },
];

export const SPELLING_LIST_B: Word[] = [
  // oor-letter-string
  { text: 'door', year: 2, category: 'oor-letter-string' },
  { text: 'floor', year: 2, category: 'oor-letter-string' },
  { text: 'poor', year: 2, category: 'oor-letter-string' },
  { text: 'break', year: 2, category: 'oor-letter-string' },
  { text: 'great', year: 2, category: 'oor-letter-string' },
  { text: 'steak', year: 2, category: 'oor-letter-string' },
  { text: 'could', year: 2, category: 'oor-letter-string' },
  { text: 'should', year: 2, category: 'oor-letter-string' },
  { text: 'would', year: 2, category: 'oor-letter-string' },

  // unstressed-vowels
  { text: 'beautiful', year: 2, category: 'unstressed-vowels' },
  { text: 'because', year: 2, category: 'unstressed-vowels' },
  { text: 'every', year: 2, category: 'unstressed-vowels' },
  { text: 'everybody', year: 2, category: 'unstressed-vowels' },
  { text: 'people', year: 2, category: 'unstressed-vowels' },
  { text: 'clothes', year: 2, category: 'unstressed-vowels' },
  { text: 'improve', year: 2, category: 'unstressed-vowels' },
  { text: 'move', year: 2, category: 'unstressed-vowels' },
  { text: 'prove', year: 2, category: 'unstressed-vowels' },
  { text: 'busy', year: 2, category: 'unstressed-vowels' },

  // sh-as-s
  { text: 'sugar', year: 2, category: 'sh-as-s' },
  { text: 'sure', year: 2, category: 'sh-as-s' },
  { text: 'cold', year: 2, category: 'sh-as-s' },
  { text: 'gold', year: 2, category: 'sh-as-s' },
  { text: 'hold', year: 2, category: 'sh-as-s' },
  { text: 'old', year: 2, category: 'sh-as-s' },
  { text: 'told', year: 2, category: 'sh-as-s' },
  { text: 'both', year: 2, category: 'sh-as-s' },
  { text: 'most', year: 2, category: 'sh-as-s' },
  { text: 'only', year: 2, category: 'sh-as-s' },

  // ar-as-a
  { text: 'after', year: 2, category: 'ar-as-a' },
  { text: 'bath', year: 2, category: 'ar-as-a' },
  { text: 'class', year: 2, category: 'ar-as-a' },
  { text: 'fast', year: 2, category: 'ar-as-a' },
  { text: 'father', year: 2, category: 'ar-as-a' },
  { text: 'grass', year: 2, category: 'ar-as-a' },
  { text: 'last', year: 2, category: 'ar-as-a' },
  { text: 'pass', year: 2, category: 'ar-as-a' },
  { text: 'past', year: 2, category: 'ar-as-a' },
  { text: 'path', year: 2, category: 'ar-as-a' },
  { text: 'plant', year: 2, category: 'ar-as-a' },

  // igh-as-i
  { text: 'behind', year: 2, category: 'igh-as-i' },
  { text: 'child', year: 2, category: 'igh-as-i' },
  { text: 'climb', year: 2, category: 'igh-as-i' },
  { text: 'find', year: 2, category: 'igh-as-i' },
  { text: 'kind', year: 2, category: 'igh-as-i' },
  { text: 'mind', year: 2, category: 'igh-as-i' },
  { text: 'wild', year: 2, category: 'igh-as-i' },
  { text: 'any', year: 2, category: 'igh-as-i' },
  { text: 'many', year: 2, category: 'igh-as-i' },
  { text: 'who', year: 2, category: 'igh-as-i' },
  { text: 'whole', year: 2, category: 'igh-as-i' },

  // other-b
  { text: 'again', year: 2, category: 'other-b' },
  { text: 'children', year: 2, category: 'other-b' },
  { text: 'Christmas', year: 2, category: 'other-b' },
  { text: 'even', year: 2, category: 'other-b' },
  { text: 'eye', year: 2, category: 'other-b' },
  { text: 'half', year: 2, category: 'other-b' },
  { text: 'hour', year: 2, category: 'other-b' },
  { text: 'money', year: 2, category: 'other-b' },
  { text: 'Mr', year: 2, category: 'other-b' },
  { text: 'Mrs', year: 2, category: 'other-b' },
  { text: 'parents', year: 2, category: 'other-b' },
  { text: 'pretty', year: 2, category: 'other-b' },
  { text: 'water', year: 2, category: 'other-b' },
];

export const ALL_WORDS = [...YEAR1_WORDS, ...COMMON_WORDS, ...YEAR2_WORDS, ...SPELLING_LIST_A, ...SPELLING_LIST_B] 
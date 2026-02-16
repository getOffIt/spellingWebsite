export interface CategoryLesson {
  category: string;
  title: string;
  explanation: string;
  examples: string[];
  audioFile?: string; // Path to audio file (optional, can be added later)
}

/**
 * Audio lessons explaining spelling rules for List B categories
 * These help Leo understand the patterns when he gets words wrong
 */
export const LIST_B_LESSONS: Record<string, CategoryLesson> = {
  'oor-letter-string': {
    category: 'oor-letter-string',
    title: 'Tricky Letter Strings',
    explanation: `This group has three sneaky spelling patterns. Let's learn them one at a time!

Pattern one: the letters O-O-R together. Say DOOR. FLOOR. POOR. They all end with that same "or" sound, but it's spelled O-O-R. Two o's then an r!

Pattern two: the letters E-A normally say "ee" — like in "read" or "eat." But in BREAK, GREAT, and STEAK, the E-A says "ay" instead! These are rule-breakers, so you just have to remember them.

Pattern three: COULD, SHOULD, and WOULD. These words all have a silent L hiding in the middle — O-U-L-D. You don't hear the L, but it's always there! A good trick: they all rhyme and they're all spelled the same way at the end.`,
    examples: ['door', 'floor', 'poor', 'break', 'great', 'steak', 'could', 'should', 'would'],
    audioFile: '/audio/lessons/oor-letter-string.mp3'
  },

  'unstressed-vowels': {
    category: 'unstressed-vowels',
    title: 'Tricky Vowel Sounds',
    explanation: `These words are tricky because the vowels don't make the sounds you'd expect!

BEAUTIFUL — you might want to write "butiful," but it starts B-E-A-U-T-I-F-U-L. Try saying it slowly: "be-au-ti-ful" to hear every part.

BECAUSE — it's not "becoz!" The middle is A-U-S-E.

PEOPLE — sounds like "pee-pul" but it's spelled P-E-O-P-L-E with an O hiding in there.

CLOTHES — be careful, it's not "close!" There's a T-H in the middle.

Then we have MOVE, PROVE, and IMPROVE — they all end in O-V-E, and the O makes an "oo" sound, not "oh."

EVERY and EVERYBODY — don't forget that second E! It's E-V-E-R-Y.

And BUSY — it sounds like "bizzy" but it's spelled B-U-S-Y. The U says "ih" — how sneaky!`,
    examples: ['beautiful', 'because', 'people', 'clothes', 'move', 'prove', 'improve', 'every', 'everybody', 'busy'],
    audioFile: '/audio/lessons/unstressed-vowels.mp3'
  },

  'sh-as-s': {
    category: 'sh-as-s',
    title: 'The Sneaky S and Long O Patterns',
    explanation: `This group has two sets of words to learn.

First up: SUGAR and SURE. Normally the letter S says "sss," right? But in these two words, the S makes a "sh" sound instead! "Shooger." "Shore." They're two of the only common words where S does this — so just remember: sugar and sure are S-H sounds in disguise!

Now the second group — these all have a long "oh" sound:

The O-L-D words: COLD, GOLD, HOLD, OLD, and TOLD. The O says "oh" even though it's followed by L-D.

Then BOTH and MOST — the O says "oh" here too.

And ONLY — it starts with that same long "oh" sound.

A good way to remember: in all these words, the letter O is saying its own name!`,
    examples: ['sugar', 'sure', 'cold', 'gold', 'hold', 'old', 'told', 'both', 'most', 'only'],
    audioFile: '/audio/lessons/sh-as-s.mp3'
  },

  'ar-as-a': {
    category: 'ar-as-a',
    title: 'The Hidden "ar" Sound',
    explanation: `Here's something cool — in these words, the letter A makes an "ah" sound, like in "car," even though there's no R after it!

Listen: BATH. CLASS. GRASS. PATH. FAST. LAST. PAST. PASS. PLANT. AFTER. FATHER.

Can you hear it? That long "aah" sound in the middle.

Here's the pattern: this usually happens when A comes before the letters T-H, S-S, S-T, or F-T.

Before T-H: BATH, PATH, FATHER.
Before S-S: CLASS, GRASS, PASS.
Before S-T: FAST, LAST, PAST.
Before F-T: AFTER.
And PLANT is a bonus one!

If you can spot these letter combos after the A, you'll know it's the long "aah" sound.`,
    examples: ['bath', 'class', 'fast', 'father', 'grass', 'last', 'pass', 'past', 'path', 'plant', 'after'],
    audioFile: '/audio/lessons/ar-as-a.mp3'
  },

  'igh-as-i': {
    category: 'igh-as-i',
    title: 'Long I Sounds and Other Surprises',
    explanation: `Most of these words have a long "eye" sound — like saying the letter I — but it's spelled in unusual ways.

The I-N-D words: BEHIND, FIND, KIND, and MIND. When I comes before N-D, it says its long sound — "eye." Easy pattern!

The I-L-D words: CHILD and WILD. Same idea — when I comes before L-D, it says "eye" too.

Then there's CLIMB — it has a silent B at the end! You say "clime" but spell it C-L-I-M-B. Don't forget that sneaky B!

Now, this group also includes some surprise words that work differently:

ANY and MANY — here the A sounds like "eh." "Enny." "Menny." The A is pretending to be an E!

WHO and WHOLE — the W is silent! You say "hoo" and "hole," and the W-H at the start is just for show.`,
    examples: ['behind', 'find', 'kind', 'mind', 'child', 'wild', 'climb', 'any', 'many', 'who', 'whole'],
    audioFile: '/audio/lessons/igh-as-i.mp3'
  },

  'other-b': {
    category: 'other-b',
    title: 'Tricky Words to Remember',
    explanation: `These words don't follow one single rule — each one has its own little trick. Let's go through them!

AGAIN — it sounds like "uh-gen" but starts with A-G-A-I-N.

CHILDREN — this is the plural of "child." Don't forget the R-E-N at the end.

CHRISTMAS — there's a silent T hiding in there! C-H-R-I-S-T-M-A-S. Think "Christ" plus "mas."

EVEN — two E's: E-V-E-N. Nice and simple.

EYE — it's only three letters, E-Y-E, but it looks so strange! The word starts and ends with E.

HALF — the L is silent! You say "hahf" but spell it H-A-L-F.

HOUR — the H is silent! It sounds exactly like "our."

MONEY — ends in E-Y, not just Y. M-O-N-E-Y.

MR — short for Mister, just two letters: M-R. And MRS — short for Missus: M-R-S.

PARENTS — don't forget the second A! P-A-R-E-N-T-S.

PRETTY — the E sounds like "ih" — "pritty" — but it's spelled with an E: P-R-E-T-T-Y.

WATER — W-A-T-E-R. The A says "or" — that's the tricky bit!`,
    examples: ['again', 'children', 'Christmas', 'even', 'eye', 'half', 'hour', 'money', 'Mr', 'Mrs', 'parents', 'pretty', 'water'],
    audioFile: '/audio/lessons/other-b.mp3'
  }
};

/**
 * Get lesson for a specific category
 */
export function getLessonForCategory(category: string): CategoryLesson | undefined {
  return LIST_B_LESSONS[category];
}

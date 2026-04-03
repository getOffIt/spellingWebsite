/**
 * Per-word mnemonics for struggling words.
 * Each tip is short and focused — one word, one trick.
 * Audio files are generated with ElevenLabs (George voice).
 */
export interface WordTip {
  word: string;
  tip: string;
  audioFile: string;
}

export const WORD_TIPS: Record<string, WordTip> = {
  water: {
    word: 'water',
    tip: 'Two chunks: WA-TER. You WAsh with WATer — both start with W-A!',
    audioFile: '/audio/tips/water.mp3',
  },
  children: {
    word: 'children',
    tip: 'Start with CHILD you already know, then swap the D for D-R-E-N. CHIL-DREN!',
    audioFile: '/audio/tips/children.mp3',
  },
  people: {
    word: 'people',
    tip: 'People Eat Oranges — P-E-O! The O hides in the middle: PE-O-PLE.',
    audioFile: '/audio/tips/people.mp3',
  },
  beautiful: {
    word: 'beautiful',
    tip: 'Big Elephants Are Ugly — B-E-A-U! Then add T-I-F-U-L. Be-au-ti-ful!',
    audioFile: '/audio/tips/beautiful.mp3',
  },
  because: {
    word: 'because',
    tip: 'Big Elephants Can Always Understand Small Elephants — B-E-C-A-U-S-E!',
    audioFile: '/audio/tips/because.mp3',
  },
  Christmas: {
    word: 'Christmas',
    tip: 'Think "Christ" plus "mas." The T is silent but it\'s always there! C-H-R-I-S-T-M-A-S.',
    audioFile: '/audio/tips/christmas.mp3',
  },
  half: {
    word: 'half',
    tip: 'The L is silent! You say "hahf" but spell it H-A-L-F. The L is hiding!',
    audioFile: '/audio/tips/half.mp3',
  },
  hour: {
    word: 'hour',
    tip: 'The H is silent! It sounds like "our" but starts with H. H-O-U-R.',
    audioFile: '/audio/tips/hour.mp3',
  },
  eye: {
    word: 'eye',
    tip: 'Only three letters! E-Y-E. It starts and ends with E, with Y in the middle.',
    audioFile: '/audio/tips/eye.mp3',
  },
  pretty: {
    word: 'pretty',
    tip: 'Sounds like "pritty" but uses E not I! P-R-E-T-T-Y. Two T\'s in the middle!',
    audioFile: '/audio/tips/pretty.mp3',
  },
  Mr: {
    word: 'Mr',
    tip: 'Just two letters! M then R. Short for Mister — M-R. No dots needed!',
    audioFile: '/audio/tips/mr.mp3',
  },
  Mrs: {
    word: 'Mrs',
    tip: 'Three letters! M-R-S. Short for Missus. Start with Mr, add an S!',
    audioFile: '/audio/tips/mrs.mp3',
  },
  clothes: {
    word: 'clothes',
    tip: 'Not "close"! There\'s a T-H hiding inside: C-L-O-T-H-E-S. Close + TH!',
    audioFile: '/audio/tips/clothes.mp3',
  },
  busy: {
    word: 'busy',
    tip: 'Sounds like "bizzy" but it\'s B-U-S-Y. The U pretends to be an I!',
    audioFile: '/audio/tips/busy.mp3',
  },
  money: {
    word: 'money',
    tip: 'Ends in E-Y not just Y! M-O-N-E-Y. MON like Monday, then E-Y!',
    audioFile: '/audio/tips/money.mp3',
  },
  parents: {
    word: 'parents',
    tip: 'Don\'t forget the second A! P-A-R-E-N-T-S. PAR like a park, then ENTS.',
    audioFile: '/audio/tips/parents.mp3',
  },
};

/**
 * Get tip for a specific word (case-sensitive match)
 */
export function getWordTip(word: string): WordTip | undefined {
  return WORD_TIPS[word];
}

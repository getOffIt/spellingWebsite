import {
  Word,
  YEAR1_WORDS,
  COMMON_WORDS,
  WEEKLY_SPELLING_WORDS,
  SPELLING_LIST_A,
  SPELLING_LIST_B,
} from '../data/words';
import { ChallengeConfig } from '../components/Challenge';

/**
 * Configuration for word selection pages
 */
export interface WordSelectionConfig {
  words: Word[];
  title: string;
  themeClass?: string;
  wordFilter?: (word: Word) => boolean;
  challengeConfig?: ChallengeConfig;
}

/**
 * Centralized configurations for all word selection types
 */
export const wordSelectionConfigs: Record<string, WordSelectionConfig> = {
  weeklySpellings: {
    words: WEEKLY_SPELLING_WORDS,
    title: "This Week's Spellings — 17 September",
    challengeConfig: {
      title: "📚 This Week's Spellings — 17 September",
      description: 'Practise all {total} homework words, including the three challenge words.',
      rewardText: '',
      motivationMessages: {
        complete: '🎉 Brilliant — this week\'s spellings are mastered! 🎉',
        close: '🔥 Nearly there — just {remaining} words left! 🔥',
        good: '💪 Great progress — keep going! 💪',
        steady: '🚀 You\'re getting there! 🚀',
        starting: '🌟 Good start — keep practising! 🌟',
        beginning: '🎯 Ready to practise this week\'s words? Let\'s go! 🎯',
      },
    },
  },
  year1: {
    words: YEAR1_WORDS,
    title: 'Word Selection',
    wordFilter: (word: Word) => !word.category.startsWith('adding'),
    challengeConfig: {
      title: '🏆 KS1-1 Challenge! 🏆',
      description: 'Master all {total} words to earn £50! (10 correct in a row per word)',
      rewardText: '',
      motivationMessages: {
        complete: '🎉 CONGRATULATIONS! 🎉\nYou\'ve earned your £50! 🤑',
        close: '🔥 So close! Just {remaining} more words! 🔥',
        good: '💪 Great progress! Keep going! 💪',
        steady: '🚀 Steady progress! You\'re doing amazing! 🚀',
        starting: '🌟 Off to a great start! Keep it up! 🌟',
        beginning: '🎯 Ready to start earning that £50? Let\'s go! 🎯',
      },
    },
  },
  common: {
    words: COMMON_WORDS,
    title: '🎃 Spooky Common Words Challenge 👻',
    themeClass: 'common-words-page',
    challengeConfig: {
      title: '🎃 Spooky Common Words Challenge 👻',
      description: 'Master all spooky common words! (10 correct in a row per word)',
      rewardText: '',
      themeClass: 'spooky-challenge',
      motivationMessages: {
        complete: '🎉 BOO-TIFUL! You\'ve mastered all the spooky words! 🎉',
        close: '👻 Almost there! Just {remaining} more spooky words! 👻',
        good: '🦇 Great progress! Keep haunting those words! 🦇',
        steady: '🧙 Steady progress! You\'re doing spooktacular! 🧙',
        starting: '🎃 Off to a great start! Keep it up! 🎃',
        beginning: '🕷️ Ready to start your spooky word adventure? Let\'s go! 🕷️',
      },
    },
  },
  spellingListA: {
    words: SPELLING_LIST_A,
    title: '📝 The Big Test 27th Feb — List A',
    challengeConfig: {
      title: '📝 The Big Test 27th Feb — List A',
      description: 'Master all {total} words to earn £40! (10 correct in a row per word)',
      rewardText: '',
      motivationMessages: {
        complete: '🎉 AMAZING! 🎉\nYou\'ve earned your £40! 🤑',
        close: '🔥 So close! Just {remaining} more words! 🔥',
        good: '💪 Great progress! Keep going! 💪',
        steady: '🚀 Steady progress! You\'re doing amazing! 🚀',
        starting: '🌟 Off to a great start! Keep it up! 🌟',
        beginning: '🎯 Ready to start earning that £40? Let\'s go! 🎯',
      },
    },
  },
  spellingListB: {
    words: SPELLING_LIST_B,
    title: '📝 The Big Test 27th Feb — List B',
    challengeConfig: {
      title: '📝 The Big Test 27th Feb — List B',
      description: 'Master all {total} words to earn £40! (10 correct in a row per word)',
      rewardText: '',
      motivationMessages: {
        complete: '🎉 AMAZING! 🎉\nYou\'ve earned your £40! 🤑',
        close: '🔥 So close! Just {remaining} more words! 🔥',
        good: '💪 Great progress! Keep going! 💪',
        steady: '🚀 Steady progress! You\'re doing amazing! 🚀',
        starting: '🌟 Off to a great start! Keep it up! 🌟',
        beginning: '🎯 Ready to start earning that £40? Let\'s go! 🎯',
      },
    },
  },
};

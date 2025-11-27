import { Word, YEAR1_WORDS, COMMON_WORDS } from '../data/words';
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
  year1: {
    words: YEAR1_WORDS,
    title: 'Word Selection',
    wordFilter: (word: Word) => !word.category.startsWith('adding'),
    challengeConfig: {
      title: '🏆 KS1-1 Challenge! 🏆',
      description: 'Master all {total} words to earn £50!',
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
      description: 'Master all spooky common words!',
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
};


import { describe, it, expect } from 'vitest';
import { getMasteryThreshold, MASTERY_THRESHOLD } from './masteryThresholds';

describe('masteryThresholds', () => {
  describe('getMasteryThreshold', () => {
    it('returns 10 for any word ID', () => {
      expect(getMasteryThreshold('word-1')).toBe(10);
      expect(getMasteryThreshold('word-2')).toBe(10);
      expect(getMasteryThreshold('random-word')).toBe(10);
      expect(getMasteryThreshold('test-word-abc')).toBe(10);
    });

    it('returns the same value as MASTERY_THRESHOLD constant', () => {
      expect(getMasteryThreshold('any-word')).toBe(MASTERY_THRESHOLD);
    });

    it('handles empty string word ID', () => {
      expect(getMasteryThreshold('')).toBe(10);
    });

    it('handles word IDs with special characters', () => {
      expect(getMasteryThreshold('word-with-dash')).toBe(10);
      expect(getMasteryThreshold('word_with_underscore')).toBe(10);
      expect(getMasteryThreshold('word123')).toBe(10);
    });
  });

  describe('MASTERY_THRESHOLD', () => {
    it('is set to 10', () => {
      expect(MASTERY_THRESHOLD).toBe(10);
    });
  });
});

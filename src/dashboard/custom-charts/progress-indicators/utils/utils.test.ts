import { describe, it } from 'vitest';

import { getPercentage } from './utils';

describe('progress indicator utils', () => {
  describe('getPercentage', () => {
    it('calculates percentage values', () => {
      const percentage = getPercentage({ target: 400, progress: 100 });
      expect(percentage).toEqual(25);
    });

    it('returns 100 when target is 0', () => {
      const percentage = getPercentage({ target: 0, progress: 100 });
      expect(percentage).toEqual(100);
    });

    it('returns 0 when progress is 0', () => {
      const percentage = getPercentage({ target: 400, progress: 0 });
      expect(percentage).toEqual(0);
    });

    it('returns 100 if both target and progress are 0', () => {
      const percentage = getPercentage({ target: 0, progress: 0 });
      expect(percentage).toEqual(100);
    });

    it('returns null when target is undefined', () => {
      const percentage = getPercentage({ target: undefined, progress: 100 });
      expect(percentage).toBeNull();
    });

    it('returns null when target is less than 0', () => {
      const percentage = getPercentage({ target: -5, progress: 100 });
      expect(percentage).toBeNull();
    });

    it('returns null when when progress is undefined', () => {
      const percentage = getPercentage({ target: 400, progress: undefined });
      expect(percentage).toBeNull();
    });

    it('returns null when progress is null', () => {
      const percentage = getPercentage({ target: 400, progress: null });
      expect(percentage).toBeNull();
    });

    it('returns null when progress is NaN', () => {
      const percentage = getPercentage({ target: 400, progress: NaN });
      expect(percentage).toBeNull();
    });
  });
});

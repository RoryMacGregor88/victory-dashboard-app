import { screen, render } from '../../../../test/test.utils';

import {
  getPercentage,
  renderCenterDisplay,
} from './progress-indicators.component';

describe('WFC progress indicators', () => {
  describe('getPercentage', () => {
    it('calculates percentage values', () => {
      const percentage = getPercentage(400, 100);
      expect(percentage).toEqual(25);
    });

    it('returns 100 when target is 0', () => {
      const percentage = getPercentage(0, 100);
      expect(percentage).toEqual(100);
    });

    it('returns 0 when progress is 0', () => {
      const percentage = getPercentage(400, 0);
      expect(percentage).toEqual(0);
    });

    it('returns 100 if both target and progress are 0', () => {
      const percentage = getPercentage(0, 0);
      expect(percentage).toEqual(100);
    });

    it('returns null when target is undefined', () => {
      const percentage = getPercentage(undefined, 100);
      expect(percentage).toBeNull();
    });

    it('returns null when target is less than 0', () => {
      const percentage = getPercentage(-5, 100);
      expect(percentage).toBeNull();
    });

    it('returns null when when progress is undefined', () => {
      const percentage = getPercentage(400, undefined);
      expect(percentage).toBeNull();
    });

    it('returns null when progress is null', () => {
      const percentage = getPercentage(400, null);
      expect(percentage).toBeNull();
    });

    it('returns null when progress is NaN', () => {
      const percentage = getPercentage(400, NaN);
      expect(percentage).toBeNull();
    });
  });

  describe('renderCenterDisplay', () => {
    it('renders a percentage value and target text', () => {
      render(renderCenterDisplay({ percentage: 25, target: 100 }));

      expect(screen.getByText('25%')).toBeInTheDocument();
      expect(screen.getByText('Target 100 Units')).toBeInTheDocument();
    });

    it('displays error state when no percentage provided', () => {
      render(
        renderCenterDisplay({
          percentage: null,
          target: 100,
          name: 'Test Name',
        })
      );

      expect(screen.getByText('Test Name Target Required')).toBeInTheDocument();
    });
  });
});

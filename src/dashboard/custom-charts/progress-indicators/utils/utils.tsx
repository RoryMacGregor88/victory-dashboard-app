import { MAX_PERCENTAGE, MIN_PERCENTAGE } from '~/constants';

interface PercentageArgs {
  target: number | null;
  progress: number | null;
}

/**
 * this prevents "Infinity%" values being shown, but
 * calculates any valid values, including zero
 */
export const getPercentage = ({ target, progress }: PercentageArgs) => {
  if (!target) return null;

  if (progress === MIN_PERCENTAGE && target === MIN_PERCENTAGE) {
    /** target and progress are both zero, return 100% */
    return MAX_PERCENTAGE;
  } else if (target === MIN_PERCENTAGE) {
    /** target is 0, return 100% */
    return MAX_PERCENTAGE;
  } else if (progress === MIN_PERCENTAGE) {
    /** progress is zero, return 0% */
    return MIN_PERCENTAGE;
  } else if (progress && target > MIN_PERCENTAGE) {
    /** calculate percentage */
    return Math.round((progress / target) * MAX_PERCENTAGE);
  } else return null;
};

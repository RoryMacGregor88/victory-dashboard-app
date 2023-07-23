import { userTargetTransformer } from '../../../../utils/utils';
import { housingTenureTypes } from '../../../../../constants';
import { TenureTypeHousingData } from '../../../../../mocks/fixtures';
import { TargetCategory, Targets } from '../../../../../types';

/**
 * Pads missing data for years on the timeline with null values
 */

interface Args {
  apiData: Partial<TenureTypeHousingData>;
  targets: Targets[TargetCategory];
  timeline: number[];
}

export const tenureHousingTransformer = ({
  apiData,
  targets = {},
  timeline,
}: Args) => {
  if (!apiData) return;

  const transformedTargets = userTargetTransformer(targets, timeline);

  const transformedData = timeline.map((year) => {
    const obj = apiData.find(({ startYear }) => startYear === year)!;

    /** Victory does not work with number values, so must be stringified. */
    // TODO: doesn't sound right^, Victory should work with numbers
    return !!obj
      ? { ...obj, startYear: String(obj.startYear) }
      : {
          startYear: String(year),
          ...Object.values(housingTenureTypes).reduce(
            (acc, cur) => ({ ...acc, [cur]: null }),
            {}
          ),
        };
  });

  return { transformedData, transformedTargets };
};

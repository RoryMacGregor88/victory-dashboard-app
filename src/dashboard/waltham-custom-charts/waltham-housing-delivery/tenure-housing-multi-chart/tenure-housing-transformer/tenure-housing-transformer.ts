import { userTargetTransformer } from '../../../../utils/utils';
import { housingTenureTypes } from '../../../../../constants';

/**
 * @param {object[]} apiData
 * @param {object} targets
 * @returns {{
 *  transformedData: object[]
 *  transformedTargets: { x: string, y: number }[]
 * }}
 */
export const tenureHousingTransformer = (
  apiData,
  targets = {},
  filteredTimeline
) => {
  if (!apiData) return;

  const hasTargets = !!Object.keys(targets).length;

  const transformedTargets = hasTargets
    ? userTargetTransformer(targets, filteredTimeline)
    : null;

  const transformedData = filteredTimeline.map((year) => {
    const obj = apiData.find((datum) => datum.startYear === year);
    // Victory does not work with number values, so must be stringified.
    return obj
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

import { userTargetTransformer } from '../../../../utils';

/**
 * @param {object[]} apiData
 * @param {object} targets
 * @param {number[]} filteredTimeline
 * @returns {{
 *  transformedData: { x: number, y: number }[][]
 *  transformedTargets: { x: string, y: number }[]
 * }}
 */
export const totalHousingTransformer = (
  apiData,
  targets = {},
  filteredTimeline
) => {
  if (!apiData) return;

  const hasTargets = !!Object.keys(targets).length;

  const transformedTargets = hasTargets
    ? userTargetTransformer(targets, filteredTimeline)
    : null;

  const transformedData = Object.values(
    filteredTimeline.reduce(
      (acc, year) => {
        const obj = apiData.find((datum) => datum.startYear === year) ?? {};
        return {
          gross: [
            ...acc.gross,
            { x: year.toString(), y: obj['Total Gross'] ?? null },
          ],
          net: [
            ...acc.net,
            { x: year.toString(), y: obj['Total Net'] ?? null },
          ],
        };
      },
      { gross: [], net: [] }
    )
  );

  return { transformedData, transformedTargets };
};

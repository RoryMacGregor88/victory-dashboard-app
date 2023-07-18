import { userTargetTransformer } from '../../../../utils/utils';

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
  if (!apiData || !filteredTimeline) return;

  const transformedTargets = userTargetTransformer(targets, filteredTimeline);

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

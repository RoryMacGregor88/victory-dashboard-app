import { TotalHousingDeliveryData } from '~/mocks/fixtures';

/**
 * Works out bar widths for the total housing delivery chart (paired bars).
 */

interface Args {
  data: TotalHousingDeliveryData;
  width: number;
}

export const pairedWidthCalculator = ({ data, width }: Args) => {
  const barGapRatio = 1.44,
    minBarWidth = 3,
    dataLength = data.length;

  /** data is nested arrays of objects */
  const averageDataLength = data.flat().length / dataLength;

  const pairWidth = dataLength * 2,
    zoneWidth = width / averageDataLength,
    barWidth = minBarWidth + zoneWidth / (dataLength * pairWidth),
    offset = barWidth * barGapRatio;

  return { barWidth, offset };
};

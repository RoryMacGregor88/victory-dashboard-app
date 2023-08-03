import { userTargetTransformer } from '~/dashboard/utils/utils';
import { TotalHousingDeliveryData } from '~/mocks/fixtures';
import { TargetCategory, Targets } from '~/types';

interface Args {
  data: TotalHousingDeliveryData;
  targetDataset: Targets[TargetCategory];
  timeline: number[];
}

type TransformedData = {
  gross: { x: string; y: number | null }[];
  net: [{ x: string; y: number | null }];
};

export const totalHousingTransformer = ({
  data,
  targetDataset = {},
  timeline,
}: Args) => {
  const transformedTargets = userTargetTransformer(targetDataset, timeline);

  // TODO: broken types
  const transformedDataObject = timeline.reduce(
    (acc: TransformedData, year: number) => {
      const obj = data.find(({ startYear }) => startYear === year)!;
      return {
        gross: [
          ...acc.gross,
          { x: year.toString(), y: obj['Total Gross'] ?? null },
        ],
        net: [...acc.net, { x: year.toString(), y: obj['Total Net'] ?? null }],
      };
    },
    { gross: [], net: [] },
  );

  /** only the array values of gross/net are required */
  const transformedData = Object.values(transformedDataObject);

  return { transformedData, transformedTargets };
};

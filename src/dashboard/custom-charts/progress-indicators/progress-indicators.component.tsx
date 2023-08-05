import { useMemo } from 'react';

import { makeStyles } from '@material-ui/core';

import {
  MAX_PERCENTAGE,
  MIN_PERCENTAGE,
  PROGRESS_CHART_DATA,
} from '~/constants';
import { ChartWrapper, ProgressWheel } from '~/dashboard/charts';
import { getPercentage } from '~/dashboard/custom-charts/progress-indicators/utils/utils';
import { useChartTheme } from '~/dashboard/useChartTheme';
import { getPastYears, getUser5YearTotals } from '~/dashboard/utils/utils';
import {
  TenureTypeHousingData,
  TotalHousingDeliveryData,
} from '~/mocks/fixtures';
import { ProgressIndicatorData, Targets } from '~/types';

const useStyles = makeStyles(() => ({
  header: { minHeight: '6ch' },
}));

const currentYear = new Date().getFullYear();

interface ProgressIndicatorProps {
  totalData: TotalHousingDeliveryData;
  tenureData: TenureTypeHousingData;
  targets?: Targets;
}

const ProgressIndicators = ({
  totalData,
  tenureData,
  targets = {},
}: ProgressIndicatorProps) => {
  const chartTheme = useChartTheme();
  const { header } = useStyles();

  /** 'Gross' values only are required */
  const tenureCurrentYear = tenureData['Gross'].find(
    (obj) => obj.startYear === currentYear,
  )!;

  const { totalHousing, intermediateDelivery, marketHousing, sociallyRented } =
    useMemo(() => targets, [targets]);

  /** 'Gross' values tallied up for last 5 years */
  const past5YearsTotal = useMemo(
    () =>
      getPastYears().reduce((acc, year) => {
        const match = totalData.find(({ startYear }) => startYear === year);
        return !!match ? (acc += match['Total Gross']) : acc;
      }, 0),
    [totalData],
  );

  /** data combined with user target for display in progress wheels */
  const targetData = useMemo(
    () => [
      {
        ...PROGRESS_CHART_DATA.totalHousing,
        target: getUser5YearTotals(totalHousing) ?? null,
        progress: past5YearsTotal,
      },
      {
        ...PROGRESS_CHART_DATA.intermediate,
        target: intermediateDelivery?.[currentYear] ?? null,
        progress: tenureCurrentYear['Intermediate'] ?? null,
      },
      {
        ...PROGRESS_CHART_DATA.marketHousing,
        target: marketHousing?.[currentYear] ?? null,
        progress: tenureCurrentYear['Market for sale'] ?? null,
      },
      {
        ...PROGRESS_CHART_DATA.socialRented,
        target: sociallyRented?.[currentYear] ?? null,
        progress: tenureCurrentYear['Social Rent'] ?? null,
      },
    ],
    [
      intermediateDelivery,
      marketHousing,
      past5YearsTotal,
      sociallyRented,
      tenureCurrentYear,
      totalHousing,
    ],
  );

  if (!targetData) return null;

  return targetData.map(({ target, progress, title, name, info }, i) => {
    const percentage = getPercentage({ target, progress }),
      data: ProgressIndicatorData = [
        { x: 1, y: percentage ?? MIN_PERCENTAGE },
        {
          x: 2,
          y: MAX_PERCENTAGE - (percentage ?? MIN_PERCENTAGE),
        },
      ];

    return (
      <ChartWrapper key={name} classes={{ header }} info={info} title={title}>
        <ProgressWheel
          color={chartTheme.colors[i]}
          data={data}
          name={name}
          percentage={percentage}
          target={target}
        />
      </ChartWrapper>
    );
  });
};

export default ProgressIndicators;

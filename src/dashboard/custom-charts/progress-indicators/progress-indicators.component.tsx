import { useMemo } from 'react';

import { makeStyles } from '@material-ui/core';

import { ChartWrapper } from '../../charts/chart-wrapper.component';
import ProgressWheel from '../../charts/progress-wheel/progress-wheel-chart.component';
import { useChartTheme } from '../../useChartTheme';

import { getUser5YearTotals, getPastYears } from '../../utils/utils';
import {
  PROGRESS_CHART_DATA,
  MIN_PERCENTAGE,
  MAX_PERCENTAGE,
} from '../../../constants';
import {
  TotalHousingDeliveryData,
  TenureTypeHousingData,
} from '../../../mocks/fixtures';
import { ProgressIndicatorData, Targets } from '../../../types';
import { getPercentage } from './utils/utils';

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

  const tenureCurrentYear = tenureData.find(
    (obj) => obj.startYear === currentYear
  )!;

  const totalHousing = targets.totalHousing ?? {},
    intermediateDelivery = targets.intermediateDelivery ?? {},
    marketHousing = targets.marketHousing ?? {},
    sociallyRented = targets.sociallyRented ?? {};

  /** 'Gross' values tallied up for last 5 years */
  const past5YearsTotal = useMemo(
    () =>
      getPastYears().reduce((acc, year) => {
        const match = totalData.find(({ startYear }) => startYear === year);
        return !!match ? (acc += match['Total Gross']) : acc;
      }, 0),
    [totalData]
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
        target: intermediateDelivery[currentYear] ?? null,
        progress: tenureCurrentYear['Intermediate'] ?? null,
      },
      {
        ...PROGRESS_CHART_DATA.marketHousing,
        target: marketHousing[currentYear] ?? null,
        progress: tenureCurrentYear['Market for sale'] ?? null,
      },
      {
        ...PROGRESS_CHART_DATA.socialRented,
        target: sociallyRented[currentYear] ?? null,
        progress: tenureCurrentYear['Social Rent'] ?? null,
      },
    ],
    [past5YearsTotal, tenureCurrentYear, targets, currentYear]
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
      <ChartWrapper key={name} title={title} info={info} classes={{ header }}>
        <ProgressWheel
          color={chartTheme.colors[i]}
          percentage={percentage}
          target={target}
          name={name}
          data={data}
        />
      </ChartWrapper>
    );
  });
};

export default ProgressIndicators;

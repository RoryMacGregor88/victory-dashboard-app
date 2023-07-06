import { useMemo } from 'react';

import { makeStyles } from '@material-ui/core';

import { Text } from '@visx/text';

import { ChartWrapper } from '../../charts/chart-wrapper.component';
import { ProgressIndicatorChart } from '../../charts/progress-indicator-chart/progress-indicator-chart.component';
import { useChartTheme } from '../../useChartTheme';

import { getUser5YearTotals, getPastYears } from '../../utils/utils';
import {
  PROGRESS_CHART_DATA,
  MIN_PERCENTAGE,
  MAX_PERCENTAGE,
  PERCENT_FONT_DEVISOR,
  TARGET_FONT_DEVISOR,
  ERROR_FONT_DEVISOR,
} from '../../../constants';
import { Targets } from '~/accounts/accounts.slice';
import {
  TotalHousingDeliveryData,
  TenureTypeHousingData,
} from '../../../mocks/fixtures';

const useStyles = makeStyles(() => ({
  header: { minHeight: '6ch' },
}));

interface PercentageArgs {
  target: number;
  progress: number;
}

/**
 * this prevents "Infinity%" values being shown, but
 * calculates any valid values, including zero
 */
const getPercentage = ({ target, progress }: PercentageArgs) => {
  if (progress === MIN_PERCENTAGE && target === MIN_PERCENTAGE) {
    /** target and progress are both zero, return 100% */
    return MAX_PERCENTAGE;
  } else if (target === MIN_PERCENTAGE) {
    /** target is 0, return 100% */
    return MAX_PERCENTAGE;
  } else if (progress === MIN_PERCENTAGE) {
    /** progress is zero, return 0% */
    return MIN_PERCENTAGE;
  } else if (!!progress && target > MIN_PERCENTAGE) {
    /** calculate percentage */
    return Math.round((progress / target) * MAX_PERCENTAGE);
  } else {
    return null;
  }
};

interface CenterDisplayArgs {
  percentage: number | null;
  target: number | undefined;
  name: string;
  radius: number;
  width: number;
}

/**
 * takes the calculated percentage, as well as other props, and returns a
 * responsive component to be displayed inside the progress indicator
 */
const renderCenterDisplay = ({
  percentage,
  target,
  name,
  radius,
  width,
}: CenterDisplayArgs) => {
  // TODO: why number coerce if already a number?
  const roundedPercentage = `${Math.round(Number(percentage))}%`;
  return percentage ? (
    <>
      <Text
        width={radius}
        textAnchor='middle'
        verticalAnchor='end'
        x={radius}
        y={radius}
        dy={-8}
        style={{
          fill: '#fff',
          fontSize: `${width / PERCENT_FONT_DEVISOR}rem`,
        }}
      >
        {roundedPercentage}
      </Text>
      <Text
        width={radius}
        textAnchor='middle'
        verticalAnchor='start'
        x={radius}
        y={radius}
        dy={8}
        style={{
          fill: '#fff',
          fontSize: `${width / TARGET_FONT_DEVISOR}rem`,
        }}
      >
        {`Target ${target} Units`}
      </Text>
    </>
  ) : (
    <Text
      width={radius}
      textAnchor='middle'
      verticalAnchor='middle'
      x={radius}
      y={radius}
      style={{
        fill: '#fff',
        fontSize: `${width / ERROR_FONT_DEVISOR}rem`,
      }}
    >
      {`${name} Target Required`}
    </Text>
  );
};

interface ProgressIndicatorProps {
  totalData: TotalHousingDeliveryData;
  tenureData: TenureTypeHousingData;
  targets: Targets;
}

const ProgressIndicators = ({
  totalData,
  tenureData,
  targets,
}: ProgressIndicatorProps): JSX.Element => {
  const chartTheme = useChartTheme();
  const styles = useStyles({});

  const tenureCurrentYear = tenureData.find((obj) => obj.startYear === 2022);

  /** 'Gross' values tallied up for last 5 years */
  const past5YearsTotal = useMemo(
    () =>
      getPastYears().reduce(
        (acc, cur) =>
          (acc += totalData.find((datum) => datum.startYear === cur)?.[
            'Total Gross'
          ]),
        0
      ),
    [totalData]
  );

  /** data combined with user target for progress wheels */
  const targetData = useMemo(
    () => [
      {
        ...PROGRESS_CHART_DATA.totalHousing,
        target: getUser5YearTotals(targets?.totalHousing),
        progress: past5YearsTotal,
      },
      {
        ...PROGRESS_CHART_DATA.intermediate,
        target: targets?.intermediateDelivery?.['2022'],
        progress: tenureCurrentYear?.['Intermediate'],
      },
      {
        ...PROGRESS_CHART_DATA.marketHousing,
        target: targets?.marketHousing?.['2022'],
        progress: tenureCurrentYear?.['Market for sale'],
      },
      {
        ...PROGRESS_CHART_DATA.socialRented,
        target: targets?.sociallyRented?.['2022'],
        progress: tenureCurrentYear?.['Social Rent'],
      },
    ],
    [past5YearsTotal, tenureCurrentYear, targets]
  );

  return (
    <>
      {targetData
        ? targetData.map(({ target, progress, title, name, info }, i) => {
            const percentage = getPercentage({ target, progress });
            return (
              <ChartWrapper
                key={name}
                title={title}
                info={info}
                classes={{ header: styles.header }}
              >
                <ProgressIndicatorChart
                  color={chartTheme.colors[i]}
                  data={[
                    { x: 1, y: percentage ?? MIN_PERCENTAGE },
                    {
                      x: 2,
                      y: MAX_PERCENTAGE - (percentage ?? MIN_PERCENTAGE),
                    },
                  ]}
                  renderCenterDisplay={({
                    radius,
                    width,
                  }: {
                    radius: number;
                    width: number;
                  }): JSX.Element =>
                    renderCenterDisplay({
                      percentage,
                      target,
                      name,
                      radius,
                      width,
                    })
                  }
                />
              </ChartWrapper>
            );
          })
        : null}
    </>
  );
};

export { ProgressIndicators, getPercentage, renderCenterDisplay };

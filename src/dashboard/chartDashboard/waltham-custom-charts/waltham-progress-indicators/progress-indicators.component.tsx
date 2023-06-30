import { useMemo } from 'react';

import { makeStyles } from '@material-ui/core';

import { Text } from '@visx/text';

import { ChartWrapper } from '../../../charts/chart-wrapper.component';
import { ProgressIndicatorChart } from '../../../charts/progress-indicator-chart/progress-indicator-chart.component';
import { useChartTheme } from '../../../useChartTheme';

import { getUser5YearTotals, getPastYears } from '../../utils';
import {
  PROGRESS_CHART_DATA,
  MIN_PERCENTAGE,
  MAX_PERCENTAGE,
  PERCENT_FONT_DEVISOR,
  TARGET_FONT_DEVISOR,
  ERROR_FONT_DEVISOR,
} from '../../waltham.constants';

const useStyles = makeStyles(() => ({
  header: {
    minHeight: '6ch',
  },
}));

/**
 * this prevents "Infinity%" values being shown, but calculates any
 * valid values, including zero
 *
 * @param {number} target
 * @param {number} progress
 * @returns {number}
 */
const getPercentage = (target, progress) => {
  if (progress === MIN_PERCENTAGE && target === MIN_PERCENTAGE) {
    return MAX_PERCENTAGE;
  } else if (target === MIN_PERCENTAGE) {
    return MAX_PERCENTAGE;
  } else if (progress === MIN_PERCENTAGE) {
    return MIN_PERCENTAGE;
  } else if (!!progress && target > MIN_PERCENTAGE) {
    return Math.round((progress / target) * MAX_PERCENTAGE);
  } else {
    return null;
  }
};

/**
 * takes the calculated percentage, as well as other props, and returns a
 * responsive component to be displayed inside the progress indicator.
 *
 * @param {{
 *  percentage: number|null,
 *  target: number|undefined,
 *  name: string,
 *  radius: number,
 *  width: number
 * }} props
 */
const renderCenterDisplay = ({ percentage, target, name, radius, width }) =>
  percentage ? (
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
        {`${Math.round(Number(percentage))}%`}
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

/**
 * @param {{
 *   totalData: object
 *   tenureData: object
 *   targets: object
 * }} props
 */
const ProgressIndicators = ({ totalData, tenureData, targets }) => {
  const chartTheme = useChartTheme();
  const styles = useStyles({});
  const totalDataArray = totalData?.properties?.[0]?.data;

  const tenureCurrentYear = tenureData?.find((obj) => obj.startYear === 2022);

  // TODO: this is only here because mock data needs `startYear` added and `Year` filtered out
  const adaptedTotalData = totalDataArray?.map((obj) => {
    const [startYear] = obj.Year.split('-');
    return Object.entries({ startYear: Number(startYear), ...obj }).reduce(
      (acc, [key, value]) => (key === 'Year' ? acc : { ...acc, [key]: value }),
      {}
    );
  });

  // 'Gross' values tallied up for last 5 years, like ticket asks
  const past5YearsTotal = useMemo(
    () =>
      getPastYears().reduce(
        (acc, cur) =>
          (acc += adaptedTotalData?.find((d) => d.startYear === cur)?.[
            'Total Gross'
          ]),
        0
      ),
    [adaptedTotalData]
  );

  // data combined with user target for progress wheels
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
            const percentage = getPercentage(target, progress);
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
                  renderCenterDisplay={({ radius, width }) =>
                    renderCenterDisplay({
                      target,
                      name,
                      percentage,
                      radius,
                      width,
                      value: percentage,
                      units: '%',
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

import { useCallback, useState, useEffect } from 'react';

import { Grid, Typography } from '@material-ui/core';

import { VictoryGroup, VictoryLine, VictoryScatter } from 'victory';

import { BaseChart } from '../../charts/base-chart/base-chart.component';
import { ChartWrapper } from '../../charts/chart-wrapper.component';
import { StyledParentSize } from '../../charts/styled-parent-size.component';
import { useChartTheme } from '../../useChartTheme';
import FlyoutTooltip from '../../FlyoutTooltip';
import { getDataTimeline, computePercentages } from '../../utils/utils';
import { WalthamCustomDateRange } from '../../waltham-custom-date-range/waltham-custom-date-range.component';
import { WalthamCustomLegend } from '../../waltham-custom-legend/waltham-custom-legend.component';
import { yellowStyle } from '../../../constants';

/**
 * @param {object[]} data
 * @param {number} year
 * @returns {object[]}
 */
const getFilteredData = (data, year) => {
  if (!data) return;
  const currentYearObject = data.find(
    (datum) => Number(datum.startYear) === year
  );
  const index = data.indexOf(currentYearObject);
  return data.slice(index - 4, index + 1);
};

/**
 * Non-matching pairs in API data/targets cannot be computed into
 * percentage values, so is guaranteed to result in empty columns so
 * filtering any lone values out is required.
 *
 * @param {object[]} data
 * @param {object} targets
 * @returns {{ pairedData: object[], pairedTargets: object }}
 */
export const getPairedValues = (data, targets) => {
  if (!data || !targets) return;

  return data.reduce(
    (acc, cur) => {
      const currentYear = cur.startYear;
      if (!cur['Affordable Housing'] || !targets[currentYear]) {
        return acc;
      } else {
        return {
          pairedData: [...acc.pairedData, cur],
          pairedTargets: {
            ...acc.pairedTargets,
            [currentYear]: targets[currentYear],
          },
        };
      }
    },
    { pairedData: [], pairedTargets: {} }
  );
};

/**
 * @param {{
 *  data: object[]
 *  targets: object
 *  settings: object
 *  setDashboardSettings: function
 * }} props
 */
const AffordableHousingDelivery = ({
  data,
  targets,
  settings,
  setDashboardSettings,
}) => {
  const { walthamChartColors } = useChartTheme();

  const [configuration, setConfiguration] = useState({
    affordableHousingTotalYear:
      settings?.affordableHousingTotalYear ?? undefined,
  });

  const { affordableHousingTotalYear } = configuration;

  const apiLegendData = [
    {
      name: '% affordable housing delivered out of yearly target',
      color: walthamChartColors.affordableHousingDelivery[0],
    },
  ];
  const { pairedData, pairedTargets } = getPairedValues(data, targets) ?? {};

  const timeline = getDataTimeline(pairedData, pairedTargets);

  const percentageData = computePercentages(
    timeline,
    data,
    targets,
    'Affordable Housing'
  );

  const hasData = percentageData?.some((item) => !!item['Affordable Housing']);

  /**
   * @param {object} newSettings
   */
  const updateDateFilter = useCallback(
    (newSettings) => {
      setConfiguration((prev) => ({
        ...prev,
        ...newSettings,
      }));

      setDashboardSettings((prev) => ({
        ...prev,
        settings: { ...prev.settings, ...newSettings },
      }));
    },
    [setDashboardSettings]
  );

  // setup/error catch for affordable housing chart
  useEffect(() => {
    if (!timeline?.length || timeline.includes(affordableHousingTotalYear)) {
      return;
    } else {
      updateDateFilter({
        affordableHousingTotalYear: timeline[timeline.length - 1],
      });
    }
  }, [affordableHousingTotalYear, timeline, updateDateFilter]);

  const AffordableHousingLineChart = ({ width }) => {
    if (!data) return null;
    const filteredData = getFilteredData(
      percentageData,
      affordableHousingTotalYear
    );

    if (!filteredData) return null;

    const y_max = Math.max(
      ...filteredData.map((item) => item['Affordable Housing'])
    );

    const props = {
      data: filteredData,
      x: 'startYear',
      y: 'Affordable Housing',
      domain: { y: [0, y_max > 100 ? y_max : 100] },
    };
    return (
      <VictoryGroup>
        <VictoryLine {...props} style={yellowStyle} />
        <VictoryScatter
          labelComponent={FlyoutTooltip()}
          {...props}
          labels={({ datum }) => `${datum._y}%`}
          style={yellowStyle}
        />
      </VictoryGroup>
    );
  };

  return (
    <ChartWrapper
      title='Affordable Housing Delivery (%)'
      info="The percentage of affordable housing delivered each year. The values shown are for the total affordable housing sites delivered as the sum of: 'Affordable Rent (not at LAR benchmark rents)' and 'London Affordable Rent' for the London Borough Waltham Forest area"
    >
      <StyledParentSize>
        {({ width }) =>
          !hasData ? (
            <Grid
              container
              justifyContent='space-around'
              alignItems='center'
              style={{ height: '12rem' }}
            >
              <Typography variant='h4'>
                {Object.keys(targets ?? {}).length
                  ? 'No matching data for provided targets.'
                  : 'Please enter affordable housing delivery targets.'}
              </Typography>
            </Grid>
          ) : (
            <>
              <WalthamCustomDateRange
                timeline={timeline}
                value={affordableHousingTotalYear}
                onSelect={(value) =>
                  updateDateFilter({ affordableHousingTotalYear: value })
                }
              />
              <WalthamCustomLegend
                width={width}
                apiLegendData={apiLegendData}
                targetLegendData={null}
                padTop
              />
              <BaseChart
                yLabel='Affordable Housing %'
                xLabel='Financial Year'
                width={width}
                financialYear
              >
                {AffordableHousingLineChart({ width })}
              </BaseChart>
            </>
          )
        }
      </StyledParentSize>
    </ChartWrapper>
  );
};
export { AffordableHousingDelivery };

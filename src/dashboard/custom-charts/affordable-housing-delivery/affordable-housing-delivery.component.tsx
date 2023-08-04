import { useCallback, useEffect, useMemo } from 'react';

import { Grid, Typography } from '@material-ui/core';
import {
  DomainTuple,
  VictoryGroup,
  VictoryLine,
  VictoryScatter,
} from 'victory';

import { FlyoutTooltip, StyledParentSize } from '~/components';
import { yellowStyle } from '~/constants';
import { BaseChart, ChartWrapper } from '~/dashboard/charts';
import { affordableHousingTransformer } from '~/dashboard/custom-charts/affordable-housing-delivery/affordable-housing-transformer/affordable-housing-transformer';
import { CustomDateRange } from '~/dashboard/custom-date-range/custom-date-range.component';
import { CustomLegend } from '~/dashboard/custom-legend/custom-legend.component';
import { useChartTheme } from '~/dashboard/useChartTheme';
import { getDataTimeline } from '~/dashboard/utils/utils';
import { AffordableHousingData } from '~/mocks/fixtures';
import { Settings, TargetCategory, Targets, UpdateOrbStateArgs } from '~/types';

const info = `
  This chart shows the percentage of affordable housing delivered,
  derived from user inputted target values. Changing your targets for
  'Affordable Housing Delivery' will immediately impact the values displayed
  in this graph.
`;

// TODO: already have a getFilteredData function for the other charts, why this one too?

interface GetFilteredDataArgs {
  data: AffordableHousingData;
  year: number;
}

const getFilteredData = ({
  data,
  year,
}: GetFilteredDataArgs): AffordableHousingData => {
  const currentYearObject = data.find(({ startYear }) => startYear === year)!;

  const index = data.indexOf(currentYearObject);
  return data.slice(index - 4, index + 1);
};

interface GetPairedDataArgs {
  data: AffordableHousingData;
  targetDataset?: Targets[TargetCategory];
}

interface GetPairedDataReturnValue {
  pairedData: AffordableHousingData;
  pairedTargets: Targets[TargetCategory];
}

const getPairedData = ({ data, targetDataset }: GetPairedDataArgs) =>
  data.reduce(
    (acc: GetPairedDataReturnValue, cur) => {
      const currentYear = cur.startYear;

      const noPair =
        !cur['Affordable Housing'] || !targetDataset?.[currentYear];

      /**
       * If values for both not present, skip.
       * This is because no pairs will result in empty columns
       */
      return noPair
        ? acc
        : {
            pairedData: [...acc.pairedData, cur],
            pairedTargets: {
              ...acc.pairedTargets,
              [currentYear]: targetDataset[currentYear],
            },
          };
    },
    { pairedData: [], pairedTargets: {} },
  );

const thisYear = new Date().getFullYear();

interface Props {
  data: AffordableHousingData;
  targets: Targets;
  settings: Settings;
  updateOrbState: (orbState: UpdateOrbStateArgs) => void;
}

const AffordableHousingDelivery = ({
  data,
  targets,
  settings,
  updateOrbState,
}: Props) => {
  const { chartColors } = useChartTheme();

  const targetDataset = targets?.affordableHousingDelivery,
    affordableHousingTotalYear =
      settings?.affordableHousingTotalYear ?? thisYear;

  const legendData = [
    {
      name: '% affordable housing delivered out of yearly target',
      color: chartColors.affordableHousingDelivery[0],
    },
  ];

  /** collects from data/targets with matching years, filters out rest */
  const { pairedData, pairedTargets } = getPairedData({
    data,
    targetDataset,
  });

  const timeline = getDataTimeline({
    apiData: pairedData,
    targets: pairedTargets,
  });

  const transformedData = useMemo(
    () =>
      affordableHousingTransformer({
        apiData: pairedData,
        targets: pairedTargets,
        timeline,
      }),
    [pairedData, pairedTargets, timeline],
  );

  const handleYearSelect = useCallback(
    (settings: Settings) => updateOrbState({ settings }),
    [updateOrbState],
  );

  /** initialisation/reset for affordable housing chart */
  useEffect(() => {
    const shouldNotUpdate =
      !timeline?.length || timeline.includes(affordableHousingTotalYear);

    if (shouldNotUpdate) return;

    /** sets filter to most recent available year in timeline */
    const mostRecentYear = timeline[timeline.length - 1];

    updateOrbState({
      settings: { affordableHousingTotalYear: mostRecentYear },
    });
  }, [affordableHousingTotalYear, timeline, handleYearSelect, updateOrbState]);

  return (
    <ChartWrapper info={info} title="Affordable Housing Delivery (%)">
      <StyledParentSize>
        {({ width }: { width: number }) => {
          const filteredData = getFilteredData({
            data: transformedData,
            year: affordableHousingTotalYear,
          });

          const allValues = filteredData.map(
              (item) => item['Affordable Housing'],
            ),
            maxValue = Math.max(...allValues),
            y = [0, maxValue > 100 ? maxValue : 100] as DomainTuple;

          const sharedProps = {
            data: filteredData,
            x: 'startYear',
            y: 'Affordable Housing',
            domain: { y },
          };

          return !!filteredData ? (
            <>
              <CustomDateRange
                timeline={timeline}
                value={affordableHousingTotalYear}
                onSelect={(year: number) =>
                  updateOrbState({
                    settings: { affordableHousingTotalYear: year },
                  })
                }
              />
              <CustomLegend padTop apiData={legendData} width={width} />
              <BaseChart
                financialYearFormat
                width={width}
                xLabel="Financial Year"
                yLabel="Affordable Housing %"
              >
                <VictoryGroup>
                  <VictoryLine {...sharedProps} style={yellowStyle} />
                  <VictoryScatter
                    labelComponent={FlyoutTooltip()}
                    {...sharedProps}
                    labels={({ datum: { _y } }) => `${_y}%`}
                    style={yellowStyle}
                  />
                </VictoryGroup>
              </BaseChart>
            </>
          ) : (
            <Grid
              container
              alignItems="center"
              justifyContent="space-around"
              style={{ height: '12rem' }}
            >
              <Typography variant="h4">
                {Object.keys(targetDataset ?? {}).length
                  ? 'No matching data for provided targets.'
                  : 'Please enter affordable housing delivery targets.'}
              </Typography>
            </Grid>
          );
        }}
      </StyledParentSize>
    </ChartWrapper>
  );
};

export default AffordableHousingDelivery;

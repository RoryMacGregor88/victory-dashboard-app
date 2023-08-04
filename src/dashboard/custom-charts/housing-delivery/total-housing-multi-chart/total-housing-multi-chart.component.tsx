import { useMemo } from 'react';

import { darken } from '@material-ui/core';
import { VictoryBar, VictoryGroup, VictoryLine, VictoryScatter } from 'victory';

import { FlyoutTooltip, StyledParentSize } from '~/components';
import {
  DEFAULT_TARGET_COLOR,
  TARGET_LEGEND_DATA,
  TENURE_DATA_TYPES,
} from '~/constants';
import { BaseChart } from '~/dashboard/charts';
import { totalHousingTransformer } from '~/dashboard/custom-charts/housing-delivery/total-housing-multi-chart/total-housing-transformer/total-housing-transformer';
import { pairedWidthCalculator } from '~/dashboard/custom-charts/housing-delivery/utils/utils';
import { CustomLegend } from '~/dashboard/custom-legend/custom-legend.component';
import { useChartTheme } from '~/dashboard/useChartTheme';
import { TotalHousingDeliveryData } from '~/mocks/fixtures';
import { Targets } from '~/types';

interface Props {
  data: TotalHousingDeliveryData;
  targets: Targets;
  timeline: number[];
}

const TotalHousingMultiChart = ({ data, targets, timeline }: Props) => {
  const { chartColors } = useChartTheme();

  const targetDataset = targets.totalHousing;

  /**
   * Transform API/target data to correct data shape, and create a
   * reliable timeline form earliest year to latest year
   */
  const transformerOutput = useMemo(
    () => totalHousingTransformer({ data, targetDataset, timeline }),
    [data, targetDataset, timeline],
  );

  if (!transformerOutput) return null;

  const { transformedData, transformedTargets } = transformerOutput;

  const apiLegendData = Object.values(TENURE_DATA_TYPES).map((type, i) => ({
    name: type,
    color: chartColors.totalHousingDelivery[i],
  }));

  return (
    <StyledParentSize>
      {({ width }: { width: number }) => {
        /** props for histogram chart (data) */
        const { barWidth, offset } = pairedWidthCalculator({
          data: transformedData,
          width,
        });

        /** props for line chart (targets) */
        const color = DEFAULT_TARGET_COLOR,
          scatterWidth = width / 2;

        return (
          <>
            <CustomLegend
              apiData={apiLegendData}
              targetData={!!transformedTargets ? TARGET_LEGEND_DATA : null}
              width={width}
            />
            <BaseChart
              financialYearFormat
              width={width}
              xLabel="Financial Year"
              yLabel="Housing Delivery in Units"
            >
              <VictoryGroup offset={offset}>
                {transformedData.map((arr, i) => {
                  // TODO: new react hook here?
                  const key = arr[i].x;
                  return (
                    <VictoryBar
                      key={key}
                      data={arr}
                      labelComponent={FlyoutTooltip()}
                      labels={({ datum: { _y } }) => `${_y}`}
                      style={{
                        data: {
                          fill: chartColors.totalHousingDelivery[i],
                          width: barWidth,
                        },
                      }}
                    />
                  );
                })}
              </VictoryGroup>

              {!!transformedTargets ? (
                <VictoryGroup>
                  <VictoryScatter
                    data={transformedTargets}
                    labelComponent={FlyoutTooltip()}
                    labels={({ datum: { _y } }) => `Total: ${_y}`}
                    style={{
                      data: {
                        stroke: darken(color, 0.2),
                        width: scatterWidth,
                        fill: color,
                      },
                    }}
                  />
                  <VictoryLine
                    data={transformedTargets}
                    style={{ data: { stroke: color } }}
                  />
                </VictoryGroup>
              ) : null}
            </BaseChart>
          </>
        );
      }}
    </StyledParentSize>
  );
};

export default TotalHousingMultiChart;

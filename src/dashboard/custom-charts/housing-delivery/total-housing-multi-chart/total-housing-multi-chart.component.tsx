import { useMemo } from 'react';

import { darken } from '@material-ui/core';

import { VictoryGroup, VictoryBar, VictoryLine, VictoryScatter } from 'victory';

import { BaseChart } from '../../../charts/base-chart/base-chart.component';
import { StyledParentSize } from '../../../../components';
import { useChartTheme } from '../../../../dashboard/useChartTheme';
import { pairedWidthCalculator } from '../utils/utils';
import FlyoutTooltip from '../../../FlyoutTooltip';
import { CustomLegend } from '../../../custom-legend/custom-legend.component';
import {
  TENURE_DATA_TYPES,
  TARGET_LEGEND_DATA,
  DEFAULT_TARGET_COLOR,
} from '../../../../constants';

import { totalHousingTransformer } from './total-housing-transformer/total-housing-transformer';
import { TotalHousingDeliveryData } from '../../../../mocks/fixtures';
import { Targets } from '../../../../types';

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
    [data, targetDataset, timeline]
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
              width={width}
              yLabel='Housing Delivery in Units'
              xLabel='Financial Year'
              financialYearFormat
            >
              <VictoryGroup offset={offset}>
                {transformedData.map((arr, i) => {
                  const key = arr[i].x;
                  return (
                    <VictoryBar
                      key={key}
                      data={arr}
                      labels={({ datum: { _y } }) => `${_y}`}
                      labelComponent={FlyoutTooltip()}
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

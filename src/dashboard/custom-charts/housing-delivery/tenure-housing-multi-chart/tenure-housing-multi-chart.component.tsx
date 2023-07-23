import { darken } from '@material-ui/core';

import {
  VictoryBar,
  VictoryStack,
  VictoryGroup,
  VictoryLine,
  VictoryScatter,
} from 'victory';

import { BaseChart } from '../../../charts/base-chart/base-chart.component';
import { StyledParentSize } from '../../../charts/styled-parent-size.component';
import { useChartTheme } from '../../../useChartTheme';
import FlyoutTooltip from '../../../FlyoutTooltip';
import { getStackDatumTotal } from '../../../utils/utils';
import { CustomLegend } from '../../../custom-legend/custom-legend.component';
import {
  DEFAULT_TARGET_COLOR,
  TARGET_LEGEND_DATA,
  housingTenureTypes,
} from '../../../../constants';

import { tenureHousingTransformer } from './tenure-housing-transformer/tenure-housing-transformer';
import { useMemo } from 'react';
import { TenureTypeHousingData } from '../../../../mocks/fixtures';
import { TargetCategory, Targets, TenureCategory } from '../../../../types';

interface Props {
  apiData: Partial<TenureTypeHousingData>;
  targets: Targets[TargetCategory];
  tenureCategory?: TenureCategory;
  timeline: number[];
}

const TenureHousingMultiChart = ({
  apiData,
  targets,
  tenureCategory,
  timeline,
}: Props) => {
  const { tenureStackColors } = useChartTheme();

  const transformerOutput = useMemo(
    () => tenureHousingTransformer({ apiData, targets, timeline }),
    [apiData, targets, timeline]
  );

  if (!transformerOutput) return null;

  const { transformedData, transformedTargets } = transformerOutput;

  const housingTenureRanges = Object.values(housingTenureTypes);

  const legendData = Object.entries(housingTenureTypes).map(([key, value]) => ({
    name: value,
    color: tenureStackColors[key],
  }));

  return (
    <StyledParentSize>
      {({ width }: { width: number }) => {
        const barWidth = width / 20;

        const ranges = !!tenureCategory
          ? [housingTenureTypes[tenureCategory]]
          : housingTenureRanges;

        const colorScale = !!tenureCategory
          ? [tenureStackColors[tenureCategory]]
          : Object.values(tenureStackColors);

        const color = DEFAULT_TARGET_COLOR,
          scatterWidth = width / 2;

        return (
          <>
            <CustomLegend
              apiData={legendData}
              targetData={transformedTargets ? TARGET_LEGEND_DATA : null}
              width={width}
              padTop
            />
            <BaseChart
              width={width}
              yLabel='Housing Delivery in Units'
              xLabel='Financial Year'
              financialYearFormat
            >
              <VictoryStack colorScale={colorScale}>
                {ranges?.map((range) => (
                  <VictoryBar
                    key={range}
                    data={transformedData}
                    x='startYear'
                    y={range}
                    labels={({ datum }) =>
                      getStackDatumTotal({ datum, ranges })
                    }
                    labelComponent={FlyoutTooltip()}
                    style={{ data: { width: barWidth } }}
                  />
                ))}
              </VictoryStack>

              {!!transformedTargets ? (
                <VictoryGroup>
                  <VictoryScatter
                    data={transformedTargets}
                    x='x'
                    y='y'
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
                    x='x'
                    y='y'
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

export default TenureHousingMultiChart;

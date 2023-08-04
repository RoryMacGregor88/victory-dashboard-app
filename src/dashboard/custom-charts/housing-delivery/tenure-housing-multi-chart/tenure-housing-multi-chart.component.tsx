import { useMemo } from 'react';

import { darken } from '@material-ui/core';
import {
  VictoryBar,
  VictoryGroup,
  VictoryLine,
  VictoryScatter,
  VictoryStack,
} from 'victory';

import { FlyoutTooltip, StyledParentSize } from '~/components';
import {
  DEFAULT_TARGET_COLOR,
  TARGET_LEGEND_DATA,
  housingTenureTypes,
} from '~/constants';
import { BaseChart } from '~/dashboard/charts';
import { tenureHousingTransformer } from '~/dashboard/custom-charts/housing-delivery/tenure-housing-multi-chart/tenure-housing-transformer/tenure-housing-transformer';
import { CustomLegend } from '~/dashboard/custom-legend/custom-legend.component';
import { useChartTheme } from '~/dashboard/useChartTheme';
import { getStackDatumTotal } from '~/dashboard/utils/utils';
import { TenureTypeHousingData } from '~/mocks/fixtures';
import { TargetCategory, Targets, TenureCategory } from '~/types';

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
    [apiData, targets, timeline],
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
              padTop
              apiData={legendData}
              targetData={!!transformedTargets ? TARGET_LEGEND_DATA : null}
              width={width}
            />
            <BaseChart
              financialYearFormat
              width={width}
              xLabel="Financial Year"
              yLabel="Housing Delivery in Units"
            >
              <VictoryStack colorScale={colorScale}>
                {ranges?.map((range) => (
                  <VictoryBar
                    key={range}
                    data={transformedData}
                    labelComponent={FlyoutTooltip()}
                    labels={({ datum }) =>
                      getStackDatumTotal({ datum, ranges })
                    }
                    style={{ data: { width: barWidth } }}
                    x="startYear"
                    y={range}
                  />
                ))}
              </VictoryStack>

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
                    x="x"
                    y="y"
                  />
                  <VictoryLine
                    data={transformedTargets}
                    style={{ data: { stroke: color } }}
                    x="x"
                    y="y"
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

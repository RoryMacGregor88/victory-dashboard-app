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
import { getStackDatumTotal } from '../../../tooltip-utils/tooltips-utils';
import { WalthamCustomLegend } from '../../../custom-legend/custom-legend.component';
import { TARGET_LEGEND_DATA, housingTenureTypes } from '../../../../constants';

import { tenureHousingTransformer } from './tenure-housing-transformer/tenure-housing-transformer';
import { useMemo } from 'react';

/**
 * @param {{
 *  apiData: any[]
 *  userTargetData: any[]
 *  tenureType: string
 *  filteredTimeline: number[]
 * }} props
 */
const TenureHousingMultiChart = ({
  apiData,
  userTargetData,
  tenureType,
  filteredTimeline,
}) => {
  const { tenureStackColors } = useChartTheme();

  const transformerOutput = useMemo(
    () => tenureHousingTransformer(apiData, userTargetData, filteredTimeline),
    [apiData, userTargetData, filteredTimeline]
  );

  if (!transformerOutput) return null;

  const { transformedData, transformedTargets } = transformerOutput;

  const housingTenureRanges = Object.values(housingTenureTypes);

  const apiLegendData = Object.entries(housingTenureTypes).map(
    ([key, value]) => ({
      name: value,
      color: tenureStackColors[key],
    })
  );

  const TenureHousingStackChart = ({ width }) => {
    const barWidth = width / 20;

    const ranges = tenureType
      ? [housingTenureTypes[tenureType]]
      : housingTenureRanges;

    const colorScale = tenureType
      ? [tenureStackColors[tenureType]]
      : Object.values(tenureStackColors);

    return (
      <VictoryStack colorScale={colorScale}>
        {ranges?.map((range) => (
          <VictoryBar
            key={range}
            data={transformedData}
            x='startYear'
            y={range}
            labels={({ datum }) => getStackDatumTotal(datum, ranges)}
            labelComponent={FlyoutTooltip()}
            style={{ data: { width: barWidth } }}
          />
        ))}
      </VictoryStack>
    );
  };

  const TargetsLineChart = ({ width }) => {
    const color = '#d13aff',
      scatterWidth = width / 2,
      props = {
        data: transformedTargets,
        x: 'x',
        y: 'y',
      };
    return (
      <VictoryGroup>
        <VictoryScatter
          {...props}
          labelComponent={FlyoutTooltip()}
          labels={({ datum }) => `Total: ${datum._y}`}
          style={{
            data: {
              stroke: darken(color, 0.2),
              width: scatterWidth,
              fill: color,
            },
          }}
        />
        <VictoryLine {...props} style={{ data: { stroke: color } }} />
      </VictoryGroup>
    );
  };

  return (
    <StyledParentSize>
      {({ width }) => (
        <>
          <WalthamCustomLegend
            apiLegendData={apiLegendData}
            targetLegendData={transformedTargets ? TARGET_LEGEND_DATA : null}
            width={width}
            padTop
          />
          <BaseChart
            width={width}
            yLabel='Housing Delivery in Units'
            xLabel='Financial Year'
            financialYearFormat
          >
            {TenureHousingStackChart({ width })}
            {transformedTargets ? TargetsLineChart({ width }) : null}
          </BaseChart>
        </>
      )}
    </StyledParentSize>
  );
};

export { TenureHousingMultiChart };

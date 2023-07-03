import { darken } from '@material-ui/core';

import { VictoryLine, VictoryScatter, VictoryGroup } from 'victory';

import { useChartTheme } from '../../useChartTheme';
import { BaseChart } from '../base-chart/base-chart.component';

/**
 * @param {{
 *  xLabel?: string
 *  yLabel?: string
 *  x: string
 *  ranges: string[]
 *  data: any[]
 * }} props
 */
const LineChart = ({
  xLabel = '',
  yLabel = '',
  x = 'x',
  ranges = ['y'],
  data,
}) => {
  const chartTheme = useChartTheme();

  const renderLineChart = (width) => {
    return ranges?.map((range, i) => {
      const color = chartTheme.colors[i % chartTheme.colors.length],
        scatterWidth = width / 2,
        props = {
          data,
          x,
          y: range,
        };
      return (
        <VictoryGroup key={range}>
          <VictoryLine {...props} style={{ data: { stroke: color } }} />
          <VictoryScatter
            {...props}
            style={{
              data: {
                stroke: darken(color, 0.2),
                width: scatterWidth,
                fill: color,
              },
            }}
          />
        </VictoryGroup>
      );
    });
  };

  return (
    <BaseChart xLabel={xLabel} yLabel={yLabel} renderChart={renderLineChart} />
  );
};

export { LineChart };

import { VictoryBar, VictoryGroup } from 'victory';

import { useChartTheme } from '../../useChartTheme';
import { GroupedWidthCalculator } from '../../utils';
import { BaseChart } from '../base-chart/base-chart.component';

// TODO: how many of these charts are not bieng used, check them all

/**
 * @param {{
 * xLabel?: string
 * yLabel?: string
 * data: any[]
 * }} props
 */
const GroupedBarChart = ({ xLabel = '', yLabel = '', data }) => {
  const chartTheme = useChartTheme();

  if (!data) return null;

  const renderGroupedBarChart = (width) => {
    const { barWidth, offset } = GroupedWidthCalculator(data, width);

    return (
      <VictoryGroup offset={offset}>
        {data?.map((arr, i) => (
          <VictoryBar
            // eslint-disable-next-line react/no-array-index-key
            key={`dataset-${i}`}
            data={arr}
            style={{
              data: { fill: chartTheme.colors[i], width: barWidth },
            }}
          />
        ))}
      </VictoryGroup>
    );
  };

  return (
    <BaseChart
      xLabel={xLabel}
      yLabel={yLabel}
      renderChart={renderGroupedBarChart}
    />
  );
};

export { GroupedBarChart };

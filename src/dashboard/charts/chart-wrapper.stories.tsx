// import { ToggleButtonGroup, ToggleButton } from '@astrosat/astrosat-ui';

import { VictoryLegend, VictoryChart } from 'victory';

import { DateRangeFilter } from 'map/orbs/components/date-range-filter/date-range-filter.component';

import * as data from '../mock-data/waltham-forest/mock_approvals_granted';
import { useChartTheme } from '../useChartTheme';
import { ChartWrapper } from './chart-wrapper.component';
import { LineChart } from './line-chart/line-chart.component';

export default {
  title: '~/dashboard/Charts/ChartWrapper',
};

const Template = (args) => {
  const chartTheme = useChartTheme();
  return (
    <ChartWrapper
      title='No. of housing approvals granted over time'
      info='This shows the number of housing approvals granted over time'
    >
      <div>
        <LineChart {...args} />;
      </div>
    </ChartWrapper>
  );
};

export const Default = Template.bind({});
Default.args = {
  data: data.properties.find((p) => p.name === 'Monthly').data,
  x: 'Month',
  ranges: ['2019', '2020'],
  xLabel: 'Year',
  yLabel: 'Data Property Name / Unit',
};

import React from 'react';

import * as data from '../../mock-data/waltham-forest/mock_target_progress';
import { useChartTheme } from '../../useChartTheme';
import { ProgressIndicatorChart } from './progress-indicator-chart.component';

export default {
  title: '~/dashboard/Charts/Progress Indicator Chart',
};

const Template = ({ properties }) => {
  const chartTheme = useChartTheme();
  return properties.map((property, i) => (
    <ProgressIndicatorChart
      key={property.name}
      property={property}
      color={chartTheme.colors[i]}
    />
  ));
};

export const Default = Template.bind({});
Default.args = {
  properties: data.properties,
};

export const NoProgressOrTarget = Template.bind({});
NoProgressOrTarget.args = {
  properties: data.properties.map((p) => ({
    ...p,
    progress: undefined,
    target: undefined,
  })),
};

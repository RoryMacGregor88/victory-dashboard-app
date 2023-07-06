import { BaseChart } from './base-chart.component';

export default {
  title: '~/dashboard/Charts/Base Chart',
};

const Template = (args) => {
  return <BaseChart {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  xLabel: 'Financial Year',
  yLabel: 'Affordable Housing %age',
  renderChart: () => {},
};

import { GaugeChart } from './gauge.component';

export default {
  title: '~/dashboard/Charts/Gauge Chart',
};

const Template = (args) => {
  return <GaugeChart {...args} />;
};

export const Default = Template.bind({});
Default.args = {};

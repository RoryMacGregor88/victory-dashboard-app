import { StackedBarChart } from './stacked-bar-chart.component';

const data = [
  {
    Year: 2014,
    'Ahead of Schedule': 108,
    'Behind Schedule': 385,
    'On Track': 252,
  },
  {
    Year: 2015,
    'Ahead of Schedule': 90,
    'Behind Schedule': 134,
    'On Track': 67,
  },
  {
    Year: 2016,
    'Ahead of Schedule': 335,
    'Behind Schedule': 266,
    'On Track': 165,
  },
  {
    Year: 2017,
    'Ahead of Schedule': 389,
    'Behind Schedule': 221,
    'On Track': 124,
  },
  {
    Year: 2018,
    'Ahead of Schedule': 53,
    'Behind Schedule': 74,
    'On Track': 336,
  },
  {
    Year: 2019,
    'Ahead of Schedule': 260,
    'Behind Schedule': 174,
    'On Track': 322,
  },
  {
    Year: 2020,
    'Ahead of Schedule': 160,
    'Behind Schedule': 346,
    'On Track': 256,
  },
  {
    Year: 2021,
    'Ahead of Schedule': 159,
    'Behind Schedule': 259,
    'On Track': 251,
  },
];

export default { title: '~/dashboard/Charts/StackedBarChart' };

const Template = (args) => <StackedBarChart {...args} />;

export const Default = Template.bind({});
Default.args = {
  data,
  xLabel: 'Financial Year',
  yLabel:
    'Mock Data for Progression of Units Relating to Planning Schedule Graph',
  ranges: ['Ahead of Schedule', 'Behind Schedule', 'On Track'],
  x: 'Year',
};

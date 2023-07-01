import React from 'react';

import { LineChart } from './line-chart.component';

const data = [
  {
    Month: 'Jan',
    '2019': 543,
    '2020': 909,
    '2021': 807,
  },
  {
    Month: 'Feb',
    '2019': 664,
    '2020': 578,
    '2021': 931,
  },
  {
    Month: 'Mar',
    '2019': 980,
    '2020': 865,
    '2021': 846,
  },
  {
    Month: 'Apr',
    '2019': 694,
    '2020': 662,
    '2021': 765,
  },
  {
    Month: 'May',
    '2019': 965,
    '2020': 709,
    '2021': 949,
  },
  {
    Month: 'Jun',
    '2019': 887,
    '2020': 995,
    '2021': 847,
  },
  {
    Month: 'Jul',
    '2019': 681,
    '2020': 415,
    '2021': 897,
  },
  {
    Month: 'Aug',
    '2019': 522,
    '2020': 484,
    '2021': 602,
  },
  {
    Month: 'Sep',
    '2019': 601,
    '2020': 904,
    '2021': 655,
  },
  {
    Month: 'Oct',
    '2019': 489,
    '2020': 488,
    '2021': 848,
  },
];

export default {
  title: '~/dashboard/Charts/Line Chart',
};

const Template = (args) => {
  return <LineChart {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  data,
  x: 'Month',
  ranges: ['2019', '2020', '2021'],
};

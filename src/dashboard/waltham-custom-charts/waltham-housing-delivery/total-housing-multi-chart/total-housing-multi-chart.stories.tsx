import { groupedApiData } from '../story-data';
import { TotalHousingMultiChart } from './total-housing-multi-chart.component';

const userTargetData = [
  { x: '2014-2015', y: 510 },
  { x: '2015-2016', y: 390 },
  { x: '2016-2017', y: 490 },
  { x: '2017-2018', y: 275 },
  { x: '2018-2019', y: 560 },
  { x: '2019-2020', y: 452 },
  { x: '2020-2021', y: 120 },
];

export default {
  title:
    '~/dashboard/Waltham Forest/Charts/HousingDelivery/TotalHousingMultiChart',
};

const Template = (args) => <TotalHousingMultiChart {...args} />;

export const Default = Template.bind({});
Default.args = {
  apiData: groupedApiData,
  userTargetData,
};

export const NoTargetData = Template.bind({});
NoTargetData.args = {
  apiData: groupedApiData,
};

export const BigDataRange = Template.bind({});
BigDataRange.args = {
  apiData: groupedApiData,
  userTargetData: [
    { x: '2014-2015', y: 3620 },
    { x: '2015-2016', y: 3460 },
    { x: '2016-2017', y: 3490 },
    { x: '2017-2018', y: 3275 },
    { x: '2018-2019', y: 3560 },
    { x: '2019-2020', y: 3452 },
    { x: '2020-2021', y: 3120 },
  ],
};

export const MissingValues = Template.bind({});
MissingValues.args = {
  apiData: groupedApiData,
  userTargetData: [
    { x: '2014-2015', y: 620 },
    { x: '2016-2017', y: 490 },
    { x: '2018-2019', y: 560 },
    { x: '2020-2021', y: 120 },
  ],
};

import { groupedApiData, stackedApiData } from './story-data';
import { WalthamHousingDelivery } from './waltham-housing-delivery.component';

const userTargetData = {
  '2014-2015': '510',
  '2015-2016': '390',
  '2016-2017': '490',
  '2017-2018': '275',
  '2018-2019': '560',
  '2019-2020': '452',
  '2020-2021': '120',
};

export default {
  title:
    '~/dashboard/Waltham Forest/Charts/HousingDelivery/WalthamHousingDelivery',
};

const userOrbState = {
  marketHousing: userTargetData,
  totalHousing: userTargetData,
};

const Template = (args) => <WalthamHousingDelivery {...args} />;

export const Default = Template.bind({});
Default.args = {
  totalHousingDeliveryChartData: groupedApiData,
  tenureHousingDeliveryChartData: stackedApiData,
  userOrbState,
};

export const NoTargetData = Template.bind({});
NoTargetData.args = {
  ...Default.args,
  userOrbState: undefined,
};

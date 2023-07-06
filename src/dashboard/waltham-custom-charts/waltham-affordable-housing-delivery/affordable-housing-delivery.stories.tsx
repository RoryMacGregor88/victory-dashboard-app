import * as data from '~/dashboard/mock-data/waltham-forest/mock_affordable_housing';

import { AfforableHousingDelivery } from './affordable-housing-delivery.component';

export default {
  title: '~/dashboard/Waltham Forest/Charts/Affordable Housing Delivery',
};

const Template = ({ data, ...props }) => {
  return <AfforableHousingDelivery {...props} data={data} />;
};

export const Default = Template.bind({});
Default.args = {
  data: data.properties,
  x: 'year',
  ranges: ['Affordable Housing'],
  xLabel: 'Year',
  yLabel: 'Affordable Housing %',
};

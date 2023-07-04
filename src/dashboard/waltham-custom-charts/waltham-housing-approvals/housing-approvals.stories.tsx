import React from 'react';

import * as data from '~/dashboard/mock-data/waltham-forest/mock_approvals_granted';

import { HousingApprovalsComponent } from './housing-approvals.component';

export default {
  title: '~/dashboard/Waltham Forest/Charts/Housing Approvals',
};

const Template = ({ data, ...props }) => {
  return <HousingApprovalsComponent {...props} data={data} />;
};

export const Default = Template.bind({});
Default.args = {
  data: data.properties,
  x: 'Month',
  ranges: ['2019', '2020'],
  xLabel: 'Year',
  yLabel: 'No. Housing Approvals Granted',
};

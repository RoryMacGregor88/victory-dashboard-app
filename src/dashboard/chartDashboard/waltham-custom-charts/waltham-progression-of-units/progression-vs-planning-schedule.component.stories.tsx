import React from 'react';

import * as MOCK_DATA from './mock-data';
import ProgressionVsPlanningSchedule from './progression-vs-planning-schedule.component';

export default {
  title: '~/dashboard/Waltham Forest/Charts/Progression vs Planning',
  args: {
    data: MOCK_DATA,
  },
};

const Template = (args) => <ProgressionVsPlanningSchedule {...args} />;

export const Default = Template.bind({});

import DeliverableSupplySummary from './deliverable-supply-summary.component';
import * as MOCK_DATA from './mock-data';

export default {
  title: '~/dashboard/Waltham Forest/Charts/Deliverable Supply Summary',
  args: {
    data: MOCK_DATA,
  },
};

const Template = (args) => <DeliverableSupplySummary {...args} />;

export const Default = Template.bind({});

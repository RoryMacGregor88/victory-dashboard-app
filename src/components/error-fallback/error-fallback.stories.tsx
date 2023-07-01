import React from 'react';

import { ErrorFallback } from './error-fallback.component';

export default {
  title: 'Components/ErrorFallback',
  component: ErrorFallback,
  args: { messageOnly: false },
  argTypes: { resetErrorBoundary: { action: true } },
};

const Template = args => <ErrorFallback {...args} />;

export const Default = Template.bind({});
Default.args = {
  error: new Error('Something broke'),
};

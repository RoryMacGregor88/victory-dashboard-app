import { render } from '../../../test/test.utils';

import { LineChart } from './line-chart.component';

const TEST_SOURCE = new Array(10).fill(undefined).map((_, i) => ({
  value: i,
  square: i * i,
  exponent: i ** i,
  sum: i + i,
}));

const args = {
  data: TEST_SOURCE,
  x: 'value',
  ranges: ['value', 'square', 'sum'],
  xLabel: 'Financial Year',
  yabel: 'Affordable Housing %age',
};

describe('Line Chart', () => {
  it('renders', () => {
    const { getByText } = render(<LineChart {...args} />);
    expect(getByText('Financial Year')).toBeInTheDocument();
  });
});

import { describe, it } from 'vitest';

import { render, screen } from '../../../../test/test.utils';

import CenterDisplay from './center-display.component';

describe('CenterDisplay', () => {
  it('renders a percentage value and target text', () => {
    render(CenterDisplay({ percentage: 25, target: 100 }));

    expect(screen.getByText('25%')).toBeInTheDocument();
    expect(screen.getByText('Target 100 Units')).toBeInTheDocument();
  });

  it('displays error state when no percentage provided', () => {
    render(
      CenterDisplay({
        percentage: null,
        target: 100,
        name: 'Test Name',
      })
    );

    expect(screen.getByText('Test Name Target Required')).toBeInTheDocument();
  });
});

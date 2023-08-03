import { describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent } from '~/test/test.utils';

import { CustomDateRange } from './custom-date-range.component';

const testTimeline = [2010, 2011, 2012, 2013, 2014, 2015, 2016];

let onSelect = null;

describe('CustomDateRange', () => {
  beforeEach(() => {
    onSelect = vi.fn();
  });

  it('renders options in 5-year intervals', () => {
    render(
      <CustomDateRange
        timeline={testTimeline}
        value={2016}
        onSelect={onSelect}
      />,
    );

    expect(
      screen.getByRole('button', { name: '2012-2013 - 2016-2017' }),
    ).toBeInTheDocument();
  });

  it('selects when onChange called', async () => {
    render(
      <CustomDateRange
        timeline={testTimeline}
        value={2016}
        onSelect={onSelect}
      />,
    );

    await userEvent.click(
      screen.getByRole('button', { name: '2012-2013 - 2016-2017' }),
    );

    await userEvent.click(
      screen.getByRole('option', { name: '2011-2012 - 2015-2016' }),
    );

    expect(onSelect).toHaveBeenCalledWith(2015);
  });

  it('filters entries out with no 5-year range', async () => {
    render(
      <CustomDateRange
        timeline={testTimeline}
        value={2016}
        onSelect={onSelect}
      />,
    );

    await userEvent.click(
      screen.getByRole('button', { name: '2012-2013 - 2016-2017' }),
    );

    [
      '2010-2011 - 2014-2015',
      '2011-2012 - 2015-2016',
      '2012-2013 - 2016-2017',
    ].forEach((option) => {
      expect(screen.getByRole('option', { name: option })).toBeInTheDocument();
    });
  });
});

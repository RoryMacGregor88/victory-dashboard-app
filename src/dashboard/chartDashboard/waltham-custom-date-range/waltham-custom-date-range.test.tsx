import React from 'react';

import { it, expect, describe, vi } from 'vitest';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { WalthamCustomDateRange } from './waltham-custom-date-range.component';

const testTimeline = [2010, 2011, 2012, 2013, 2014, 2015, 2016],
  onSelect = vi.fn();

const setup = () =>
  render(
    <WalthamCustomDateRange
      timeline={testTimeline}
      value={2016}
      onSelect={onSelect}
    />
  );

describe('WalthamCustomDateRange', () => {
  it('renders options in 5-year intervals', () => {
    setup();

    expect(
      screen.getByRole('button', { name: '2012-2013 - 2016-2017' })
    ).toBeInTheDocument();
  });

  it('selects when onChange called', () => {
    setup();

    userEvent.click(
      screen.getByRole('button', { name: '2012-2013 - 2016-2017' })
    );
    userEvent.click(
      screen.getByRole('option', { name: '2011-2012 - 2015-2016' })
    );

    expect(onSelect).toHaveBeenCalledWith(2015);
  });

  it('filters entries out with no 5-year range', () => {
    setup();

    userEvent.click(
      screen.getByRole('button', { name: '2012-2013 - 2016-2017' })
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

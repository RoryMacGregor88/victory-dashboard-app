import React from 'react';

import { it, expect, describe } from 'vitest';

import { render, screen } from 'test/test-utils';

import * as mockData from './mock-data';
import ProgressionVsPlanningSchedule from './progression-vs-planning-schedule.component';

const data = mockData.properties[0].data;

describe('Progression vs Planning Schedule', () => {
  it('should display chart on screen', () => {
    render(<ProgressionVsPlanningSchedule settings={{}} data={data} />);

    expect(
      screen.getByRole('heading', {
        name: 'Progression of Units Relating to Planning Schedule',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'Info',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', {
        name: 'Info',
      })
    ).toBeInTheDocument();

    expect(screen.getByText('Units Ahead of Schedule')).toBeInTheDocument();
    expect(screen.getByText('Units Behind Schedule')).toBeInTheDocument();
    expect(screen.getByText('Units on Track')).toBeInTheDocument();

    expect(screen.getByText('Financial Year')).toBeInTheDocument();
    expect(screen.getByText('Number Of Units')).toBeInTheDocument();
  });
});

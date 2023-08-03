import { describe, expect, it } from 'vitest';

import mockData from '~/mocks/fixtures/progression_of_units';
import { render, screen } from '~/test/test.utils';

import ProgressionVsPlanningSchedule from './progression-vs-planning-schedule.component';

describe('Progression vs Planning Schedule', () => {
  it('should display chart on screen', () => {
    render(<ProgressionVsPlanningSchedule data={mockData} settings={{}} />);

    expect(
      screen.getByRole('heading', {
        name: 'Progression of Units Relating to Planning Schedule',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: 'Info',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('img', {
        name: 'Info',
      }),
    ).toBeInTheDocument();

    expect(screen.getByText('Units Ahead of Schedule')).toBeInTheDocument();
    expect(screen.getByText('Units Behind Schedule')).toBeInTheDocument();
    expect(screen.getByText('Units on Track')).toBeInTheDocument();

    expect(screen.getByText('Financial Year')).toBeInTheDocument();
    expect(screen.getByText('Number Of Units')).toBeInTheDocument();
  });
});

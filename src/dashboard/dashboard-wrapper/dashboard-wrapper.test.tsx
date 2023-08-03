import { rest } from 'msw';

import { MOCK_USER } from '~/constants';
import { server } from '~/mocks/server';
import { render, screen, waitFor } from '~/test/test.utils';

import { DashboardWrapper } from './dashboard-wrapper.component';

const state = {
  dashboard: {
    mock_source_id: {},
  },
  accounts: {
    user: MOCK_USER,
  },
};

describe('DashboardWrapper', () => {
  it('shows loadmask if all data not loaded', async () => {
    server.use(
      rest.get('*/api/*', (_, res, ctx) => res(ctx.status(200), ctx.json({}))),
    );

    render(<DashboardWrapper />, { state });

    await waitFor(() =>
      expect(screen.getByTestId('loadmask')).toBeInTheDocument(),
    );
  });
});

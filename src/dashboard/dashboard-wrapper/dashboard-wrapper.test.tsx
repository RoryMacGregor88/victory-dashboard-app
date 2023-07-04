import { rest } from 'msw';

import { render, screen, waitFor } from '../../test/test.utils';

import { server } from '../..//mocks/server';

import { DashboardWrapper } from './dashboard-wrapper.component';

const defaultRenderOptions = {
  state: {
    data: {
      sources: [
        {
          source_id: 'some/test/source/1',
          metadata: {
            url: '',
            application: {
              orbis: {
                dashboard_component: {
                  name: 'LBWF Housing Delivery Dashboard',
                },
              },
            },
          },
        },
      ],
    },
  },
};

describe('DashboardWrapper', () => {
  it('renders the dashboard specified in metadata', async () => {
    server.use(
      rest.get('*/api/*', (req, res, ctx) => res(ctx.status(200), ctx.json({})))
    );

    render(<DashboardWrapper />, defaultRenderOptions);

    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: 'LBWF Housing Delivery Dashboard' })
      ).toBeInTheDocument()
    );
  });
});

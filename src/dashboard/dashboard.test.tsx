import React from 'react';

import { render, screen, waitFor } from 'test/test-utils';

import { Dashboard } from './dashboard.component';

const defaultRenderOptions = {
  history: { initialEntries: ['/?source_id=some/test/source/1'] },
  state: {
    data: {
      sources: [
        {
          source_id: 'some/test/source/1',
          metadata: {
            url: '',
            application: {
              orbis: {
                dashboard_component: { name: 'Mock' },
              },
            },
          },
        },
      ],
    },
  },
};

describe('<Dashboard />', () => {
  it('renders the dashboard specified in metadata', async () => {
    render(<Dashboard />, defaultRenderOptions);

    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: 'Mock Dashboard' }),
      ).toBeInTheDocument(),
    );
  });
});

import { setupServer } from 'msw/node';

import handlers from './handlers';

/** This configures a mock server with the given request handlers */
export const server = setupServer(...handlers);

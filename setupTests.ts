import '@testing-library/jest-dom';

import { vi } from 'vitest';

const { ResizeObserver } = window;

/**
 * This is here because the package 'visx' tries
 * to use it to size components and it breaks in tests
 */
beforeAll(() => {
  window.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

afterAll(() => {
  window.ResizeObserver = ResizeObserver;
  vi.restoreAllMocks();
});

// TODO: keep these? Are they needed?
// beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
// afterAll(() => server.close());
// afterEach(() => server.resetHandlers());

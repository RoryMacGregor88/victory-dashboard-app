import { Suspense } from 'react';

import { Box } from '@material-ui/core';

import { ErrorBoundary } from 'react-error-boundary';

import { LoadMaskFallback, ErrorFallback } from '../components';

import ChartDashboard from './chartDashboard/chartDashboardConfig.component';

const SOURCE_ID = 'source_id';

const MOCK_LOCATION = {
  search: `?${SOURCE_ID}=123`,
};

const Dashboard = (): JSX.Element | null => {
  const location = MOCK_LOCATION;
  const searchParams = new URLSearchParams(location.search);
  const sourceId = searchParams.get(SOURCE_ID);

  if (!sourceId) return <LoadMaskFallback />;

  return (
    <Box width='100vw' height='100vh' overflow='hidden' display='flex'>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<LoadMaskFallback />}>
          <ChartDashboard sourceId={sourceId} />
        </Suspense>
      </ErrorBoundary>
    </Box>
  );
};

export { Dashboard };

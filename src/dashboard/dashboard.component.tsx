import { Suspense } from 'react';

import { Box } from '@material-ui/core';

import { ErrorBoundary } from 'react-error-boundary';

import { LoadMaskFallback, ErrorFallback } from '../components';

import ChartDashboard from './chartDashboard/chartDashboardConfig.component';

const SOURCE_ID = 'source_id',
  APPLICATION_ID = 'applictaion_id';

const MOCK_LOCATION = {
  search: `?${SOURCE_ID}=123&${APPLICATION_ID}=456`,
};

const Dashboard = () => {
  const location = MOCK_LOCATION;
  const searchParams = new URLSearchParams(location.search);
  const sourceId = searchParams.get(SOURCE_ID);
  const applicationId = searchParams.get(APPLICATION_ID);

  return (
    <Box width='100vw' height='100vh' overflow='hidden' display='flex'>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<LoadMaskFallback />}>
          <ChartDashboard sourceId={sourceId} applicationId={applicationId} />
        </Suspense>
      </ErrorBoundary>
    </Box>
  );
};

export { Dashboard };

import { LoadMaskFallback } from '../../components';

import { Dashboard } from '../dashboard.component';

const SOURCE_ID = 'mock_source_id';

const MOCK_LOCATION = {
  search: `?${SOURCE_ID}=123`,
};

const DashboardWrapper = (): JSX.Element | null => {
  const location = MOCK_LOCATION;
  const searchParams = new URLSearchParams(location.search);
  const sourceId = searchParams.get(SOURCE_ID);

  if (!sourceId) return <LoadMaskFallback />;

  return <Dashboard sourceId={sourceId} />;
};

export { DashboardWrapper };

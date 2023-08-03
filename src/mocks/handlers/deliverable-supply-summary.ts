import { rest } from 'msw';

import data from '~/mocks/fixtures/deliverable_supply_summary';

const getDeliverableSupplySummaryData = rest.get(
  '*/deliverable_supply_summary/latest/',
  (_, res, ctx) => res(ctx.status(200), ctx.json(data)),
);

export default getDeliverableSupplySummaryData;

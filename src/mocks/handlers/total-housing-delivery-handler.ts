import { rest } from 'msw';

import data from '../fixtures/total_housing_delivery';

const getTotalHousingDeliveryData = rest.get(
  '*/total_housing_delivery/v1/',
  (req, res, ctx) => res(ctx.status(200), ctx.json(data))
);

export { getTotalHousingDeliveryData };
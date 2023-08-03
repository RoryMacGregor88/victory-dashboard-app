import { rest } from 'msw';

import data from '~/mocks/fixtures/affordable_housing_delivery';

const getAffordableHousingDeliveryData = rest.get(
  '*/affordable_housing_delivery/latest/',
  (_, res, ctx) => res(ctx.status(200), ctx.json(data)),
);

export default getAffordableHousingDeliveryData;

import { rest } from 'msw';

import data from '~/mocks/fixtures/tenure_type_housing_delivery';

const getTenureTypeHousingDeliveryData = rest.get(
  '*/tenure_type_housing_delivery/latest/',
  (_, res, ctx) => res(ctx.status(200), ctx.json(data)),
);

export default getTenureTypeHousingDeliveryData;

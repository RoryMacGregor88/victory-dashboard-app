import { rest } from 'msw';

import data from '~/mocks/fixtures/progression_of_units';

const getProgressionOfUnitsData = rest.get(
  '*/progression_of_units/latest/',
  (_, res, ctx) => res(ctx.status(200), ctx.json(data)),
);

export default getProgressionOfUnitsData;

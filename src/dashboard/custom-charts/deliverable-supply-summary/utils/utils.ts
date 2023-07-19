import { DeliverableSupplySummaryData } from '../../../../mocks/fixtures';

export const getStackTotals = (data: DeliverableSupplySummaryData) =>
  data.map((datum) => {
    const total = Object.entries(datum).reduce(
      (acc, [key, value]) => (key === 'startYear' ? acc : acc + value),
      0
    );

    return `Total: ${total}`;
  });

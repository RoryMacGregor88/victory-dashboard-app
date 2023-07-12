/** percentages and style ratios used in progress indicators */
export const MIN_PERCENTAGE = 0;
export const MAX_PERCENTAGE = 100;
export const PERCENT_FONT_DEVISOR = 150;
export const TARGET_FONT_DEVISOR = 400;
export const ERROR_FONT_DEVISOR = 250;

export const PROGRESS_CHART_DATA = {
  totalHousing: {
    title:
      'Total units delivered of housing delivery target for last 5 financial years',
    info: 'The percentage of housing units delivered in the previous 5 years out of the sum of the housing delivery targets for the previous 5 financial years (inc. current year).',
    name: 'Housing Delivery',
  },
  intermediate: {
    title:
      'Intermediate units delivered so far out of current financial year target',
    info: 'The percentage of intermediate housing units delivered in the current financial year so far out of the target for intermediate housing units for the same year.',
    name: 'Intermediate Delivery',
  },
  marketHousing: {
    title: 'Market units delivered so far out of current financial year target',
    info: 'The percentage of market housing units delivered in the current financial year so far out of the target for intermediate housing units for the same year.',
    name: 'Market Housing',
  },
  socialRented: {
    title:
      'Social rented units delivered so far out of current financial year target',
    info: 'The percentage of social rented housing units delivered in the current financial year so far out of the target for intermediate housing units for the same year.',
    name: 'Socially Rented',
  },
};

// TODO: make constants all uppercase

// TODO: move this into types file?
import { User } from './accounts/accounts.slice';
import {
  DatasetName,
  ProgressionVsPlanningCategory,
  TargetCategory,
  TenureCategories,
  TenureDataType,
} from './types';

export const MOCK_USER: User = {
  orb_state: {
    mock_source_id: {
      targets: {
        totalHousing: {
          2023: 350,
          2022: 500,
          2021: 610,
          2020: 480,
          2019: 712,
        },
        intermediateDelivery: {
          2023: 106,
          2022: 80,
          2021: 35,
          2020: 95,
          2019: 61,
        },
        marketHousing: {
          2023: 134,
          2022: 80,
          2021: 35,
          2020: 95,
          2019: 61,
        },
        sociallyRented: {
          2023: 11,
          2022: 80,
          2021: 35,
          2020: 95,
          2019: 61,
        },
        affordableHousingDelivery: {
          2023: 100,
          2022: 80,
          2021: 35,
          2020: 95,
          2019: 61,
          2018: 23,
          2017: 101,
          2016: 43,
          2015: 112,
          2014: 59,
          2013: 65,
        },
        privateRental: {
          2023: 100,
          2022: 80,
          2021: 35,
          2020: 95,
          2019: 61,
        },
      },
      settings: {},
    },
  },
};

export const inputErrorMessage = 'Only number values are permitted.';

export const ALL_TENURE_CATEGORIES = 'All Tenure Types';

export const ALL_PROGRESSION_PLANNING_TYPES = 'Show All';

/** live data tenure types */
export const housingTenureTypes: TenureCategories = {
  affordableHousing: 'Affordable Rent (not at LAR benchmark rents)',
  affordableHousingLondon: 'London Affordable Rent',
  intermediateDelivery: 'Intermediate',
  intermediateOther: 'Intermediate Other',
  marketHousing: 'Market for sale',
  sociallyRented: 'Social Rent',
};

export const progressionVsPlanningCategories: {
  [key in ProgressionVsPlanningCategory]: string;
} = {
  aheadOfSchedule: 'Ahead of Schedule',
  behindSchedule: 'Behind Schedule',
  onTrack: 'On Track',
};

// TODO: fix this if possible
export const progressionVsPlanningPalette: {
  [key: string]: string;
} = {
  'Ahead of Schedule': '#37e5d8',
  'Behind Schedule': '#d6ea69',
  'On Track': '#05c3ff',
};

export const TENURE_DATA_TYPES: { gross: TenureDataType; net: TenureDataType } =
  {
    gross: 'Gross',
    net: 'Net',
  };

export const DEFAULT_TARGET_COLOR = '#d13aff';

export const TARGET_LEGEND_DATA = {
  name: 'Housing Requirement',
  color: DEFAULT_TARGET_COLOR,
};

/** live data */
export const apiMetadata: {
  datasetName: DatasetName;
  url: string;
  apiSourceId: string;
}[] = [
  {
    datasetName: 'tenureHousingDelivery',
    url: '/api/tenure_type_housing_delivery/latest/',
    apiSourceId: 'api/tenure_type_housing_delivery/latest',
  },
  {
    datasetName: 'approvalsGranted',
    url: '/api/housing_approvals_over_time/latest/',
    apiSourceId: 'api/housing_approvals_over_time/latest',
  },
  {
    datasetName: 'progressionVsPlanning',
    url: '/api/progression_of_units/latest/',
    apiSourceId: 'api/progression_of_units/latest',
  },
  {
    datasetName: 'affordableHousingDelivery',
    url: '/api/affordable_housing_delivery/latest/',
    apiSourceId: 'api/affordable_housing_delivery/latest',
  },
  {
    datasetName: 'totalHousingDelivery',
    url: '/api/total_housing_delivery/v1/',
    apiSourceId: 'api/total_housing_delivery/v1',
  },
  {
    datasetName: 'deliverableSupplySummary',
    url: '/api/deliverable_supply_summary/latest/',
    apiSourceId: 'api/deliverable_supply_summary/latest',
  },
];

// TODO: this name is confusing, it's just for the targets
export const targetDatasets: { [key in TargetCategory]: string } = {
  totalHousing: 'Total housing target for each of the last 5 financial years',
  sociallyRented:
    'Social Rented Housing Targets for previous 5 financial years',
  marketHousing: 'Market Housing Targets for previous 5 financial years',
  intermediateDelivery:
    'Intermediate Housing Targets for previous 5 financial years',
  privateRental:
    'Private Rented Housing Targets for previous 5 financial years',
  affordableHousingDelivery:
    'Affordable Housing Targets for previous 10 financial years',
};

export const HOUSING_APPROVAL_DATA_TYPES = {
  monthly: 'Monthly',
  cumulative: 'Cumulative',
};

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

export const deliverableSupplySummaryTypes = [
  'Large Sites - With Planning Permission',
  'Non Self Contained Accomodation With Planning Permission',
  'Windfall Allowance From Small Sites',
  'Sites on the Brownfield Land Site',
];

export const tooltipFlyoutStyle = {
  stroke: 'none',
  fill: '#f6be00',
};

export const yellowStyle = {
  data: { stroke: '#f6be00' },
};

/**
 * start index not included, so must be one less than target number,
 * for example, 5-year range would be 4, like below.
 */
export const DEFAULT_FILTER_RANGE = 4;

/** percentages and style ratios used in WFC progress indicators */
export const MIN_PERCENTAGE = 0;
export const MAX_PERCENTAGE = 100;
export const PERCENT_FONT_DEVISOR = 150;
export const TARGET_FONT_DEVISOR = 400;
export const ERROR_FONT_DEVISOR = 250;

export const MIME_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
export const EXTENSION = '.xlsx';

import { VictoryThemeDefinition } from 'victory';

import {
  AffordableHousingData,
  DeliverableSupplySummaryData,
  HousingApprovalsData,
  ProgressionOfUnitsData,
  TenureTypeHousingData,
  TotalHousingDeliveryData,
} from './mocks/fixtures';

/** Re-usable type declarations */

export type DatasetName =
  | 'totalHousingDelivery'
  | 'tenureHousingDelivery'
  | 'progressionVsPlanning'
  | 'approvalsGranted'
  | 'affordableHousingDelivery'
  | 'deliverableSupplySummary';

export type TenureCategory =
  | 'affordableHousing'
  | 'affordableHousingLondon'
  | 'intermediateDelivery'
  | 'intermediateOther'
  | 'marketHousing'
  | 'sociallyRented';

export type ProgressionVsPlanningCategory =
  | 'aheadOfSchedule'
  | 'behindSchedule'
  | 'onTrack';

export type TargetCategory =
  | 'totalHousing'
  | 'sociallyRented'
  | 'marketHousing'
  | 'intermediateDelivery'
  | 'privateRental'
  | 'affordableHousingDelivery';

export type TenureDataType = 'Gross' | 'Net';

export type ApprovalsGrantedDataType = 'Monthly' | 'Cumulative';

export type Targets = {
  [key in TargetCategory]?: {
    [year: string]: number;
  };
};

export type Settings = {
  tenureCategory?: TenureCategory;
  tenureDataType?: TenureDataType;
  tenureYear?: number;
  totalYear?: number;
  approvalsGrantedDataType?: ApprovalsGrantedDataType;
  progressionVsPlanningCategory?: ProgressionVsPlanningCategory;
  affordableHousingTotalYear?: number;
};

export type UserOrbState = {
  targets: Targets;
  settings: Settings;
};

export type UpdateOrbStateArgs = {
  targets?: Targets;
  settings?: Settings;
};

/** all individual datasets satisfy ChartData type */
export type ChartData = AffordableHousingData &
  HousingApprovalsData &
  ProgressionOfUnitsData &
  TenureTypeHousingData &
  TotalHousingDeliveryData &
  DeliverableSupplySummaryData;

export type ChartMetadata = {
  sourceId: string;
  datasetName: DatasetName;
  url: string;
};

export type LegendData = {
  name: string;
  color: string;
};

export type HousingTenureCategories = { [key in TenureCategory]: string };

export type ProgressIndicatorData = {
  x: number;
  y: number;
}[];

export type ChartColors = { [key in DatasetName]: string[] };

export type ChartTheme = VictoryThemeDefinition & {
  colors: string[];
  chartColors: ChartColors;
  tenureStackColors: { [key: string]: string };
  fontSize: number;
};

/** Re-usable type declarations */

import {
  AffordableHousingData,
  HousingApprovalsData,
  ProgressionOfUnitsData,
  TenureTypeHousingData,
  TotalHousingDeliveryData,
} from './mocks/fixtures';

export type Targets = {
  [datasetName: string]: {
    [year: string]: number;
  };
} | null;

export type Settings = {
  tenureType?: string;
  tenureDataType?: 'Gross' | 'Net';
  tenureYear?: number;
  totalYear?: number;
  approvalsGrantedDataType?: 'Monthly' | 'Cumulative';
} | null;

export type UserOrbState = {
  targets: Targets;
  settings: Settings;
};

/** all individual datasets satisfy ChartData type */
export type ChartData = AffordableHousingData &
  HousingApprovalsData &
  ProgressionOfUnitsData &
  TenureTypeHousingData &
  TotalHousingDeliveryData;

export type ChartMetadata = {
  sourceId: string;
  datasetName: string;
  url: string;
};

export type LegendData = {
  name: string;
  color: string;
};

export type HousingTenureTypes = {
  [tenureType: string]: string;
};

export type TenureDataTypes = {
  gross: 'Gross';
  net: 'Net';
};

export type ProgressIndicatorData = {
  x: number;
  y: number;
}[];

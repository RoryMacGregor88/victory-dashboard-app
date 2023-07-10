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
};

/** 'tenureType' is defaulted, so is always a string */
// export type Settings = {
//   tenureType: keyof HousingTenureTypes;
//   tenureDataType: keyof TenureDataTypes;
//   tenureYear?: number;
//   totalYear?: number;
//   approvalsGrantedDataType: 'Monthly' | 'Cumulative';
// };

export type Settings = {
  tenureType: string;
  tenureDataType: 'Gross' | 'Net';
  tenureYear?: number;
  totalYear?: number;
  approvalsGrantedDataType: 'Monthly' | 'Cumulative';
};

export type UserOrbState = {
  targets: Targets;
  settings: Settings;
};

export type ChartData =
  | AffordableHousingData
  | HousingApprovalsData
  | ProgressionOfUnitsData
  | TenureTypeHousingData
  | TotalHousingDeliveryData;

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

import {
  AffordableHousingData,
  HousingApprovalsData,
  ProgressionOfUnitsData,
  TenureTypeHousingData,
  TotalHousingDeliveryData,
} from '../../mocks/fixtures';

export type HousingApprovalsObjectArray = HousingApprovalsData[number]['data'];

export type TransformedTargets = { x: string; y: number }[];

export type TimelineData =
  | TotalHousingDeliveryData
  | TenureTypeHousingData
  | ProgressionOfUnitsData
  | AffordableHousingData;

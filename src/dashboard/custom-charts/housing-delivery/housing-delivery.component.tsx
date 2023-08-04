import { SyntheticEvent, useCallback, useEffect, useMemo } from 'react';

import { MenuItem, Select, Typography, makeStyles } from '@material-ui/core';

import { Grid, ToggleButton, ToggleButtonGroup } from '~/components';
import {
  ALL_TENURE_CATEGORIES,
  TENURE_DATA_TYPES,
  housingTenureTypes,
} from '~/constants';
import { ChartWrapper } from '~/dashboard/charts';
import TenureHousingMultiChart from '~/dashboard/custom-charts/housing-delivery/tenure-housing-multi-chart/tenure-housing-multi-chart.component';
import TotalHousingMultiChart from '~/dashboard/custom-charts/housing-delivery/total-housing-multi-chart/total-housing-multi-chart.component';
import {
  CustomDateRange,
  useSelectStyles,
} from '~/dashboard/custom-date-range/custom-date-range.component';
import {
  filterByType,
  getDataTimeline,
  getFilteredTimeline,
  getTargetTotals,
} from '~/dashboard/utils/utils';
import {
  TenureTypeHousingData,
  TotalHousingDeliveryData,
} from '~/mocks/fixtures';
import {
  Settings,
  Targets,
  TenureCategories,
  TenureCategory,
  TenureDataType,
  UserOrbState,
} from '~/types';

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: '#1b2227',
    borderRadius: theme.shape.borderRadius,
    paddingBottom: theme.spacing(2),
    height: 'fit-content',
  },
  header: {
    padding: theme.spacing(2),
  },
  controls: {
    marginBottom: theme.spacing(2),
    width: '50%',
  },
}));

interface TenureDataFilterProps {
  timeline: number[];
  tenureYear: number;
  tenureCategory: TenureCategory | typeof ALL_TENURE_CATEGORIES;
  housingTenureTypes: TenureCategories;
  handleYearRangeSelect: (year: number) => void;
  handleTenureTypeSelect: (type: TenureCategory) => void;
}

const TenureDataFilter = ({
  timeline,
  tenureYear,
  tenureCategory,
  housingTenureTypes,
  handleYearRangeSelect,
  handleTenureTypeSelect,
}: TenureDataFilterProps) => {
  const { root, select } = useSelectStyles({});
  return (
    <Grid
      container
      alignItems="center"
      justifyContent="space-between"
      wrap="nowrap"
    >
      <Grid item>
        <Select
          disableUnderline
          classes={{ root, select }}
          value={tenureCategory}
          onChange={({ target: { value } }) =>
            handleTenureTypeSelect(value as TenureCategory)
          }
        >
          <MenuItem value={ALL_TENURE_CATEGORIES}>
            {ALL_TENURE_CATEGORIES}
          </MenuItem>
          {Object.entries(housingTenureTypes).map(([key, value]) => (
            <MenuItem key={key} value={key}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </Grid>

      <Grid item>
        <CustomDateRange
          timeline={timeline}
          value={tenureYear}
          onSelect={handleYearRangeSelect}
        />
      </Grid>
    </Grid>
  );
};

const thisYear = new Date().getFullYear();

interface HousingDeliveryProps {
  totalHousingDeliveryData: TotalHousingDeliveryData;
  tenureHousingDeliveryData: TenureTypeHousingData;
  targets: Targets;
  settings: Settings;
  updateOrbState: (orbState: UserOrbState) => void;
}

const HousingDelivery = ({
  totalHousingDeliveryData,
  tenureHousingDeliveryData,
  targets,
  settings,
  updateOrbState,
}: HousingDeliveryProps) => {
  const { container, header, controls } = useStyles();

  const tenureCategory = settings.tenureCategory ?? ALL_TENURE_CATEGORIES,
    tenureDataType = settings.tenureDataType ?? TENURE_DATA_TYPES.gross,
    tenureYear = settings.tenureYear ?? thisYear,
    totalYear = settings.totalYear ?? thisYear;

  type UpdateDateFilterArgs = {
    totalYear?: number;
    tenureYear?: number;
  };

  // TODO: is this a number? Is this for both or just one?
  const updateDateFilter = useCallback(
    (data: UpdateDateFilterArgs) => updateOrbState({ settings: { ...data } }),
    [updateOrbState],
  );

  const handleTenureTypeSelect = (tenureCategory: TenureCategory) =>
    updateOrbState({ settings: { tenureCategory } });

  const handleToggleClick = (
    _: SyntheticEvent,
    tenureDataType: TenureDataType,
  ) => updateOrbState({ settings: { tenureDataType } });

  const showAllData = tenureCategory === ALL_TENURE_CATEGORIES;

  /**
   * If showing all data, then totals for each year
   * must be calculated from all datasets
   */
  const processedTargets = showAllData
    ? getTargetTotals(targets)
    : targets[tenureCategory];

  // TODO: why is this one memoized, bit other is not? (Progression/Planning)
  const dataByTenureType = useMemo(
    () =>
      !!showAllData
        ? tenureHousingDeliveryData
        : filterByType<TenureTypeHousingData>({
            apiData: tenureHousingDeliveryData,
            selectedType: housingTenureTypes[tenureCategory],
          }),
    [tenureHousingDeliveryData, tenureCategory, showAllData],
  ) as Partial<TenureTypeHousingData>;

  const totalTimeline = getDataTimeline({
      apiData: totalHousingDeliveryData,
      targets: targets?.totalHousing,
    }),
    tenureTimeline = getDataTimeline({
      apiData: dataByTenureType,
      targets: processedTargets,
    });

  /** initialisation/reset for total chart */
  useEffect(() => {
    /** timeline hasn't built yet, or year is within timeline so no need to reset */
    if (!totalTimeline || totalTimeline.includes(totalYear)) {
      return;
    } else {
      updateDateFilter({
        totalYear: totalTimeline[totalTimeline.length - 1],
      });
    }
  }, [totalTimeline, totalYear, updateDateFilter]);

  /** initialisation/reset for tenure chart */
  useEffect(() => {
    /** timeline hasn't built yet, or year is within timeline so no need to reset */
    if (!tenureTimeline || tenureTimeline.includes(tenureYear)) {
      return;
    } else {
      updateDateFilter({
        tenureYear: tenureTimeline[tenureTimeline.length - 1],
      });
    }
  }, [tenureTimeline, tenureYear, updateDateFilter]);

  return (
    <Grid container className={container} direction="column">
      <Grid
        container
        item
        alignItems="center"
        className={header}
        justifyContent="space-between"
      >
        <Grid item component={Typography} variant="h1">
          Housing Delivery
        </Grid>
      </Grid>

      <Grid
        container
        item
        alignItems="stretch"
        justifyContent="space-between"
        wrap="nowrap"
      >
        <ChartWrapper
          info="Total housing delivery values per financial year. The data source is the PLD (Planning London Data Hub)."
          title="Total Housing Delivery"
        >
          <CustomDateRange
            timeline={totalTimeline}
            value={totalYear}
            onSelect={(totalYear: number) => updateDateFilter({ totalYear })}
          />
          <TotalHousingMultiChart
            data={totalHousingDeliveryData}
            targets={targets}
            timeline={getFilteredTimeline({
              timeline: totalTimeline,
              selectedYear: totalYear,
            })}
          />
        </ChartWrapper>

        <ChartWrapper
          info="Housing delivery values broken down by tenure type per financial year. The data source is the PLD (Planning London Data Hub)."
          title="Housing Delivery by Tenure Type"
        >
          <Grid container item className={controls} direction="column">
            <TenureDataFilter
              handleTenureTypeSelect={handleTenureTypeSelect}
              handleYearRangeSelect={(year) =>
                updateDateFilter({ tenureYear: year })
              }
              housingTenureTypes={housingTenureTypes}
              tenureCategory={tenureCategory}
              tenureYear={tenureYear}
              timeline={tenureTimeline}
            />

            <ToggleButtonGroup
              orientation="horizontal"
              size="small"
              value={tenureDataType}
              onChange={handleToggleClick}
            >
              <ToggleButton value={TENURE_DATA_TYPES.gross}>
                {TENURE_DATA_TYPES.gross}
              </ToggleButton>
              <ToggleButton value={TENURE_DATA_TYPES.net}>
                {TENURE_DATA_TYPES.net}
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>

          {tenureTimeline.includes(tenureYear) ? (
            <TenureHousingMultiChart
              apiData={dataByTenureType}
              targets={processedTargets}
              tenureCategory={
                tenureCategory !== ALL_TENURE_CATEGORIES
                  ? tenureCategory
                  : undefined
              }
              timeline={getFilteredTimeline({
                timeline: tenureTimeline,
                selectedYear: tenureYear,
              })}
            />
          ) : null}
        </ChartWrapper>
      </Grid>
    </Grid>
  );
};

export default HousingDelivery;

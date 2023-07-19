import { useEffect, useMemo, SyntheticEvent } from 'react';

import {
  Grid,
  Select,
  MenuItem,
  Typography,
  makeStyles,
} from '@material-ui/core';

import { ChartWrapper } from '../../charts/chart-wrapper.component';

import {
  getDataTimeline,
  getTargetTotals,
  filterByType,
  getFilteredTimeline,
} from '../../utils/utils';

import {
  CustomDateRange,
  useSelectStyles,
} from '../../custom-date-range/custom-date-range.component';

import {
  housingTenureTypes,
  TENURE_DATA_TYPES,
  ALL_TENURE_CATEGORIES,
} from '../../../constants';

import { TenureHousingMultiChart } from './tenure-housing-multi-chart/tenure-housing-multi-chart.component';
import { TotalHousingMultiChart } from './total-housing-multi-chart/total-housing-multi-chart.component';

import { ToggleButton, ToggleButtonGroup } from '../../../components';

import {
  TenureTypeHousingData,
  TotalHousingDeliveryData,
} from '../../../mocks/fixtures';

import {
  TenureCategories,
  Settings,
  Targets,
  TenureCategory,
  TenureDataType,
  UserOrbState,
  TargetCategory,
} from '../../../types';

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: '#1b2227', //TODO: use theme
    borderRadius: theme.shape.borderRadius,
    paddingBottom: theme.spacing(2),
    height: 'fit-content',
  },
  header: {
    padding: theme.spacing(2),
  },
  selectFilters: {
    width: 'fit-content',
    marginLeft: 'auto',
    gap: theme.spacing(2),
  },
  charts: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    gap: theme.spacing(2),
  },
  buttons: {
    width: '40%',
    marginLeft: '60%',
    // TODO: can use theme?
    marginBottom: '-1rem',
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
  const { selectFilters } = useStyles();
  const { root, select } = useSelectStyles({});
  return (
    <Grid
      container
      justifyContent='space-between'
      alignItems='center'
      wrap='nowrap'
      className={selectFilters}
    >
      <Grid item>
        <Select
          value={tenureCategory}
          onChange={({ target: { value } }) =>
            handleTenureTypeSelect(value as TenureCategory)
          }
          classes={{ root, select }}
          disableUnderline
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
  const { container, charts, header, buttons } = useStyles();

  const tenureCategory = settings.tenureCategory ?? ALL_TENURE_CATEGORIES,
    tenureDataType = settings.tenureDataType ?? TENURE_DATA_TYPES.gross,
    tenureYear = settings.tenureYear ?? thisYear,
    totalYear = settings.totalYear ?? thisYear;

  type UpdateDateFilterArgs = {
    totalYear?: number;
    tenureYear?: number;
  };

  // TODO: is this a number? Is this for both or just one?
  const updateDateFilter = (data: UpdateDateFilterArgs) =>
    updateOrbState({ settings: { ...data } });

  const handleTenureTypeSelect = (tenureCategory: TenureCategory) =>
    updateOrbState({ settings: { tenureCategory } });

  const handleToggleClick = (
    _: SyntheticEvent,
    tenureDataType: TenureDataType
  ) => updateOrbState({ settings: { tenureDataType } });

  const showAllData = tenureCategory === ALL_TENURE_CATEGORIES;

  const processedTargets = showAllData
    ? getTargetTotals(targets)
    : targets[tenureCategory];

  // TODO: why is this one memoized, bit other is not? (Progression/Planning)
  const dataByTenureType = useMemo(
    () =>
      showAllData
        ? tenureHousingDeliveryData
        : filterByType<TenureTypeHousingData>({
            apiData: tenureHousingDeliveryData,
            selectedType: housingTenureTypes[tenureCategory],
          }),
    [tenureHousingDeliveryData, tenureCategory, showAllData]
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
    if (!totalTimeline || (totalYear && totalTimeline.includes(totalYear))) {
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
    if (
      !tenureTimeline ||
      (tenureYear && tenureTimeline.includes(tenureYear))
    ) {
      return;
    } else {
      updateDateFilter({
        tenureYear: tenureTimeline[tenureTimeline.length - 1],
      });
    }
  }, [tenureTimeline, tenureYear, updateDateFilter]);

  return (
    <Grid container direction='column' className={container}>
      <Grid
        item
        container
        justifyContent='space-between'
        alignItems='center'
        className={header}
      >
        <Grid item component={Typography} variant='h1'>
          Housing Delivery
        </Grid>
      </Grid>

      <Grid item className={charts}>
        <ChartWrapper
          title='Total Housing Delivery'
          info='Total housing delivery values per financial year. The data source is the PLD (Planning London Data Hub).'
        >
          <CustomDateRange
            timeline={totalTimeline}
            value={totalYear}
            onSelect={(totalYear: number) => updateDateFilter({ totalYear })}
          />
          <TotalHousingMultiChart
            data={totalHousingDeliveryData}
            targets={targets}
            timeline={getFilteredTimeline(totalTimeline, totalYear)}
          />
        </ChartWrapper>

        <ChartWrapper
          title='Housing Delivery by Tenure Type'
          info='Housing delivery values broken down by tenure type per financial year. The data source is the PLD (Planning London Data Hub).'
        >
          <TenureDataFilter
            timeline={tenureTimeline}
            tenureYear={tenureYear}
            tenureCategory={tenureCategory}
            housingTenureTypes={housingTenureTypes}
            handleYearRangeSelect={(year) =>
              updateDateFilter({ tenureYear: year })
            }
            handleTenureTypeSelect={handleTenureTypeSelect}
          />
          <ToggleButtonGroup
            size='small'
            value={tenureDataType}
            orientation='horizontal'
            onChange={handleToggleClick}
            className={buttons}
          >
            <ToggleButton value={TENURE_DATA_TYPES.gross}>
              {TENURE_DATA_TYPES.gross}
            </ToggleButton>
            <ToggleButton value={TENURE_DATA_TYPES.net}>
              {TENURE_DATA_TYPES.net}
            </ToggleButton>
          </ToggleButtonGroup>

          {/* {tenureYear && tenureTimeline.includes(tenureYear) ? (
            <TenureHousingMultiChart
              apiData={dataByTenureType}
              userTargetData={processedTargets}
              tenureCategory={
                tenureCategory !== ALL_TENURE_CATEGORIES
                  ? tenureCategory
                  : undefined
              }
              filteredTimeline={getFilteredTimeline(tenureTimeline, tenureYear)}
            />
          ) : null} */}
        </ChartWrapper>
      </Grid>
    </Grid>
  );
};

export default HousingDelivery;

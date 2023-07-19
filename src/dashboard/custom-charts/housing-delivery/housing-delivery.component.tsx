import {
  useCallback,
  useState,
  useEffect,
  useMemo,
  SyntheticEvent,
} from 'react';

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
  ALL_TENURE_TYPES,
} from '../../../constants';
import { TenureHousingMultiChart } from './tenure-housing-multi-chart/tenure-housing-multi-chart.component';
import { TotalHousingMultiChart } from './total-housing-multi-chart/total-housing-multi-chart.component';
import { ToggleButton, ToggleButtonGroup } from '../../../components';
import {
  TenureTypeHousingData,
  TotalHousingDeliveryData,
} from '../../../mocks/fixtures';
import {
  Settings,
  Targets,
  TenureCategory,
  TenureDataType,
  UserOrbState,
} from '../../../types';

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: '#1b2227', //TODO: use theme
    borderRadius: theme.shape.borderRadius,
    paddingBottom: '1rem',
    height: 'fit-content',
  },
  header: {
    padding: '1rem',
  },
  selectFilters: {
    width: 'fit-content',
    marginLeft: 'auto',
    gap: '1rem',
  },
  charts: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    gap: '1rem',
  },
  buttons: {
    width: '40%',
    marginLeft: '60%',
    marginBottom: '-1rem',
  },
}));

interface TenureDataFilterProps {
  timeline: number[];
  tenureYear: Settings[TenureCategory];
  tenureType: Settings[TenureDataType];
  housingTenureTypes: TenureCategory;
  handleYearRangeSelect: (year: number) => void;
  handleTenureTypeSelect: (type: keyof TenureCategory) => void;
}

const TenureDataFilter = ({
  timeline,
  tenureYear,
  tenureType,
  housingTenureTypes,
  handleYearRangeSelect,
  handleTenureTypeSelect,
}: TenureDataFilterProps) => {
  // TODO: destructure this and any others
  const styles = useStyles();
  const { root, select } = useSelectStyles({});
  return (
    <Grid
      container
      justifyContent='space-between'
      alignItems='center'
      wrap='nowrap'
      className={styles.selectFilters}
    >
      <Grid item>
        <Select
          value={tenureType}
          onChange={({ target: { value } }) =>
            handleTenureTypeSelect(value as keyof TenureCategory)
          }
          classes={{ root, select }}
          disableUnderline
        >
          <MenuItem value={ALL_TENURE_TYPES}>{ALL_TENURE_TYPES}</MenuItem>
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
  const styles = useStyles();

  type Configuration = Omit<Settings, 'approvalsGrantedDataType'>;

  /** select dropdowns and/or toggle buttons */
  const [configuration, setConfiguration] = useState<Configuration>({
    tenureType: settings.tenureType ?? ALL_TENURE_TYPES,
    tenureDataType: TENURE_DATA_TYPES.gross,
    tenureYear: settings.tenureYear,
    totalYear: settings.totalYear,
  });

  const { tenureType, tenureDataType, tenureYear, totalYear } = configuration;

  // TODO: do we need 2 piece of state for this? Can they all just read from the dashboardSettings?
  const updateDateFilter = useCallback(
    (newSettings: Partial<Settings>) => {
      setConfiguration((prev) => ({
        ...prev,
        ...newSettings,
      }));

      updateOrbState((prev: UserOrbState) => ({
        ...prev,
        settings: { ...prev.settings, ...newSettings },
      }));
    },
    [updateOrbState]
  );

  const handleTenureTypeSelect = (value: keyof TenureCategory) => {
    setConfiguration((prev) => ({ ...prev, tenureType: value }));

    updateOrbState((prev: UserOrbState) => ({
      ...prev,
      settings: { ...prev.settings, tenureType: value },
    }));
  };

  const handleToggleClick = (_: SyntheticEvent, type: 'Gross' | 'Net') => {
    setConfiguration((prev) => ({ ...prev, tenureDataType: type }));

    updateOrbState((prev: UserOrbState) => ({
      ...prev,
      settings: { ...prev.settings, tenureDataType: type },
    }));
  };

  const showAllData = tenureType === ALL_TENURE_TYPES;

  const processedTargets = showAllData
    ? getTargetTotals(targets)
    : targets[tenureType];

  // TODO: why is this one memoized, bit other is not? (Progression/Planning)
  const dataByTenureType = useMemo(
    () =>
      showAllData
        ? tenureHousingDeliveryData
        : filterByType<TenureTypeHousingData>({
            data: tenureHousingDeliveryData,
            selectedType: housingTenureTypes[tenureType],
          }),
    [tenureHousingDeliveryData, tenureType, showAllData]
  );

  const totalTimeline = getDataTimeline(
      totalHousingDeliveryData,
      targets?.totalHousing
    ),
    tenureTimeline = getDataTimeline(dataByTenureType, processedTargets);

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
    <Grid container direction='column' className={styles.container}>
      <Grid
        item
        container
        justifyContent='space-between'
        alignItems='center'
        className={styles.header}
      >
        <Grid item component={Typography} variant='h1'>
          Housing Delivery
        </Grid>
      </Grid>

      <Grid item className={styles.charts}>
        <ChartWrapper
          title='Total Housing Delivery'
          info='Total housing delivery values per financial year. The data source is the PLD (Planning London Data Hub).'
        >
          <CustomDateRange
            timeline={totalTimeline}
            value={totalYear}
            onSelect={(value: number) => updateDateFilter({ totalYear: value })}
          />
          <TotalHousingMultiChart
            apiData={totalHousingDeliveryData}
            userTargetData={targets?.totalHousing}
            filteredTimeline={getFilteredTimeline(totalTimeline, totalYear)}
          />
        </ChartWrapper>

        <ChartWrapper
          title='Housing Delivery by Tenure Type'
          info='Housing delivery values broken down by tenure type per financial year. The data source is the PLD (Planning London Data Hub).'
        >
          <TenureDataFilter
            timeline={tenureTimeline}
            tenureYear={tenureYear}
            tenureType={tenureType}
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
            className={styles.buttons}
          >
            <ToggleButton value={TENURE_DATA_TYPES.gross}>
              {TENURE_DATA_TYPES.gross}
            </ToggleButton>
            <ToggleButton value={TENURE_DATA_TYPES.net}>
              {TENURE_DATA_TYPES.net}
            </ToggleButton>
          </ToggleButtonGroup>

          {tenureYear && tenureTimeline.includes(tenureYear) ? (
            <TenureHousingMultiChart
              apiData={dataByTenureType}
              userTargetData={processedTargets}
              tenureType={
                tenureType !== ALL_TENURE_TYPES ? tenureType : undefined
              }
              filteredTimeline={getFilteredTimeline(tenureTimeline, tenureYear)}
            />
          ) : null}
        </ChartWrapper>
      </Grid>
    </Grid>
  );
};

export default HousingDelivery;

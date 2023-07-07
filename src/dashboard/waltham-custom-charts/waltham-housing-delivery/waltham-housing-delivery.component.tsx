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
  WalthamCustomDateRange,
  useWalthamSelectStyles,
} from '../../waltham-custom-date-range/waltham-custom-date-range.component';

import { housingTenureTypes, TENURE_DATA_TYPES } from '../../../constants';
import { TenureHousingMultiChart } from './tenure-housing-multi-chart/tenure-housing-multi-chart.component';
import { TotalHousingMultiChart } from './total-housing-multi-chart/total-housing-multi-chart.component';
import { ToggleButton, ToggleButtonGroup } from '../../../components';
import {
  Settings,
  Targets,
  UserOrbState,
} from '../../../accounts/accounts.slice';
import {
  TenureTypeHousingData,
  TotalHousingDeliveryData,
} from '../../../mocks/fixtures';

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

type TenureDataType = 'Gross' | 'Net';

const ALL_TENURE_TYPES = 'All Tenure Types';

// TODO: toggle buttons are disabled and initialisation of Gross/Net in state is hardcoded to 'Gross' for now, because mock data contained Gross/Net data, but API does not. This may be re-instated in the future, so commenting out is better than removing only to code again later.

interface TenureDataFilterProps {
  timeline: number[];
  tenureYear: number;
  tenureType: string;
  housingTenureTypes: { [key: string]: string };
  handleYearRangeSelect: (value: number) => void;
  handleTenureTypeSelect: (value: string) => void;
}

const TenureDataFilter = ({
  timeline,
  tenureYear,
  tenureType,
  housingTenureTypes,
  handleYearRangeSelect,
  handleTenureTypeSelect,
}: TenureDataFilterProps) => {
  const styles = useStyles();
  const { root, select } = useWalthamSelectStyles({});
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
          onChange={({ target: { value } }) => handleTenureTypeSelect(value)}
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
        <WalthamCustomDateRange
          timeline={timeline}
          value={tenureYear}
          onSelect={handleYearRangeSelect}
        />
      </Grid>
    </Grid>
  );
};

interface HousingDeliveryProps {
  totalHousingDeliveryChartData: TotalHousingDeliveryData;
  tenureHousingDeliveryChartData: TenureTypeHousingData;
  targets: Targets;
  settings: Settings;
  setDashboardSettings: React.Dispatch<React.SetStateAction<UserOrbState>>;
}

export const WalthamHousingDelivery = ({
  totalHousingDeliveryChartData,
  tenureHousingDeliveryChartData,
  targets,
  settings,
  setDashboardSettings,
}: HousingDeliveryProps) => {
  const styles = useStyles();

  const [configuration, setConfiguration] = useState<Settings>({
    tenureType: settings?.tenureType ?? ALL_TENURE_TYPES,
    tenureDataType: TENURE_DATA_TYPES.gross,
    tenureYear: settings?.tenureYear ?? undefined,
    totalYear: settings?.totalYear ?? undefined,
  });

  const { tenureType, tenureDataType, tenureYear, totalYear } = configuration;

  // TODO: do we need 2 piece of state for this? Can they all just read from the dashboardSettings?
  const updateDateFilter = useCallback(
    (newSettings: Settings) => {
      setConfiguration((prev) => ({
        ...prev,
        ...newSettings,
      }));

      setDashboardSettings((prev: UserOrbState) => ({
        ...prev,
        settings: { ...prev.settings, ...newSettings },
      }));
    },
    [setDashboardSettings]
  );

  // TODO: enums for this stuff?
  const handleTenureTypeSelect = (value: string) => {
    setConfiguration((prev) => ({ ...prev, tenureType: value }));
    setDashboardSettings((prev: UserOrbState) => ({
      ...prev,
      settings: { ...prev.settings, tenureType: value },
    }));
  };

  const handleToggleClick = (_: SyntheticEvent, type: TenureDataType) => {
    setConfiguration((prev) => ({ ...prev, tenureDataType: type }));
    setDashboardSettings((prev: UserOrbState) => ({
      ...prev,
      settings: { ...prev.settings, tenureDataType: type },
    }));
  };

  const processedTargets =
    tenureType === ALL_TENURE_TYPES
      ? getTargetTotals(targets)
      : targets?.[tenureType];

  const dataByTenureType = useMemo(
    () =>
      filterByType(
        tenureHousingDeliveryChartData,
        tenureType,
        ALL_TENURE_TYPES,
        housingTenureTypes
      ),
    [tenureHousingDeliveryChartData, tenureType]
  );

  /**
   * this is only here because mock data needs `startYear` split on
   * the hyphen and coerced into a number
   */
  const adaptedTotalData = totalHousingDeliveryChartData?.map((obj) => {
    const [startYear] = obj.startYear.split('-');
    return Object.entries(obj).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: key === 'startYear' ? Number(startYear) : value,
      }),
      {}
    );
  });

  const totalTimeline = getDataTimeline(
      adaptedTotalData,
      targets?.totalHousing
    ),
    tenureTimeline = getDataTimeline(dataByTenureType, processedTargets);

  /** setup/error catch for total chart */
  useEffect(() => {
    if (!totalTimeline || totalTimeline.includes(totalYear)) {
      return;
    } else {
      updateDateFilter({ totalYear: totalTimeline[totalTimeline.length - 1] });
    }
  }, [totalTimeline, totalYear, updateDateFilter]);

  /** setup/error catch for tenure chart */
  useEffect(() => {
    if (!tenureTimeline || tenureTimeline.includes(tenureYear)) {
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
          <WalthamCustomDateRange
            timeline={totalTimeline}
            value={totalYear}
            onSelect={(value: number) => updateDateFilter({ totalYear: value })}
          />
          <TotalHousingMultiChart
            apiData={adaptedTotalData}
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
            handleYearRangeSelect={(year: number) =>
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

          {tenureTimeline?.includes(tenureYear) ? (
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

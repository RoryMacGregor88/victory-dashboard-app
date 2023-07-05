import {
  useCallback,
  useEffect,
  useState,
  useRef,
  FC,
  ReactElement,
} from 'react';

import {
  makeStyles,
  CircularProgress,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@material-ui/core';

import { Button } from '../components';

import { useAppDispatch, useAppSelector } from '../hooks';

import { exportToCsv } from './utils/utils';

import {
  chartDataSelector,
  fetchDashboardData,
  updateUserDashboardConfig,
  userOrbStateSelector,
  ChartMetadata,
} from './dashboard-slice/dashboard.slice';
import {
  SelectScreen,
  TargetScreen,
} from './target-dialog-screens/target-dialog-screens';
import { AffordableHousingDelivery } from './waltham-custom-charts/waltham-affordable-housing-delivery/affordable-housing-delivery.component';
import { HousingApprovalsComponent } from './waltham-custom-charts/waltham-housing-approvals/housing-approvals.component';
import { WalthamHousingDelivery } from './waltham-custom-charts/waltham-housing-delivery/waltham-housing-delivery.component';
import { ProgressIndicators } from './waltham-custom-charts/waltham-progress-indicators/progress-indicators.component';
import ProgressionVsPlanningSchedule from './waltham-custom-charts/waltham-progression-of-units/progression-vs-planning-schedule.component';
import { walthamApiMetadata, targetDatasets } from '../constants';
import {
  Targets,
  UserOrbState,
  userSelector,
} from '../accounts/accounts.slice';

const useStyles = makeStyles((theme) => ({
  header: {
    padding: '2rem',
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    backgroundColor: theme.palette.background.default,
  },
  headerButtons: {
    display: 'flex',
    gap: '1rem',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '2rem',
    backgroundColor: theme.palette.background.default,
  },
  progressIndicators: {
    display: 'flex',
    gap: '1rem',
  },
  planningProgression: {
    height: 'fit-content',
  },
  bottomChartContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '1rem',
  },
  columnCharts: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
}));

export const Dashboard: FC<{ sourceId: string }> = ({
  sourceId,
}): ReactElement => {
  const styles = useStyles({});
  const dispatch = useAppDispatch();

  /** all data, including 'name', 'version', etc */
  const approvalsGranted = useAppSelector(
      chartDataSelector(sourceId, 'ApprovalsGranted')
    ),
    progressionVsPlanning = useAppSelector(
      chartDataSelector(sourceId, 'ProgressionVsPlanning')
    ),
    tenureHousingDelivery = useAppSelector(
      chartDataSelector(sourceId, 'TenureHousingDelivery')
    ),
    totalHousingDelivery = useAppSelector(
      chartDataSelector(sourceId, 'TotalHousingDelivery')
    ),
    affordableHousingDelivery = useAppSelector(
      chartDataSelector(sourceId, 'AffordableHousingDelivery')
    );

  const user = useAppSelector(userSelector);

  // TODO: need a selector if already have a user selector?
  const userOrbState = useAppSelector(userOrbStateSelector(sourceId));

  const { targets, settings } = userOrbState;

  const [dashboardSettings, setDashboardSettings] = useState<UserOrbState>({
    targets: {},
    settings: {},
  });

  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
  // TODO: why not one of these for settings? Do we need 2 pieces of state for this?
  const [localTargets, setLocalTargets] = useState<Targets>(targets);
  const [targetDialogVisible, setTargetDialogVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dashboardSettingsRef = useRef(dashboardSettings);

  const updateWalthamOrbState = useCallback(
    (data: UserOrbState) => {
      if (user) {
        dispatch(updateUserDashboardConfig({ user, sourceId, data }));
      }
    },
    [dispatch, sourceId, user]
  );

  useEffect(() => {
    walthamApiMetadata.forEach(({ datasetName, url }) => {
      const chartMetadata: ChartMetadata = {
        sourceId,
        datasetName,
        url,
      };

      dispatch(fetchDashboardData(chartMetadata));
    });
  }, [sourceId, dispatch]);

  /** 1. listener func must be reusable so that it can also be removed */
  /** 2. must check changes have been made to prevent firing every time */
  const saveSettingsHandler = useCallback(() => {
    const changesMade = Object.values(dashboardSettingsRef.current).some(
      (obj) => !!Object.keys(obj).length
    );

    return changesMade
      ? updateWalthamOrbState(dashboardSettingsRef.current)
      : null;
  }, [updateWalthamOrbState]);

  // update dashboardSettingsRef to be used in saving dashboard settings every
  // time dashboardSettings is updated
  useEffect(() => {
    dashboardSettingsRef.current = dashboardSettings;
  }, [dashboardSettings]);

  /** add event listener that covers user closing/refreshing tab */
  useEffect(() => {
    window.addEventListener('beforeunload', saveSettingsHandler);
  });

  /** remove listener and save settings if user navigates away in-app */
  useEffect(() => {
    return () => {
      window.removeEventListener('beforeunload', saveSettingsHandler);
      saveSettingsHandler();
    };
  }, [saveSettingsHandler]);

  const closeDialog = () => {
    setSelectedDataset(null);
    setTargetDialogVisible(false);
  };

  const handleAddTargetsClick = (newTargets: Targets) => {
    setLocalTargets((prev) => ({ ...prev, ...newTargets }));
    setDashboardSettings((prev) => ({
      ...prev,
      targets: { ...prev.targets, ...newTargets },
    }));
    closeDialog();
  };

  const handleExport = async () => {};
  // const handleExport = async () => {
  //   setIsLoading(true);

  //   const source_id = 'astrosat/wfc/export/latest';

  //   const authToken = getAuthTokenForSource(authTokens, { source_id });
  //   const url = `/${source_id}/`;

  //   const data = await apiClient.dashboard.getDashboardData(url, {
  //     headers: { Authorization: `Bearer ${authToken}` },
  //   });

  //   exportToCsv(data, 'wfc-dashboard-data');

  //   setIsLoading(false);
  // };

  return (
    <>
      <Grid
        container
        justifyContent='space-between'
        alignItems='center'
        className={styles.header}
      >
        <Typography variant='h2'>LBWF Housing Delivery Dashboard</Typography>
        <div className={styles.headerButtons}>
          <Button size='small' onClick={handleExport}>
            {isLoading ? (
              <CircularProgress size={20} color='inherit' />
            ) : (
              'Export'
            )}
          </Button>
          <Button size='small' onClick={() => setTargetDialogVisible(true)}>
            Add Targets
          </Button>
        </div>
      </Grid>

      <div className={styles.content}>
        <div className={styles.progressIndicators}>
          <ProgressIndicators
            totalData={totalHousingDelivery}
            tenureData={tenureHousingDelivery}
            targets={localTargets}
          />
        </div>

        <WalthamHousingDelivery
          totalHousingDeliveryChartData={totalHousingDelivery?.[0]?.data}
          tenureHousingDeliveryChartData={tenureHousingDelivery}
          targets={localTargets}
          settings={settings}
          setDashboardSettings={setDashboardSettings}
        />

        <div className={styles.bottomChartContainer}>
          <div className={styles.columnCharts}>
            <ProgressionVsPlanningSchedule
              data={progressionVsPlanning}
              settings={settings}
              setDashboardSettings={setDashboardSettings}
            />
            <AffordableHousingDelivery
              data={affordableHousingDelivery}
              targets={localTargets?.affordableHousingPercentage}
              settings={settings}
              setDashboardSettings={setDashboardSettings}
            />
          </div>

          <HousingApprovalsComponent
            x='Month'
            xLabel='Month'
            yLabel='No. Housing Approvals Granted'
            ranges={['2019', '2020']}
            data={approvalsGranted?.properties}
            settings={settings}
            setDashboardSettings={setDashboardSettings}
          />
        </div>
      </div>

      <Dialog
        maxWidth='md'
        open={targetDialogVisible}
        onClose={closeDialog}
        aria-labelledby='waltham-forest-targets-dialog'
      >
        <DialogTitle>
          {selectedDataset ? targetDatasets[selectedDataset] : 'Add Targets'}
        </DialogTitle>
        <DialogContent>
          {selectedDataset ? (
            <TargetScreen
              onAddTargetsClick={(targets: Targets) =>
                handleAddTargetsClick(targets)
              }
              selectedDataset={selectedDataset}
              targets={localTargets?.[selectedDataset]}
            />
          ) : (
            <SelectScreen
              onNextClick={(dataset: string) => setSelectedDataset(dataset)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

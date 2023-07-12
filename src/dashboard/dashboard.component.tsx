import { useCallback, useEffect, useState, useRef, FC } from 'react';

import {
  makeStyles,
  CircularProgress,
  Grid,
  Typography,
  Dialog,
  DialogContent,
} from '@material-ui/core';

import { Button, LoadMaskFallback, DialogTitle } from '../components';

import { useAppDispatch, useAppSelector } from '../hooks';

import { exportToCsv } from './utils/utils';

import {
  chartDataSelector,
  fetchDashboardData,
  updateUserDashboardConfig,
  userOrbStateSelector,
} from './dashboard-slice/dashboard.slice';
import {
  SelectScreen,
  TargetScreen,
} from './target-dialog-screens/target-dialog-screens';
import { AffordableHousingDelivery } from './custom-charts/waltham-affordable-housing-delivery/affordable-housing-delivery.component';
import { HousingApprovalsComponent } from './custom-charts/waltham-housing-approvals/housing-approvals.component';
import { WalthamHousingDelivery } from './custom-charts/waltham-housing-delivery/waltham-housing-delivery.component';
import ProgressIndicators from './custom-charts/progress-indicators/progress-indicators.component';
import ProgressionVsPlanningSchedule from './custom-charts/waltham-progression-of-units/progression-vs-planning-schedule.component';
import { walthamApiMetadata, targetDatasets } from '../constants';
import { userSelector } from '../accounts/accounts.slice';

import {
  TotalHousingDeliveryData,
  TenureTypeHousingData,
  AffordableHousingData,
  ProgressionOfUnitsData,
  HousingApprovalsData,
} from '../mocks/fixtures';
// TODO: why does this work
import { ExportData } from '~/mocks/fixtures/export_data';
import { ChartMetadata, Targets, UserOrbState } from '../types';

const useStyles = makeStyles((theme) => ({
  header: {
    padding: theme.spacing(4),
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    backgroundColor: theme.palette.background.default,
  },
  headerButtons: {
    gap: theme.spacing(2),
    width: 'fit-content',
  },
  content: {
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
  },
  progressIndicators: {
    gap: theme.spacing(2),
  },
  planningProgression: {
    height: 'fit-content',
  },
  bottomChartContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
  },
}));

export const Dashboard: FC<{ sourceId: string }> = ({ sourceId }) => {
  const styles = useStyles();
  const dispatch = useAppDispatch();

  /** all data, including 'name', 'version', etc */
  const approvalsGranted: HousingApprovalsData = useAppSelector(
      chartDataSelector(sourceId, 'ApprovalsGranted')
    ),
    progressionVsPlanning: ProgressionOfUnitsData = useAppSelector(
      chartDataSelector(sourceId, 'ProgressionVsPlanning')
    ),
    tenureHousingDelivery: TenureTypeHousingData = useAppSelector(
      chartDataSelector(sourceId, 'TenureHousingDelivery')
    ),
    totalHousingDelivery: TotalHousingDeliveryData = useAppSelector(
      chartDataSelector(sourceId, 'TotalHousingDelivery')
    ),
    affordableHousingDelivery: AffordableHousingData = useAppSelector(
      chartDataSelector(sourceId, 'AffordableHousingDelivery')
    );

  const user = useAppSelector(userSelector);
  const userOrbState = useAppSelector(userOrbStateSelector(sourceId));

  const [dashboardSettings, setDashboardSettings] = useState<UserOrbState>({
    targets: null,
    settings: null,
  });

  const { targets, settings } = dashboardSettings;

  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
  const [targetDialogVisible, setTargetDialogVisible] = useState(false);
  const [exportIsLoading, setExportIsLoading] = useState(false);

  const dashboardSettingsRef = useRef(dashboardSettings);

  // TODO: don't need this if using skeletons
  const dataIsLoaded =
    approvalsGranted &&
    progressionVsPlanning &&
    tenureHousingDelivery &&
    totalHousingDelivery &&
    affordableHousingDelivery &&
    targets &&
    settings;

  /** initialise dashboardSettings in state when fetched */
  useEffect(() => {
    if (!targets && !settings) {
      setDashboardSettings(userOrbState);
    }
  }, [settings, targets, userOrbState]);

  const updateWalthamOrbState = useCallback(
    (data: UserOrbState) => {
      // TODO: why the guard?
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
    const valuesObjects = Object.values(dashboardSettingsRef.current);

    const changesMade = valuesObjects.some(
      (obj) => !!Object.keys(obj ?? {}).length
    );

    if (changesMade) updateWalthamOrbState(dashboardSettingsRef.current);
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
    setDashboardSettings((prev) => ({
      ...prev,
      targets: { ...prev.targets, ...newTargets },
    }));
    closeDialog();
  };

  /**
   * original function used an API client, not a manual fetch,
   * but this was easier for demo purposes than hooking all that up
   */
  const handleExport = async () => {
    setExportIsLoading(true);
    const res = await fetch('/api/export/');
    const exportData: ExportData = await res.json();

    exportToCsv(exportData, 'mock-dashboard-data');
    setExportIsLoading(false);
  };

  // TODO: use skeletons instead of loadmask? Maybe leave until later?

  return !dataIsLoaded ? (
    <LoadMaskFallback />
  ) : (
    <>
      <Grid
        container
        justifyContent='space-between'
        alignItems='center'
        wrap='nowrap'
        className={styles.header}
      >
        <Typography variant='h2'>Housing Delivery Dashboard</Typography>
        <Grid item container className={styles.headerButtons}>
          <Button size='small' onClick={handleExport}>
            {exportIsLoading ? (
              <CircularProgress size={20} color='inherit' />
            ) : (
              'Export'
            )}
          </Button>
          <Button size='small' onClick={() => setTargetDialogVisible(true)}>
            Add Targets
          </Button>
        </Grid>
      </Grid>

      <Grid item container direction='column' className={styles.content}>
        <Grid
          item
          container
          wrap='nowrap'
          className={styles.progressIndicators}
        >
          <ProgressIndicators
            totalData={totalHousingDelivery}
            tenureData={tenureHousingDelivery}
            targets={targets}
          />
        </Grid>

        {/* <WalthamHousingDelivery
          totalHousingDeliveryChartData={totalHousingDelivery}
          tenureHousingDeliveryChartData={tenureHousingDelivery}
          targets={targets}
          settings={settings}
          setDashboardSettings={setDashboardSettings}
        /> */}

        {/* <Grid
          item
          container

          className={styles.bottomChartContainer}
        >
          <Grid item container direction='column'>
            <ProgressionVsPlanningSchedule
              data={progressionVsPlanning}
              settings={settings}
              setDashboardSettings={setDashboardSettings}
            />
            <AffordableHousingDelivery
              data={affordableHousingDelivery}
              targets={targets?.affordableHousingPercentage}
              settings={settings}
              setDashboardSettings={setDashboardSettings}
            />
          </Grid>

          <HousingApprovalsComponent
            x='Month'
            xLabel='Month'
            yLabel='No. Housing Approvals Granted'
            ranges={['2019', '2020']}
            data={approvalsGranted}
            settings={settings}
            setDashboardSettings={setDashboardSettings}
          />
        </Grid> */}
      </Grid>

      <Dialog
        maxWidth='md'
        open={targetDialogVisible}
        onClose={closeDialog}
        aria-labelledby='waltham-forest-targets-dialog'
      >
        <DialogTitle onClose={closeDialog}>
          {selectedDataset ? targetDatasets[selectedDataset] : 'Add Targets'}
        </DialogTitle>
        <DialogContent>
          {selectedDataset ? (
            <TargetScreen
              onAddTargetsClick={(targets: Targets) =>
                handleAddTargetsClick(targets)
              }
              selectedDataset={selectedDataset}
              targets={targets?.[selectedDataset]}
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

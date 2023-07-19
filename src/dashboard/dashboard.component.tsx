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
  SelectForm,
  TargetForm,
} from './target-dialog-screens/target-dialog-screens';

import {
  AffordableHousingDelivery,
  DeliverableSupplySummary,
  HousingApprovals,
  HousingDelivery,
  ProgressIndicators,
  ProgressionVsPlanningSchedule,
} from './custom-charts';

import { apiMetadata, targetDatasets } from '../constants';
import { userSelector } from '../accounts/accounts.slice';

import {
  TotalHousingDeliveryData,
  TenureTypeHousingData,
  AffordableHousingData,
  ProgressionOfUnitsData,
  HousingApprovalsData,
  DeliverableSupplySummaryData,
} from '../mocks/fixtures';

// TODO: why does this work
import { ExportData } from '~/mocks/fixtures/export_data';

import {
  ChartMetadata,
  Targets,
  UserOrbState,
  UpdateOrbStateArgs,
  TargetCategory,
} from '../types';

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
    gap: theme.spacing(2),
  },
  progressIndicators: {
    gap: theme.spacing(2),
  },
  bottomChartContainer: {
    gap: theme.spacing(2),
  },
  topChartContainer: {
    gap: theme.spacing(2),
  },
  leftBottomChartContainer: {
    gap: theme.spacing(2),
  },
}));

export const Dashboard = ({ sourceId }: { sourceId: string }) => {
  const {
    header,
    headerButtons,
    content,
    progressIndicators,
    bottomChartContainer,
    topChartContainer,
    leftBottomChartContainer,
  } = useStyles();
  const dispatch = useAppDispatch();

  /** all data, including 'name', 'version', etc */
  const approvalsGranted: HousingApprovalsData = useAppSelector(
      chartDataSelector(sourceId, 'approvalsGranted')
    ),
    progressionVsPlanning: ProgressionOfUnitsData = useAppSelector(
      chartDataSelector(sourceId, 'progressionVsPlanning')
    ),
    tenureHousingDelivery: TenureTypeHousingData = useAppSelector(
      chartDataSelector(sourceId, 'tenureHousingDelivery')
    ),
    totalHousingDelivery: TotalHousingDeliveryData = useAppSelector(
      chartDataSelector(sourceId, 'totalHousingDelivery')
    ),
    affordableHousingDelivery: AffordableHousingData = useAppSelector(
      chartDataSelector(sourceId, 'affordableHousingDelivery')
    ),
    deliverableSupplySummary: DeliverableSupplySummaryData = useAppSelector(
      chartDataSelector(sourceId, 'deliverableSupplySummary')
    );

  const user = useAppSelector(userSelector);
  const userOrbState = useAppSelector(userOrbStateSelector(sourceId));

  const [orbState, setOrbState] = useState<UserOrbState | null>(null);

  const [selectedDataset, setSelectedDataset] = useState<TargetCategory | null>(
    null
  );
  const [targetDialogVisible, setTargetDialogVisible] = useState(false);
  const [exportIsLoading, setExportIsLoading] = useState(false);

  const orbStateRef = useRef(orbState);

  // TODO: don't need this if using skeletons, eventually remove
  const dataIsLoaded =
    !!approvalsGranted &&
    !!progressionVsPlanning &&
    !!tenureHousingDelivery &&
    !!totalHousingDelivery &&
    !!affordableHousingDelivery &&
    !!deliverableSupplySummary;

  const { targets, settings } = orbState ?? {},
    orbStateIsLoaded = !!targets && !!settings;

  /** initialise orbState in state when fetched */
  useEffect(() => {
    if (!!userOrbState && !orbStateIsLoaded) {
      setOrbState(userOrbState);
    }
  }, [orbStateIsLoaded, orbState, userOrbState]);

  const updateOrbState = ({
    targets = {},
    settings = {},
  }: UpdateOrbStateArgs) =>
    setOrbState((prev) => ({
      targets: { ...(prev?.targets ?? {}), ...targets },
      settings: { ...(prev?.settings ?? {}), ...settings },
    }));

  const saveOrbState = useCallback(
    (data: UserOrbState) => {
      // TODO: why the guard?
      if (user) {
        dispatch(updateUserDashboardConfig({ user, sourceId, data }));
      }
    },
    [dispatch, sourceId, user]
  );

  useEffect(() => {
    apiMetadata.forEach(({ datasetName, url }) => {
      const chartMetadata: ChartMetadata = {
        sourceId,
        datasetName,
        url,
      };

      // TODO: Promise.all for this?
      dispatch(fetchDashboardData(chartMetadata));
    });
  }, [sourceId, dispatch]);

  /** 1. listener func must be reusable so that it can also be removed */
  /** 2. must check changes have been made to prevent firing every time */
  const saveSettingsHandler = useCallback(() => {
    /** is null before initialisation */
    if (!orbStateRef.current) return;

    const valuesObjects = Object.values(orbStateRef.current),
      changesMade = valuesObjects.some((obj) => !!Object.keys(obj).length);

    if (changesMade) saveOrbState(orbStateRef.current);
  }, [saveOrbState]);

  /**
   * update orbStateRef to be used in saving dashboard
   * settings every time orbState is updated
   */
  useEffect(() => {
    if (!orbState) return;

    orbStateRef.current = orbState;
  }, [orbState]);

  /** add event listener that covers user closing/refreshing tab */
  useEffect(() => {
    window.addEventListener('beforeunload', saveSettingsHandler);
  }, []);

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

  const handleAddTargetsClick = (targets: Targets) => {
    updateOrbState({ targets });
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

  // TODO: compose HousingDelivery

  if (!dataIsLoaded || !orbStateIsLoaded) return <LoadMaskFallback />;

  return (
    <>
      <Grid
        container
        justifyContent='space-between'
        alignItems='center'
        wrap='nowrap'
        className={header}
      >
        <Typography variant='h2'>Housing Delivery Dashboard</Typography>
        <Grid item container className={headerButtons}>
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

      <Grid item container direction='column' className={content}>
        <Grid item container wrap='nowrap' className={progressIndicators}>
          <ProgressIndicators
            totalData={totalHousingDelivery}
            tenureData={tenureHousingDelivery}
            targets={targets}
          />
        </Grid>

        <HousingDelivery
          totalHousingDeliveryData={totalHousingDelivery}
          tenureHousingDeliveryData={tenureHousingDelivery}
          targets={targets}
          settings={settings}
          updateOrbState={updateOrbState}
        />

        <Grid
          item
          container
          direction='column'
          className={bottomChartContainer}
        >
          <Grid item container wrap='nowrap' className={topChartContainer}>
            <DeliverableSupplySummary data={deliverableSupplySummary} />
            <HousingApprovals
              data={approvalsGranted}
              settings={settings}
              updateOrbState={updateOrbState}
            />
          </Grid>

          <Grid
            item
            container
            wrap='nowrap'
            className={leftBottomChartContainer}
          >
            <ProgressionVsPlanningSchedule
              data={progressionVsPlanning}
              settings={settings}
              updateOrbState={updateOrbState}
            />

            <AffordableHousingDelivery
              data={affordableHousingDelivery}
              targets={targets}
              settings={settings}
              updateOrbState={updateOrbState}
            />
          </Grid>
        </Grid>
      </Grid>

      <Dialog
        maxWidth='md'
        open={targetDialogVisible}
        onClose={closeDialog}
        aria-labelledby='targets-dialog'
      >
        <DialogTitle onClose={closeDialog}>
          {!!selectedDataset ? targetDatasets[selectedDataset] : 'Add Targets'}
        </DialogTitle>
        <DialogContent>
          {!!selectedDataset ? (
            <TargetForm
              onAddTargetsClick={(targets: Targets) =>
                handleAddTargetsClick(targets)
              }
              selectedDataset={selectedDataset}
              targets={targets}
            />
          ) : (
            <SelectForm
              onNextClick={(dataset: TargetCategory) =>
                setSelectedDataset(dataset)
              }
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

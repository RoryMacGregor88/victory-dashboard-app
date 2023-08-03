import { useCallback, useEffect, useRef, useState } from 'react';

import {
  CircularProgress,
  Dialog,
  DialogContent,
  Typography,
  makeStyles,
  useMediaQuery,
} from '@material-ui/core';

import { userSelector } from '~/accounts/accounts.slice';
import { Button, DialogTitle, Grid, LoadMaskFallback } from '~/components';
import { apiMetadata, targetDatasets } from '~/constants';
import {
  AffordableHousingDelivery,
  DeliverableSupplySummary,
  HousingApprovals,
  HousingDelivery,
  ProgressIndicators,
  ProgressionVsPlanningSchedule,
} from '~/dashboard/custom-charts';
import {
  chartDataSelector,
  fetchDashboardData,
  updateUserDashboardConfig,
  userOrbStateSelector,
} from '~/dashboard/dashboard-slice/dashboard.slice';
import {
  SelectForm,
  TargetForm,
} from '~/dashboard/target-dialog-screens/target-dialog-screens';
import { exportToCsv } from '~/dashboard/utils/utils';
import { useAppDispatch, useAppSelector } from '~/hooks';
import {
  AffordableHousingData,
  DeliverableSupplySummaryData,
  ExportData,
  HousingApprovalsData,
  ProgressionOfUnitsData,
  TenureTypeHousingData,
  TotalHousingDeliveryData,
} from '~/mocks/fixtures';
import {
  ChartMetadata,
  TargetCategory,
  Targets,
  UpdateOrbStateArgs,
  UserOrbState,
} from '~/types';

const useStyles = makeStyles((theme) => ({
  header: {
    padding: theme.spacing(4),
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    backgroundColor: theme.palette.background.default,
  },
  headerButtons: {
    width: 'fit-content',
  },
  content: {
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
  },
}));

export const Dashboard = ({ sourceId }: { sourceId: string }) => {
  const { header, headerButtons, content } = useStyles();
  const dispatch = useAppDispatch();

  /** all data, including 'name', 'version', etc */
  const approvalsGranted: HousingApprovalsData = useAppSelector(
      chartDataSelector(sourceId, 'approvalsGranted'),
    ),
    progressionVsPlanning: ProgressionOfUnitsData = useAppSelector(
      chartDataSelector(sourceId, 'progressionVsPlanning'),
    ),
    tenureHousingDelivery: TenureTypeHousingData = useAppSelector(
      chartDataSelector(sourceId, 'tenureHousingDelivery'),
    ),
    totalHousingDelivery: TotalHousingDeliveryData = useAppSelector(
      chartDataSelector(sourceId, 'totalHousingDelivery'),
    ),
    affordableHousingDelivery: AffordableHousingData = useAppSelector(
      chartDataSelector(sourceId, 'affordableHousingDelivery'),
    ),
    deliverableSupplySummary: DeliverableSupplySummaryData = useAppSelector(
      chartDataSelector(sourceId, 'deliverableSupplySummary'),
    );

  const user = useAppSelector(userSelector);
  const userOrbState = useAppSelector(userOrbStateSelector(sourceId));

  const [orbState, setOrbState] = useState<UserOrbState | null>(null);

  const [selectedDataset, setSelectedDataset] = useState<TargetCategory | null>(
    null,
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
    [dispatch, sourceId, user],
  );

  useEffect(() => {
    apiMetadata.forEach(({ datasetName, url }) => {
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
  }, [saveSettingsHandler]);

  /** remove listener and save settings if user navigates away in-app */
  useEffect(() => {
    const beforeUnload = () => {
      window.removeEventListener('beforeunload', saveSettingsHandler);
      saveSettingsHandler();
    };

    /** cleanup */
    return beforeUnload;
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

  /** app was created for desktops only */
  const isDesktopSize = useMediaQuery('(min-width:1500px)');

  if (!dataIsLoaded || !orbStateIsLoaded || !isDesktopSize) {
    const { innerWidth } = window;
    return (
      <LoadMaskFallback>
        {!isDesktopSize ? (
          <>
            <h1>Unable to load.</h1>
            <h3>
              This app is designed for screen sizes of 1500 pixels width or
              more.
            </h3>
            <h3>Your current device width is {innerWidth} pixels.</h3>
          </>
        ) : (
          <h1>Loading...</h1>
        )}
      </LoadMaskFallback>
    );
  }

  return (
    <>
      <Grid
        container
        alignItems="center"
        className={header}
        justifyContent="space-between"
        wrap="nowrap"
      >
        <Typography variant="h2">Housing Delivery Dashboard</Typography>
        <Grid container item className={headerButtons}>
          <Button size="small" onClick={handleExport}>
            {exportIsLoading ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              'Export'
            )}
          </Button>
          <Button size="small" onClick={() => setTargetDialogVisible(true)}>
            Add Targets
          </Button>
        </Grid>
      </Grid>

      <Grid container item className={content} direction="column">
        <Grid container item wrap="nowrap">
          <ProgressIndicators
            targets={targets}
            tenureData={tenureHousingDelivery}
            totalData={totalHousingDelivery}
          />
        </Grid>

        {/* parent component that wraps both Total Housing and
         * Tenure Housing charts
         */}
        <HousingDelivery
          settings={settings}
          targets={targets}
          tenureHousingDeliveryData={tenureHousingDelivery}
          totalHousingDeliveryData={totalHousingDelivery}
          updateOrbState={updateOrbState}
        />

        <Grid container item direction="column">
          <Grid container item wrap="nowrap">
            <DeliverableSupplySummary data={deliverableSupplySummary} />
            <HousingApprovals
              data={approvalsGranted}
              settings={settings}
              updateOrbState={updateOrbState}
            />
          </Grid>

          <Grid container item wrap="nowrap">
            <ProgressionVsPlanningSchedule
              data={progressionVsPlanning}
              settings={settings}
              updateOrbState={updateOrbState}
            />

            <AffordableHousingDelivery
              data={affordableHousingDelivery}
              settings={settings}
              targets={targets}
              updateOrbState={updateOrbState}
            />
          </Grid>
        </Grid>
      </Grid>

      <Dialog
        aria-labelledby="targets-dialog"
        maxWidth="md"
        open={targetDialogVisible}
        onClose={closeDialog}
      >
        <DialogTitle onClose={closeDialog}>
          {!!selectedDataset ? targetDatasets[selectedDataset] : 'Add Targets'}
        </DialogTitle>
        <DialogContent>
          {!!selectedDataset ? (
            <TargetForm
              selectedDataset={selectedDataset}
              targets={targets}
              onAddTargetsClick={(targets: Targets) =>
                handleAddTargetsClick(targets)
              }
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

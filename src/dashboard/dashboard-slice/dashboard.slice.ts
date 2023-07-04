import {
  createSlice,
  createSelector,
  createAsyncThunk,
  Dispatch,
} from '@reduxjs/toolkit';

import { User, UserOrbState, updateUser } from '../../accounts/accounts.slice';
import { userSelector } from '../../accounts/accounts.slice';

import { RootState } from '../../root.reducer';

type ChartData = { [key: string]: unknown }[];

export type DashboardState = {
  [sourceId: string]: {
    [datasetName: string]: ChartData;
  };
};

interface ChartMetadata {
  sourceId: string;
  datasetName: string;
  url: string;
}

interface Payload {
  payload: Omit<ChartMetadata, 'url'> & {
    data: ChartData;
  };
}

const name = 'dashboard';

export const initialState = {};

const dashboardSlice = createSlice({
  name,
  initialState,
  reducers: {
    setChartData: (state: DashboardState, { payload }: Payload) => {
      const { sourceId, datasetName, data } = payload;

      state[sourceId] = {
        ...state[sourceId],
        [datasetName]: data,
      };
    },
  },
});

export const fetchDashboardData = createAsyncThunk(
  `${name}/fetchDashboardData`,
  async (args: ChartMetadata, { rejectWithValue, dispatch }) => {
    const { sourceId, datasetName, url } = args;
    try {
      const data = await (await fetch(url)).json();
      dispatch(setChartData({ sourceId, datasetName, data }));
    } catch (e) {
      const error = e as Error;

      const { message } = error;
      return rejectWithValue({ message });
    }
  }
);

interface UpdateDashboardConfigArgs {
  user: User;
  sourceId: string;
  data: UserOrbState;
}

export const updateUserDashboardConfig =
  ({ user, sourceId, data }: UpdateDashboardConfigArgs) =>
  async (dispatch: Dispatch) => {
    const { targets, settings } = data;

    const { targets: currentTargets, settings: currentSettings } =
      user.orb_state[sourceId] ?? {};

    /** add dashboard data to existing 'profiles' property on user */
    const updatedUser: User = {
      ...user,
      orb_state: {
        ...user.orb_state,
        [sourceId]: {
          ...(user.orb_state[sourceId] ?? {}),
          targets: { ...(currentTargets ?? {}), ...targets },
          settings: { ...(currentSettings ?? {}), ...settings },
        },
      },
    };

    /** combines new 'profiles' property with rest of user */
    dispatch(updateUser({ user: updatedUser }));
  };

export const { setChartData } = dashboardSlice.actions;

const baseSelector = (state: RootState) => state?.dashboard;

export const chartDataSelector = (sourceId: string, datasetName: string) =>
  createSelector(baseSelector, (state) => state[sourceId][datasetName]);

export const userOrbStateSelector = (sourceId: string) =>
  createSelector(userSelector, (user) => user.orb_state[sourceId]);

export default dashboardSlice.reducer;

import {
  Dispatch,
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

import { User, updateUser, userSelector } from '~/accounts/accounts.slice';
import { RootState } from '~/store';
import { ChartData, ChartMetadata, UserOrbState } from '~/types';

export type DashboardState = {
  [sourceId: string]: {
    [datasetName: string]: ChartData;
  };
};

interface Payload {
  payload: Omit<ChartMetadata, 'url'> & {
    data: ChartData;
  };
}

const name = 'dashboard';

export const initialState: DashboardState = {
  mock_source_id: {},
};

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
      const res = await fetch(url);
      const data = await res.json();
      dispatch(setChartData({ sourceId, datasetName, data }));
    } catch (e) {
      const error = e as Error;

      const { message } = error;
      return rejectWithValue({ message });
    }
  },
);

export type UserConfigData = {
  user: User;
  sourceId: string;
  data: UserOrbState;
};

export const updateUserDashboardConfig =
  ({ user, sourceId, data }: UserConfigData) =>
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

const baseSelector = (state: RootState) => state.dashboard;

export const chartDataSelector = (sourceId: string, datasetName: string) =>
  createSelector(baseSelector, (state) => state[sourceId]?.[datasetName]);

export const userOrbStateSelector = (sourceId: string) =>
  createSelector(userSelector, (user) => user.orb_state[sourceId]);

export default dashboardSlice.reducer;

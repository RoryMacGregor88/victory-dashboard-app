import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import { NotificationManager } from 'react-notifications';

import { updateUser } from '../accounts/accounts.slice';
import { userSelector } from '../accounts/accounts.slice';

const name = 'dashboard';

export const initialState = {
  isLoading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name,
  initialState,
  reducers: {
    setChartData: (state, { payload }) => {
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
  async (props, { rejectWithValue, dispatch }) => {
    const { sourceId, datasetName, url } = props;

    try {
      const res = await fetch(url);
      const data = await res.json();

      dispatch(setChartData({ sourceId, datasetName, data }));
    } catch (error) {
      /** @type {import('api-client').ResponseError} */
      const { message, status } = error;
      NotificationManager.error(
        `${status} ${message}`,
        `Fetching Dashboard Data Error - ${message}`,
        50000,
        () => {}
      );
      return rejectWithValue({ message: `${status} ${message}` });
    }
  }
);

export const updateUserDashboardConfig =
  ({ user, sourceId, data }) =>
  async (dispatch) => {
    const { targets, settings } = data;

    const { targets: currentTargets, settings: currentSettings } =
      user.profiles.orbis_profile.orb_state[sourceId] ?? {};

    /** add dashboard data to existing 'profiles' property on user */
    const profiles = {
      orbis_profile: {
        ...user.profiles.orbis_profile,
        orb_state: {
          ...user.profiles.orbis_profile.orb_state,
          [sourceId]: {
            ...(user.profiles.orbis_profile.orb_state[sourceId] ?? {}),
            targets: { ...(currentTargets ?? {}), ...targets },
            settings: { ...(currentSettings ?? {}), ...settings },
          },
        },
      },
    };

    // combines new 'profiles' property with rest of user
    dispatch(updateUser({ profiles }));
  };

export const { setChartData } = dashboardSlice.actions;

/** @param {import('typings').RootState} state */
const baseSelector = (state) => state?.dashboard;

/** @param {import('typings').Source['source_id']} sourceId */
/** @param {string} datasetName */
export const chartDataSelector = (sourceId, datasetName) =>
  createSelector(baseSelector, (state) => state?.[sourceId]?.[datasetName]);

/** @param {import('typings').Source['source_id']} sourceId */
export const userOrbStateSelector = (sourceId) =>
  createSelector(
    userSelector,
    (user) => user?.profiles?.orbis_profile?.orb_state?.[sourceId] ?? {}
  );

export default dashboardSlice.reducer;

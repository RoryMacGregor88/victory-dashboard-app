import { createSelector, createSlice } from '@reduxjs/toolkit';

import { RootState } from '../store';
import { MOCK_USER } from '~/constants';

export type Targets = {
  [datasetName: string]: {
    [year: string]: number;
  };
};

export type Settings = {
  [settingName: string]: string | number;
};

export type UserOrbState = {
  targets: Targets;
  settings: Settings;
};

export type User = {
  orb_state: {
    [sourceId: string]: UserOrbState;
  };
};

export type AccountsState = {
  user: User | null;
};

type Payload = {
  payload: {
    user: User;
  };
};

const name = 'accounts';

export const initialState = {
  user: MOCK_USER,
};

const accountsSlice = createSlice({
  name,
  initialState,
  reducers: {
    updateUser: (state: AccountsState, { payload }: Payload) => {
      const { user } = payload;
      state.user = user;
    },
  },
});

export const { updateUser } = accountsSlice.actions;

const baseSelector = (state: RootState) => state?.accounts;

export const userSelector = createSelector(
  baseSelector,
  (accounts) => accounts?.user
);

export default accountsSlice.reducer;

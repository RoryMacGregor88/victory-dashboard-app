import { createSelector, createSlice } from '@reduxjs/toolkit';

import { RootState } from '../root.reducer';

import { MOCK_USER } from '../constants';

export type UserOrbState = {
  targets: { [key: string]: number };
  settings: { [key: string]: string };
};

export type User = {
  orb_state: {
    [sourceId: string]: UserOrbState;
  };
};

export type AccountsState = {
  user: User;
  error: null;
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
    updateUser: (state, { payload }) => {
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

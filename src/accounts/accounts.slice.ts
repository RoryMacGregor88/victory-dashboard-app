import { createSelector, createSlice } from '@reduxjs/toolkit';

import { MOCK_USER } from '~/constants';
import { RootState } from '~/store';
import { UserOrbState } from '~/types';

export type User = {
  orb_state: {
    [sourceId: string]: UserOrbState;
  };
};

export type AccountsState = {
  user: User;
};

type Payload = {
  payload: {
    user: User;
  };
};

const name = 'accounts';

export const initialState: AccountsState = {
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

const baseSelector = (state: RootState) => state.accounts;

export const userSelector = createSelector(
  baseSelector,
  (accounts) => accounts.user,
);

export default accountsSlice.reducer;

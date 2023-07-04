import { createSelector, createSlice } from '@reduxjs/toolkit';

import { MOCK_USER } from '../constants';

type State = {
  user: {
    orb_state: { [key: string]: unknown };
  };
  error: null;
};

type Payload = {
  payload: {
    user: unknown; // TODO: real user type
  };
};

const name = 'accounts';

export const initialState = {
  user: MOCK_USER,
  error: null,
};

const accountsSlice = createSlice({
  name,
  initialState,
  reducers: {
    updateUser: (state: State, { payload }: Payload) => {
      const { user } = payload;
      state.user = user;
    },
  },
});

export const { updateUser } = accountsSlice.actions;

/** @param {import('typings').RootState} state */
const baseSelector = (state) => state?.accounts;

export const userSelector = createSelector(
  baseSelector,
  (accounts) => accounts?.user
);

export default accountsSlice.reducer;

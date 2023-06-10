import { createSelector, createSlice } from '@reduxjs/toolkit';

import { MOCK_USER } from '../constants';

const name = 'accounts';

export const initialState = {
  user: MOCK_USER,
  error: null,
};

const accountsSlice = createSlice({
  name,
  initialState,
  reducers: {
    updateUser: (state, { payload }) => {
      const { sourceId, datasetName, data } = payload;

      state[sourceId] = {
        ...state[sourceId],
        [datasetName]: data,
      };
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

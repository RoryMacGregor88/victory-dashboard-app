import { combineReducers } from 'redux';

import accounts, { AccountsState } from './accounts/accounts.slice';

import dashboard, {
  DashboardState,
} from './dashboard/dashboard-slice/dashboard.slice';

export type RootState = {
  accounts: AccountsState;
  dashboard: DashboardState;
};

export const createRootReducer = () => combineReducers({ accounts, dashboard });

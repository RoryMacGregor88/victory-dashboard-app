import { combineReducers } from 'redux';

import accounts from './accounts/accounts.slice';
import dashboard from './dashboard/dashboard-slice/dashboard.slice';

export const createRootReducer = () => combineReducers({ accounts, dashboard });

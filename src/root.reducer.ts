import { combineReducers } from 'redux';

import dashboard from './dashboard/dashboard.slice';

export const createRootReducer = () => combineReducers({ dashboard });

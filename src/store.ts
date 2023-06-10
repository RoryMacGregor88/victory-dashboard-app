import { configureStore } from '@reduxjs/toolkit';
import { createRootReducer } from './root.reducer';

const store = configureStore({
  reducer: createRootReducer(),
});

export default store;

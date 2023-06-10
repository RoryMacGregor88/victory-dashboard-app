import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { CssBaseline } from '@material-ui/core';
import store from './store';
import App from './App.tsx';

const { worker } = await import('./mocks/browser.ts');
worker.start();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <CssBaseline>
      <Provider store={store}>
        <App />
      </Provider>
    </CssBaseline>
  </React.StrictMode>
);

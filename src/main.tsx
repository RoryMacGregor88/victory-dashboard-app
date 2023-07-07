import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import store from './store';
import App from './App.tsx';
import theme from './themes/index.ts';

/** mock server used to mimic the real backend that the dashboard uses in real life */
const { worker } = await import('./mocks/browser.ts');
worker.start();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <CssBaseline>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </Provider>
    </CssBaseline>
  </StrictMode>
);

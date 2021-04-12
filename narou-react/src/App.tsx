//import './App.css';
import { SWRConfig } from 'swr';
import { DateTime, Duration } from 'luxon';
import preval from 'preval.macro'
import { NarouUpdates } from './NarouUpdates';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { useMemo } from 'react';
import { CssBaseline, useMediaQuery } from '@material-ui/core';

const IgnoreDuration = Duration.fromObject({ days: 30 });
const PollingInterval = 5 * 60 * 1000; // 5分ごとにポーリング

const buildDate: string = preval`module.exports = new Date().toISOString();`

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SWRConfig value={{
        refreshInterval: PollingInterval,
        fetcher: (args) => fetch(args, {
          credentials: 'include',
        }).then(res => {
          if (!res.ok) {
            class FetchError extends Error {
              status: number = 0;
              name = 'FetchError';
            }
            const error = new FetchError(`failed to fetch: status=${res.status}`);
            error.status = res.status;
            throw error;
          }
          return res.json();
        })
      }}>
        <NarouUpdates ignoreDuration={IgnoreDuration} />
      </SWRConfig>
      <div style={{
        display: "inline-block",
        position: "fixed",
        bottom: 0,
        right: 0,
        fontSize: "small",
        fontStyle: "italic"
      }}>narou-react: {DateTime.fromISO(buildDate).toISO()}</div>
    </ThemeProvider>
  );
}

export default App;

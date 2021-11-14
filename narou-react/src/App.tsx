//import './App.css';
import { CssBaseline, Link, Typography, useMediaQuery } from '@mui/material';
import { cyan } from '@mui/material/colors';
import { createTheme, StyledEngineProvider, Theme, ThemeProvider } from '@mui/material/styles';
import { DateTime } from 'luxon';
import React, { useEffect, useMemo, useState } from 'react';
import { SWRConfig } from 'swr';
import { NarouApi } from './narouApi/NarouApi';
import { NarouUpdates } from './NarouUpdates';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme { }
}

const PollingInterval = 5 * 60 * 1000; // 5分ごとにポーリング

function getServerAddress(location: Location): string {
  const server = new URLSearchParams(location.search).get('server')
  if (server) {
    return server;
  }
  if (location.protocol === 'http:') {
    return 'http://localhost:7676';
  }
  // github.io であればAPIは置けないから除外
  if (!/.*\.github\.io$/.test(location.hostname)) {
    // 置いてるサイトにAPIがあると期待する
    return location.protocol + '//' + location.host + location.pathname;
  }
  return '';
}

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
          primary: cyan,
        },
      }),
    [prefersDarkMode],
  );

  const [api, setApi] = useState<NarouApi | null>(null);
  const [hostError, setHostError] = useState(false);
  useEffect(() => {
    const host = getServerAddress(document.location);
    if (host) {
      setApi(new NarouApi(host));
    } else {
      setHostError(true);
    }
  }, [])

  if (hostError) {
    return (
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Typography>http以外の場合は必ず server クエリパラメータにサーバーアドレスを指定してください</Typography>
          <Link href="https://github.com/koizuka/narou-watcher/">GitHub</Link>
        </ThemeProvider>
      </StyledEngineProvider>
    );
  }

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SWRConfig value={{
          refreshInterval: PollingInterval,
        }}>
          {api && <NarouUpdates api={api} />}
        </SWRConfig>
        <div style={{
          display: "inline-block",
          position: "fixed",
          bottom: 0,
          right: 0,
          fontSize: "small",
          fontStyle: "italic",
        }}>narou-react: {DateTime.fromISO(import.meta.env.BUILD_DATE as string).toISO()}</div>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;

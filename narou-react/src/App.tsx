//import './App.css';
import { SWRConfig } from 'swr';
import { DateTime, Duration } from 'luxon';
import preval from 'preval.macro'
import { NarouUpdates } from './NarouUpdates';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { useEffect, useMemo, useState } from 'react';
import { CssBaseline, Link, Typography, useMediaQuery } from '@material-ui/core';
import { NarouApi } from './NarouApi';
import { cyan } from '@material-ui/core/colors';

const IgnoreDuration = Duration.fromObject({ days: 30 });
const PollingInterval = 5 * 60 * 1000; // 5分ごとにポーリング

const buildDate: string = preval`module.exports = new Date().toISOString();`

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
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
          primary: cyan,
        },
      }),
    [prefersDarkMode],
  );

  const [api, setApi] = useState<NarouApi | null>(null);
  useEffect(() => {
    const host = getServerAddress(document.location);
    setApi(host ? new NarouApi(host) : null);
  }, [])

  if (!api) {
    return (
      <ThemeProvider theme={theme}>
        <Typography>http以外の場合は必ず server クエリパラメータにサーバーアドレスを指定してください</Typography>
        <Link href="https://github.com/koizuka/narou-watcher/">GitHub</Link>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SWRConfig value={{
        refreshInterval: PollingInterval,
      }}>
        <NarouUpdates api={api} ignoreDuration={IgnoreDuration} />
      </SWRConfig>
      <div style={{
        display: "inline-block",
        position: "fixed",
        bottom: 0,
        right: 0,
        fontSize: "small",
        fontStyle: "italic",
      }}>narou-react: {DateTime.fromISO(buildDate).toISO()}</div>
    </ThemeProvider>
  );
}

export default App;

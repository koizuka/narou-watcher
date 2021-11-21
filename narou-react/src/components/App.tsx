//import './App.css';
import { CssBaseline, Link, Typography } from '@mui/material';
import { StyledEngineProvider, Theme, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { SWRConfig } from 'swr';
import { useNarouApi } from '../hooks/useNarouApi';
import { BuildTimestamp } from './BuildTimestamp';
import { NarouUpdates } from './NarouUpdates';
import { useAutoDarkMode } from '../hooks/useAutoDarkMode';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme { }
}

const PollingInterval = 5 * 60 * 1000; // 5分ごとにポーリング

function App() {
  const theme = useAutoDarkMode();
  const [api, hostError] = useNarouApi();

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
        <BuildTimestamp name="narou-react" />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;

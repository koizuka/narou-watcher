import { useMediaQuery } from '@mui/material';
import { cyan } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
import { useMemo } from 'react';

export function useAutoDarkMode() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () => createTheme({
      palette: {
        mode: prefersDarkMode ? 'dark' : 'light',
        primary: cyan,
      },
    }),
    [prefersDarkMode]
  );

  return theme;
}

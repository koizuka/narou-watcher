import {
  AppBar,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Fab,
  FormControlLabel,
  Switch,
  Toolbar
} from '@mui/material';
import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useAppBadge, useClientBadge } from '../hooks/useAppBadge';
import { useBookmark } from '../hooks/useBookmark';
import { useHotKeys } from '../hooks/useHotKeys';
import { IsNoticeListItem } from "../narouApi/IsNoticeListItem";
import { NarouApi } from '../narouApi/NarouApi';
import { clearCache, useIsNoticeList } from '../narouApi/useIsNoticeList';
import { InitialItemsState, itemsStateReducer, SelectCommand } from '../reducer/ItemsState';
import { BookmarkSelector } from './BookmarkSelector';
import { NarouLoginForm } from './NarouLoginForm';
import { NarouUpdateList } from './NarouUpdateList';
import { OpenConfirmDialog } from './OpenConfirmDialog';

const UserTopURL = 'https://syosetu.com/user/top/';
const UserTopName = 'ユーザーホーム';
const R18UserTopURL = 'https://syosetu.com/xuser/top/';
const R18UserTopName = 'Xユーザーホーム';

function maxPageValue(sw: boolean): number {
  return sw ? 2 : 1;
}

function R18SwitchRaw({ enableR18, setEnableR18 }: {
  enableR18: boolean;
  setEnableR18: (enableR18: boolean) => void;
}) {
  return (
    <FormControlLabel
      label="R18"
      control={
        <Switch
          checked={enableR18}
          onChange={event => setEnableR18(event.target.checked)}
        />}
    />
  );
}
const R18Switch = React.memo(R18SwitchRaw);

function NarouUpdateScreen({ server, onUnauthorized }: { server: NarouApi, onUnauthorized: () => void }) {
  const [enableR18, setEnableR18] = useState(false);
  const [maxPage, setMaxPage] = useState(maxPageValue(false));

  const [bookmark, setBookmark, bookmarks] = useBookmark(server, enableR18);
  const { data: rawItems, error } = useIsNoticeList(server, { enableR18, maxPage, bookmark });

  const [{ items, numNewItems, selectedIndex }, dispatch] = useReducer(itemsStateReducer, InitialItemsState)

  useEffect(() => {
    dispatch({ type: 'set', items: rawItems, bookmark: bookmark !== 0 })
  }, [bookmark, rawItems]);
  const setSelectedIndex = useCallback((index: number) => dispatch({ type: 'select', index }), []);
  const selectCommand = useCallback((command: SelectCommand) => dispatch({ type: 'select-command', command }), []);
  const selectDefault = useCallback(() => selectCommand('default'), [selectCommand]);

  const [confirm, setConfirm] = useState<IsNoticeListItem | undefined>(undefined);

  const { setAppBadge, clearAppBadge } = useAppBadge();
  const { setClientBadge, clearClientBadge } = useClientBadge();

  const userTopURL = enableR18 ? R18UserTopURL : UserTopURL;

  useEffect(() => {
    if (numNewItems !== null) {
      document.title = `なろう 未読:${numNewItems}`;
      if (numNewItems) {
        setAppBadge(numNewItems);
        setClientBadge(numNewItems);
      } else {
        clearAppBadge();
        clearClientBadge();
      }
    }
  }, [clearAppBadge, clearClientBadge, numNewItems, setAppBadge, setClientBadge]);

  const defaultRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (selectedIndex === -1) {
      defaultRef.current?.focus();
    }
  }, [selectedIndex]);

  useHotKeys(useMemo(() => ({
    'r': () => setEnableR18(v => !v),
    '1': () => setMaxPage(v => maxPageValue(v === maxPageValue(false))),
    'h': () => window.open(userTopURL, '_blank'),
  }), [userTopURL]));

  const onClose = useCallback(() => setConfirm(undefined), []);

  if (error) {
    console.log(`error = ${error}`);
    if (error.status === 401) {
      onUnauthorized();
    }
    return <div>
      Server({JSON.stringify(server.baseUrl)}) is not working...?
      <button onClick={() => window.location.reload()}>reload</button>
      <p>status: {error.status}</p>
      <code>{error.message}</code>
    </div>;
  }
  if (!items) {
    return <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
      <CircularProgress color="inherit" />
    </Backdrop>
  }

  return <>
    <OpenConfirmDialog api={server} item={confirm} onClose={onClose} />
    <AppBar position="sticky">
      <Toolbar>
        <Box>
          <R18Switch enableR18={enableR18} setEnableR18={setEnableR18} />
        </Box>
        <Box>
          <BookmarkSelector bookmarks={bookmarks} bookmark={bookmark} onChangeBookmark={setBookmark} />
        </Box>
        <Box m={2}>未読: {numNewItems ?? ''}</Box>
        <Button
          variant="contained"
          disabled={selectedIndex === 0}
          disableRipple={true}
          ref={defaultRef}
          onClick={selectDefault}>ESC</Button>
      </Toolbar>
    </AppBar>
    <Box display="flex" alignItems="center" flexDirection="column" bgcolor="background.paper">
      <Box maxWidth={600}>
        <NarouUpdateList items={items}
          selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex}
          selectCommand={selectCommand}
          onSecondaryAction={setConfirm}
        />
      </Box>
      <Box position="fixed" right="20px" bottom="20px">
        <Fab
          variant="extended"
          size="small"
          component="a"
          href={userTopURL}
          target="_blank"
        >{enableR18 ? R18UserTopName : UserTopName}</Fab>
      </Box>
    </Box>
  </>;
}

export function NarouUpdates({ api }: { api: NarouApi }) {
  const [loginMode, setLoginMode] = useState(false);

  const onUnauthorized = useCallback(() => {
    setTimeout(() => {
      clearCache();
      setLoginMode(true)
    }, 0);
  }, []);

  if (loginMode) {
    return <NarouLoginForm api={api} onLogin={() => {
      console.log('logged in!');
      clearCache();
      setLoginMode(false);
    }} />
  }

  return (
    <>
      <NarouUpdateScreen server={api}
        onUnauthorized={onUnauthorized} />
      <Button onClick={async () => {
        await api.logout();
        clearCache();
        setLoginMode(true);
      }}>logout</Button>
    </>
  );
}

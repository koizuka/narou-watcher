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
import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { useAppBadge, useClientBadge } from '../hooks/useAppBadge';
import { useHotKeys } from '../hooks/useHotKeys';
import { IsNoticeListItem } from "../narouApi/IsNoticeListItem";
import { NarouApi } from '../narouApi/NarouApi';
import { clearCache, useIsNoticeList } from '../narouApi/useIsNoticeList';
import { InitialItemsState, itemsStateReducer } from '../reducer/ItemsState';
import { BookmarkSelector } from './BookmarkSelector';
import { NarouLoginForm } from './NarouLoginForm';
import { NarouUpdateList } from './NarouUpdateList';
import { OpenConfirmDialog } from './OpenConfirmDialog';
import { useBookmark } from '../hooks/useBookmark';

const UserTopURL = 'https://syosetu.com/user/top/';

function maxPageValue(sw: boolean): number {
  return sw ? 2 : 1;
}

function NarouUpdateScreen({ server, onUnauthorized }: { server: NarouApi, onUnauthorized: () => void }) {
  const [enableR18, setEnableR18] = useState(false);
  const [maxPage, setMaxPage] = useState(maxPageValue(false));

  const [bookmark, setBookmark, bookmarks] = useBookmark(server);
  const { data: rawItems, error } = useIsNoticeList(server, { enableR18, maxPage, bookmark });

  const [{ items, numNewItems, selectedIndex }, dispatch] = useReducer(itemsStateReducer, InitialItemsState)

  useEffect(() => {
    dispatch({ type: 'set', items: rawItems })
  }, [rawItems]);
  const setSelectedIndex = (index: number) => dispatch({ type: 'select', index });
  const selectDefault = () => dispatch({ type: 'default' });

  const [confirm, setConfirm] = useState<IsNoticeListItem | undefined>(undefined);

  const { setAppBadge, clearAppBadge } = useAppBadge();
  const { setClientBadge, clearClientBadge } = useClientBadge();

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

  const [setHotKeys] = useHotKeys();

  useEffect(() => {
    setHotKeys({
      'r': () => setEnableR18(v => !v),
      '1': () => setMaxPage(v => maxPageValue(v === maxPageValue(false))),
      'h': () => window.open(UserTopURL, '_blank'),
    });
  }, [setHotKeys]);

  if (error) {
    console.log(`error = ${error}`);
    if (error.status === 401) {
      onUnauthorized();
    }
    return <div onClick={() => window.location.reload()}>
      <p>Server({JSON.stringify(server.baseUrl)}) is not working...?</p>
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
    <OpenConfirmDialog api={server} item={confirm} onClose={() => setConfirm(undefined)} />
    <AppBar position="sticky">
      <Toolbar>
        <Box>
          <FormControlLabel
            label="R18"
            control={
              <Switch
                checked={enableR18}
                onChange={event => setEnableR18(event.target.checked)}
              />}
          />
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
          onClick={() => selectDefault()}>ESC</Button>
      </Toolbar>
    </AppBar>
    <Box m={2} display="flex" alignItems="center" flexDirection="column" bgcolor="background.paper">
      <Box maxWidth={600}>
        <NarouUpdateList items={items}
          selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex}
          selectDefault={selectDefault}
          onClick={setConfirm}
        />
      </Box>
      <Box position="fixed" right="20px" bottom="20px">
        <Fab
          variant="extended"
          size="small"
          disableRipple={true}
          component="a"
          href={UserTopURL}
          target="_blank"
        >ユーザーホーム</Fab>
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

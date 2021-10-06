import {
  AppBar,
  Avatar,
  Backdrop,
  Badge,
  BadgeTypeMap,
  Box,
  Button,
  CircularProgress,
  createStyles,
  Fab,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Switch,
  Theme,
  Toolbar
} from '@material-ui/core';
import { Book, Info } from '@material-ui/icons';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';
import BookmarkSelector from './BookmarkSelector';
import { IsNoticeListItem, itemSummary, nextLink, unread } from "./narouApi/IsNoticeListItem";
import { NarouApi } from './narouApi/NarouApi';
import { BookmarkInfo, useBookmarkInfo } from './narouApi/useBookmarkInfo';
import { clearCache, useIsNoticeList } from './narouApi/useIsNoticeList';
import { NarouLoginForm } from './NarouLoginForm';
import { OpenConfirmDialog } from './OpenConfirmDialog';
import { InitialItemsState, itemsStateReducer } from './reducer/ItemsState';
import { useAppBadge, useClientBadge } from './useAppBadge';
import { useHotKeys } from './useHotKeys';

const UserTopURL = 'https://syosetu.com/user/top/';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }),
);

function badgeProps(item: IsNoticeListItem): BadgeTypeMap['props'] {
  if (item.latest < item.bookmark) {
    return { color: 'secondary', badgeContent: '!' };
  }
  return { color: 'primary', badgeContent: unread(item) };
}

function maxPageValue(sw: boolean): number {
  return sw ? 2 : 1;
}

export function nextBookmark(bookmarks: BookmarkInfo, cur: number): number {
  const numbers = Object.keys(bookmarks).map(k => Number(k));
  for (const i of numbers) {
    if (i > cur) {
      return i;
    }
  }
  return 0;
}

export function prevBookmark(bookmarks: BookmarkInfo, cur: number): number {
  const numbers = [0, ...Object.keys(bookmarks).map(k => Number(k))];
  const i = numbers.findIndex(i => i >= cur);
  if (i > 0) {
    return numbers[i - 1];
  }
  return numbers[numbers.length - 1];
}

function NarouUpdateList({ server, onUnauthorized }: { server: NarouApi, onUnauthorized: () => void }) {
  const classes = useStyles();

  const [enableR18, setEnableR18] = useState(false);
  const [maxPage, setMaxPage] = useState(maxPageValue(false));
  const [bookmark, setBookmark] = useState(0);

  const { data: rawItems, error } = useIsNoticeList(server, { enableR18, maxPage, bookmark });
  const { data: bookmarks } = useBookmarkInfo(server, false);

  const [{ items, numNewItems, selectedIndex, defaultIndex }, dispatch] = useReducer(itemsStateReducer, InitialItemsState)

  useEffect(() => {
    dispatch({ type: 'set', items: rawItems })
  }, [rawItems]);
  const setSelectedIndex = (index: number) => dispatch({ type: 'select', index });

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

  const scrollIn = useCallback(node => {
    if (node) {
      scrollIntoView(node, { behavior: 'smooth', scrollMode: 'if-needed' });
      node.focus();
    }
  }, []);

  const defaultRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (selectedIndex === -1) {
      defaultRef.current?.focus();
    }
  }, [selectedIndex]);

  const [setHotKeys] = useHotKeys();

  useEffect(() => {
    if (items) {
      const len = items.length;
      const arrowUp = (event: KeyboardEvent) => {
        event.preventDefault();
        dispatch({ type: 'select', index: selectedIndex - 1 });
      }
      const arrowDown = (event: KeyboardEvent) => {
        event.preventDefault();
        dispatch({ type: 'select', index: selectedIndex + 1 });
      }

      setHotKeys({
        ...(selectedIndex > 0 && {
          'ArrowUp': arrowUp,
          'k': arrowUp,
        }),
        ...(selectedIndex < len - 1 && {
          'ArrowDown': arrowDown,
          'j': arrowDown,
        }),
        ...(len > 0 && {
          'Home': () => setSelectedIndex(0),
          'End': () => setSelectedIndex(len - 1),
          'Escape': () => setSelectedIndex(defaultIndex),
        }),
        'r': () => setEnableR18(v => !v),
        '1': () => setMaxPage(v => maxPageValue(v === maxPageValue(false))),
        'h': () => window.open(UserTopURL, '_blank'),
        ...(bookmarks && {
          'b': () => setBookmark(nextBookmark(bookmarks, bookmark)),
          'shift+B': () => setBookmark(prevBookmark(bookmarks, bookmark)),
        })
      });
    }
  }, [selectedIndex, defaultIndex, items, bookmarks, bookmark, setHotKeys]);

  const buttonProps = useCallback((item: IsNoticeListItem) => {
    if (unread(item) > 0) {
      return {
        component: 'a',
        href: nextLink(item),
        onClick: () => setSelectedIndex(-1), // workaround against remaining focus style
        target: '_blank',
      };
    } else {
      return { disabled: true };
    }
  }, []);

  if (error) {
    console.log('error =', error);
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
    return <Backdrop className={classes.backdrop} open={true}>
      <CircularProgress color="inherit" />
    </Backdrop>
  }

  return (
    <>
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
            onClick={() => setSelectedIndex(defaultIndex)}>ESC</Button>
        </Toolbar>
      </AppBar>
      <Box m={2} display="flex" alignItems="center" flexDirection="column" bgcolor="background.paper">
        <Box maxWidth={600}>
          <List>
            {items?.map((item, index) =>
              <ListItem key={item.base_url} button={true}
                {...(index === selectedIndex ? { selected: true, ref: scrollIn } : {})}
                disableRipple={true}
                onFocusVisible={() => setSelectedIndex(index)}
                {...buttonProps(item)} >
                <ListItemAvatar>
                  <Badge overlap="circular" {...badgeProps(item)} >
                    <Avatar>
                      <Book color={item.isR18 ? "secondary" : undefined} />
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={itemSummary(item)}
                  secondary={`${item.update_time.toFormat('yyyy/LL/dd HH:mm')} 更新  作者:${item.author_name}`} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => setConfirm(item)} disableRipple={true}>
                    <Info />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>)}
          </List>
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
    </>
  );
}

export function NarouUpdates({ api }: { api: NarouApi }) {
  const [loginMode, setLoginMode] = useState(false);

  if (loginMode) {
    return <NarouLoginForm api={api} onLogin={() => {
      console.log('logged in!');
      clearCache();
      setLoginMode(false);
    }} />
  }

  return (
    <>
      <NarouUpdateList server={api}
        onUnauthorized={() => {
          clearCache();
          setLoginMode(true)
        }} />
      <Button onClick={async () => {
        await api.logout();
        clearCache();
        setLoginMode(true);
      }}>logout</Button>
    </>
  );
}

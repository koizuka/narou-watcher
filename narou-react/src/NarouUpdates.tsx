import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  FormControlLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Switch,
  Theme,
  Toolbar,
} from '@material-ui/core';
import { Book } from '@material-ui/icons';
import { clearCache, useIsNoticeList } from './useIsNoticeList';
import { IsNoticeListItem, itemSummary, nextLink, unread } from "./IsNoticeListItem";
import { NarouLoginForm } from './NarouLoginForm';
import { NarouApi } from './NarouApi';
import scrollIntoView from 'scroll-into-view-if-needed';
import { OpenConfirmDialog } from './OpenConfirmDialog';

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

function NarouUpdateList({ server, onUnauthorized }: { server: NarouApi, onUnauthorized: () => void }) {
  const classes = useStyles();

  const [enableR18, setEnableR18] = useState(false);
  const [maxPage, setMaxPage] = useState(maxPageValue(false));
  const [bookmark1, setBookmark1] = useState(false);

  const { data: items, error } = useIsNoticeList(server, { enableR18, maxPage, bookmark1 });

  const unreads = useMemo(() => items ? items.filter(i => i.bookmark < i.latest).length : null, [items]);

  const [confirm, setConfirm] = useState<IsNoticeListItem | undefined>(undefined);

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [defaultIndex, setDefaultIndex] = useState(-1);

  useEffect(() => {
    if (unreads !== null) {
      document.title = `なろう 未読:${unreads}`;
    }
  }, [unreads]);

  const scrollIn = useCallback(node => {
    if (node) {
      scrollIntoView(node, { behavior: 'smooth', scrollMode: 'if-needed' });
      node.focus();
    }
  }, []);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [enableR18, maxPage]);

  useEffect(() => {
    const index = items && items.length > 0 && unread(items[0]) > 0 ? 0 : -1;

    setDefaultIndex(index);
    setSelectedIndex(index);
  }, [items]);

  const defaultRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (selectedIndex === -1) {
      defaultRef.current?.focus();
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (items) {
      const onKeyDown = (event: KeyboardEvent) => {
        const len = items.length;
        switch (event.key) {
          case 'ArrowUp':
            if (selectedIndex > 0) {
              event.preventDefault();
            }
            setSelectedIndex(i => i > 0 ? i - 1 : 0);
            break;
          case 'ArrowDown':
            if (selectedIndex < len - 1) {
              event.preventDefault();
            }
            setSelectedIndex(i => i < len ? i + 1 : len - 1);
            break;
          case 'Home':
            setSelectedIndex(0);
            break;
          case 'End':
            setSelectedIndex(len - 1);
            break;
          case 'Escape':
            setSelectedIndex(defaultIndex);
            break;
          case 'r':
            setEnableR18(v => !v);
            break;
          case 'b':
            setBookmark1(v => !v);
            break;
          case '1':
            setMaxPage(v => maxPageValue(v === maxPageValue(false)));
            break;

        }
      };
      document.addEventListener('keydown', onKeyDown, false);
      return () => {
        document.removeEventListener('keydown', onKeyDown);
      };
    }
  }, [selectedIndex, defaultIndex, items]);

  const buttonProps = useCallback((item: IsNoticeListItem) => {
    if (unread(item) > 0) {
      return {
        component: 'a',
        href: nextLink(item),
        onClick: () => setSelectedIndex(-1), // workaround against remaining focus style
        target: '_blank',
      };
    } else {
      return { onClick: () => setConfirm(item) };
    }
  }, [setConfirm]);

  if (error) {
    console.log('error =', error);
    if (error.status === 401) {
      onUnauthorized();
    }
    return <div>Server({JSON.stringify(server)}) is not working...? status: ${error.status}</div>;
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
            <FormControlLabel
              label="BM1"
              control={
                <Switch
                  checked={bookmark1}
                  onChange={event => setBookmark1(event.target.checked)}
                />}
            />
          </Box>
          <Box m={2}>未読: {unreads ?? ''}</Box>
          <Button
            variant="contained"
            disabled={selectedIndex === 0}
            disableRipple={true}
            ref={defaultRef}
            onClick={() => setSelectedIndex(defaultIndex)}>ESC</Button>
        </Toolbar>
      </AppBar>
      <Box m={2} display="flex" flexDirection="column" bgcolor="background.paper">
        <List>
          {items?.map((item, index) =>
            <ListItem key={item.base_url} button={true}
              {...(index === selectedIndex ? { selected: true, ref: scrollIn } : {})}
              disableRipple={true}
              onFocusVisible={() => setSelectedIndex(index)}
              {...buttonProps(item)} >
              <ListItemAvatar>
                <Badge overlap="circle" {...badgeProps(item)} >
                  <Avatar>
                    <Book color={item.isR18 ? "secondary" : undefined} />
                  </Avatar>
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={itemSummary(item)}
                secondary={`${item.update_time.toFormat('yyyy/LL/dd HH:mm')} 更新  作者:${item.author_name}`} />
            </ListItem>)}
        </List>
      </Box >
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

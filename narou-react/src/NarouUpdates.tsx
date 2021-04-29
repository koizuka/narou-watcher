import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppBar, Avatar, Badge, BadgeTypeMap, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, List, ListItem, ListItemAvatar, ListItemText, Switch, Toolbar } from '@material-ui/core';
import { Book } from '@material-ui/icons';
import { clearCache, IsNoticeListItem, useIsNoticeList } from './useIsNoticeList';
import { NarouLoginForm } from './NarouLoginForm';
import { NarouApi } from './NarouApi';
import scrollIntoView from 'scroll-into-view-if-needed';

function nextLink(item: IsNoticeListItem): string {
  if (item.bookmark >= item.latest) {
    return `${item.base_url}${item.latest}/`;
  }
  return `${item.base_url}${item.bookmark + 1}/`;
}

function hasUnread(item: IsNoticeListItem): boolean {
  return item.latest > item.bookmark;
}

function itemSummary(item: IsNoticeListItem): string {
  const fields = [item.title, ' ('];
  if (hasUnread(item)) {
    fields.push(`${item.bookmark}/`);
  }
  fields.push(`${item.latest})`);
  if (item.completed) {
    fields.push('[完結]');
  }
  return fields.join('');
}

function unread(item: IsNoticeListItem): number {
  return Math.max(item.latest - item.bookmark, 0);
}

function badgeProps(item: IsNoticeListItem): BadgeTypeMap['props'] {
  if (item.latest < item.bookmark) {
    return { color: 'secondary', badgeContent: '!' };
  }
  return { color: 'primary', badgeContent: unread(item) };
}

function OpenConfirmDialog({ item, onClose }: { item?: IsNoticeListItem, onClose: () => void }) {
  return (
    <Dialog open={!!item} onClose={onClose}>
      <DialogTitle>{item?.title}</DialogTitle>
      <DialogContent>作者:{item?.author_name}</DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={() => {
          if (item) window.open(item.base_url, '_blank');
          onClose();
        }}>小説ページ</Button>
        <Button variant="contained" onClick={() => {
          if (item) window.open(nextLink(item), '_blank');
          onClose();
        }}>最新{item?.latest}部分</Button>
        <Button variant="contained" onClick={() => onClose()}>キャンセル</Button>
      </DialogActions>
    </Dialog>
  );
}

function NarouUpdateList({ server, onUnauthorized }: { server: NarouApi, onUnauthorized: () => void }) {
  const [enableR18, setEnableR18] = useState(false);
  const { data: items, error } = useIsNoticeList(server, { enableR18 });

  const unreads = useMemo(() => items ? items.filter(i => i.bookmark < i.latest).length : 0, [items]);

  const [confirm, setConfirm] = useState<IsNoticeListItem | undefined>(undefined);

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [defaultIndex, setDefaultIndex] = useState(-1);

  useEffect(() => {
    document.title = `なろう 未読:${unreads}`;
  }, [unreads]);

  const scrollIn = useCallback(node => {
    if (node) {
      scrollIntoView(node, { behavior: 'smooth', scrollMode: 'if-needed' });
      node.focus();
    }
  }, []);

  useEffect(() => {
    // 未読数が少ない方が優先かつ、未読数が等しい場合は古い方優先
    const [index] = items ?
      items.reduce(([prev, prevMin], cur, i) => {
        const unread = Math.max(cur.latest - cur.bookmark, 0);
        if (unread && unread <= prevMin) {
          return [i, unread];
        }
        return [prev, prevMin];
      }, [-1, Number.MAX_SAFE_INTEGER])
      : [-1];

    setDefaultIndex(index);
    setSelectedIndex(index);
  }, [items]);

  const defaultRef = useRef<HTMLInputElement>(null);

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
        target: "_blank",
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
    return <div>Server({JSON.stringify(server)}) is not working...?</div>;
  }
  if (!items) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <OpenConfirmDialog item={confirm} onClose={() => setConfirm(undefined)} />
      <AppBar position="sticky">
        <Toolbar>
          <Box>
            <FormControlLabel
              label="R18"
              control={
                <Switch
                  checked={enableR18}
                  onChange={event => setEnableR18(event.target.checked)}
                  inputRef={defaultRef}
                />}
            />
          </Box>
          <Box m={2}>未読: {unreads}</Box>
          <Button
            variant="contained"
            disabled={defaultIndex === selectedIndex}
            onClick={() => setSelectedIndex(defaultIndex)}>最古の未読</Button>
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

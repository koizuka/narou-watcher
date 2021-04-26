import { useCallback, useEffect, useMemo, useState } from 'react';
import { Avatar, Badge, BadgeTypeMap, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, List, ListItem, ListItemAvatar, ListItemText, Switch } from '@material-ui/core';
import { Book } from '@material-ui/icons';
import { clearCache, IsNoticeListItem, useIsNoticeList } from './useIsNoticeList';
import { Duration } from 'luxon';
import { NarouLoginForm } from './NarouLoginForm';
import { NarouApi } from './NarouApi';

function nextLink(item: IsNoticeListItem): string {
  if (item.bookmark >= item.latest) {
    return `${item.base_url}${item.latest}/`;
  }
  return `${item.base_url}${item.bookmark + 1}/`;
}

function hasUnread(item: IsNoticeListItem): boolean {
  return item.latest > item.bookmark;
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

function NarouUpdateList({ server, ignoreDuration, onUnauthorized }: { server: NarouApi, ignoreDuration: Duration, onUnauthorized: () => void }) {
  const [enableR18, setEnableR18] = useState(false);
  const { data: items, error } = useIsNoticeList(server, { ignoreDuration, enableR18 });

  const unreads = useMemo(() => items ? items.filter(i => i.bookmark < i.latest).length : 0, [items]);

  const [confirm, setConfirm] = useState<IsNoticeListItem | undefined>(undefined);

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [defaultIndex, setDefaultIndex] = useState(-1);

  useEffect(() => {
    document.title = `なろう 未読:${unreads}`;
  }, [unreads]);

  const scrollIn = useCallback(node => {
    if (node) {
      node.scrollIntoViewIfNeeded(); // non standard method(not supported on Firefox)
      node.focus();
    }
  }, []);

  useEffect(() => {
    const index = items ?
      items.reduce((prev, cur, i) => cur.bookmark < cur.latest ? i : prev, -1)
      : -1;

    setDefaultIndex(index);
    setSelectedIndex(index);
  }, [items]);

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
        }
      };
      document.addEventListener('keydown', onKeyDown, false);
      return () => {
        document.removeEventListener('keydown', onKeyDown);
      };
    }
  }, [selectedIndex, items]);

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
    <Box m={2} display="flex" flexDirection="column" bgcolor="background.paper">
      <OpenConfirmDialog item={confirm} onClose={() => setConfirm(undefined)} />
      <Box display="flex" flexDirection="row" alignItems="center">
        <Box><FormControlLabel label="R18を含める" control={<Switch checked={enableR18} onChange={(event) => setEnableR18(event.target.checked)} />} /></Box>
        <Box m={2}>{`未読: ${unreads} 作品.`}</Box>
        <Button
          variant="contained"
          disabled={defaultIndex === selectedIndex}
          onClick={() => setSelectedIndex(defaultIndex)}>最古の未読を選択</Button>
      </Box>
      <List>
        {items?.map((item, index) =>
          <ListItem key={item.base_url} button={true}
            {...(index === selectedIndex ? { selected: true, ref: scrollIn } : {})}
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
              primary={hasUnread(item) ?
                `${item.title} (${item.bookmark}/${item.latest})`
                :
                `${item.title} (${item.latest})`}
              secondary={`${item.update_time.toFormat('yyyy/LL/dd HH:mm')} 更新  作者:${item.author_name}`} />
          </ListItem>)}
      </List>
    </Box >
  );
}

export function NarouUpdates({ api, ignoreDuration }: { api: NarouApi, ignoreDuration: Duration }) {
  const [loginMode, setLoginMode] = useState(false);

  useEffect(() => {
    clearCache();
  }, [loginMode]);

  if (loginMode) {
    return <NarouLoginForm api={api} onLogin={() => {
      console.log('logged in!');
      setLoginMode(false);
    }} />
  }

  return (
    <Box>
      <NarouUpdateList server={api} ignoreDuration={ignoreDuration}
        onUnauthorized={() => setLoginMode(true)} />
      <Button onClick={async () => {
        await api.logout();
        setLoginMode(true);
      }}>logout</Button>
    </Box>
  );
}

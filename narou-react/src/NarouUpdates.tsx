import { useEffect, useMemo, useState } from 'react';
import { Avatar, Badge, Box, Button, FormControlLabel, ListItem, ListItemAvatar, ListItemText, Switch } from '@material-ui/core';
import { Book } from '@material-ui/icons';
import { IsNoticeListItem, useIsNoticeList } from './useIsNoticeList';
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

function NarouUpdateList({ server, ignoreDuration, onUnauthorized }: { server: NarouApi, ignoreDuration: Duration, onUnauthorized: () => void }) {
  const [enableR18, setEnableR18] = useState(false);
  const { data: items, error } = useIsNoticeList(server, { ignoreDuration, enableR18 });

  const unreads = useMemo(() => items?.filter(i => i.bookmark < i.latest), [items]);
  const head = useMemo(() => (unreads && unreads.length > 0) ? unreads[unreads.length - 1] : undefined, [unreads]);
  const headLink = useMemo(() => head ? nextLink(head) : undefined, [head]);

  useEffect(() => {
    document.title = `なろう 未読:${unreads?.length}`;
  }, [unreads]);

  useEffect(() => {
    if (headLink !== undefined) {
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          window.open(headLink, '_blank');
        }
      };
      document.addEventListener('keydown', onKeyDown, false);
      return () => {
        document.removeEventListener('keydown', onKeyDown);
      };
    }
  }, [headLink]);

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

  const isDefaultOpen = function (item: IsNoticeListItem): boolean {
    if (!head) {
      return false;
    }
    return item.base_url === head.base_url;
  }

  return (
    <Box m={2} display="flex" flexDirection="column" bgcolor="background.paper">
      <p><FormControlLabel label="R18を含める" control={<Switch checked={enableR18} onChange={(event) => setEnableR18(event.target.checked)} />} /></p>
      <p>{`未読: ${unreads?.length} 作品.`}</p>
      {items?.map(item => <Box key={item.base_url} width="100%">
        <Button
          variant={isDefaultOpen(item) ? 'contained' : 'outlined'}
          href={nextLink(item)} target="_blank">
          <ListItem>
            <ListItemAvatar>
              <Badge color="primary" badgeContent={unread(item)}>
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
          </ListItem>
        </Button>
      </Box>
      )}
    </Box>
  );
}

export function NarouUpdates({ api, ignoreDuration }: { api: NarouApi, ignoreDuration: Duration }) {
  const [loginMode, setLoginMode] = useState(false);

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

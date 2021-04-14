import { useCallback, useEffect, useMemo, useState } from 'react';
import { Avatar, Badge, Box, Button, FormControlLabel, ListItem, ListItemAvatar, ListItemText, Switch, TextField } from '@material-ui/core';
import { Book } from '@material-ui/icons';
import { IsNoticeListItem, useIsNoticeList } from './useIsNoticeList';
import { Duration } from 'luxon';

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

function NarouLoginForm(props: { server: string, onLogin: () => void }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const postLogin = useCallback(async () => {
    const formData = new FormData();
    formData.append('id', userId);
    formData.append('password', password);
    console.log(formData);
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    const res = await fetch(`${props.server}/narou/login`, {
      method: 'POST',
      body: formData,
    });
    const json = await res.json();
    if (json) {
      props.onLogin();
    }
  }, [userId, password, props]);

  return <form id="loginForm">
    <h2>小説家になろうのログイン情報</h2>
    <Box><TextField id="id" name="id" label="ID or email" value={userId} onChange={e => setUserId(e.target.value)}></TextField></Box>
    <Box><TextField id="password" name="password" label="password" type="password" value={password} onChange={e => setPassword(e.target.value)}></TextField></Box>
    <Button onClick={postLogin}>login</Button>
  </form>
}

export function NarouUpdates({ server, ignoreDuration }: { server: string, ignoreDuration: Duration }) {
  const [loginMode, setLoginMode] = useState(false);

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

  const postLogout = useCallback(async () => {
    await fetch(`${server}/narou/logout`);
    setLoginMode(true);
  }, [server]);

  if (loginMode) {
    return <NarouLoginForm server={server} onLogin={() => setLoginMode(false)} />
  }

  if (error) {
    if (error.status === 401) {
      setLoginMode(true);
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
      <Button onClick={postLogout}>logout</Button>
    </Box>
  );
}

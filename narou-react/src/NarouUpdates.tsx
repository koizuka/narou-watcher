import { useEffect, useMemo, useState } from 'react';
import { Avatar, Badge, Box, Button, FormControlLabel, ListItem, ListItemAvatar, ListItemText, Switch } from '@material-ui/core';
import { Book } from '@material-ui/icons';
import { IsNoticeListItem, useIsNoticeList } from './useIsNoticeList';
import { Duration } from 'luxon';
import { useWebSocket } from './useWebSocket';

function nextLink(item: IsNoticeListItem): string {
  if (item.bookmark >= item.latest) {
    return `${item.base_url}${item.latest}/`;
  }
  return `${item.base_url}${item.bookmark + 1}/`;
}

export function NarouUpdates({ ignoreDuration }: { ignoreDuration: Duration }) {
  const searchParams = new URLSearchParams(window.location.search)
  const host = searchParams.get('server') || 'http://localhost:7676';

  const { connected } = useWebSocket(searchParams.get('ws') /* || 'ws://localhost:7676/ws' */);

  const [enableR18, setEnableR18] = useState(false);
  const { data: items, error } = useIsNoticeList(host, { ignoreDuration, enableR18 });

  const unreads = useMemo(() => items?.filter(i => i.bookmark < i.latest), [items]);
  const headLink = useMemo(() => (unreads && unreads.length > 0) ? nextLink(unreads[0]) : undefined, [unreads]);

  useEffect(() => {
    document.title = `なろう 未読:${unreads?.length}${connected ? ' ws' : ''}`;
  }, [unreads, connected]);

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
    return <div>Server({JSON.stringify(host)}) is not working...?</div>;
  }
  if (!items) {
    return <div>Loading...</div>;
  }

  return (
    <Box m={2} display="flex" flexDirection="column" bgcolor="background.paper">
      {unreads?.map((item, i) => <Button key={item.base_url} variant="contained" color={!i ? "primary" : undefined} href={nextLink(item)} target="_blank">
        {`${item.title}(${item.bookmark + 1}部分)を開く${!i ? ' [Enter]' : ''}`}
      </Button>
      )}
      <p><FormControlLabel label="R18を含める" control={<Switch checked={enableR18} onChange={(event) => setEnableR18(event.target.checked)} />} /></p>
      <p>{`未読: ${unreads?.length} 作品.`}</p>
      {items?.map(item => <Box key={item.base_url} width="100%">
        <Button variant="outlined" href={nextLink(item)} target="_blank">
          <ListItem>
            <ListItemAvatar>
              <Badge color="primary" badgeContent={Math.max(item.latest - item.bookmark, 0)}>
                <Avatar>
                  <Book color={item.isR18 ? "secondary" : undefined} />
                </Avatar>
              </Badge>
            </ListItemAvatar>
            <ListItemText
              primary={item.bookmark < item.latest ?
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

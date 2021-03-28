//import './App.css';
import useSWR, { SWRConfig } from 'swr';
import { useEffect, useMemo } from 'react';
import { Avatar, Badge, Box, Button, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core';
import { DateTime } from 'luxon';
import { Book } from '@material-ui/icons';

type IsNoticeListRecord = {
  base_url: string;
  update_time: string;
  bookmark: number;
  latest: number;
  title: string;
};

type IsNoticeListItem = {
  base_url: string;
  update_time: DateTime;
  bookmark: number;
  latest: number;
  title: string;
};

function nextLink(item: IsNoticeListItem): string {
  if (item.bookmark >= item.latest) {
    return `${item.base_url}${item.latest}/`;
  }
  return `${item.base_url}${item.bookmark + 1}/`;
}

function openNextLink(item: IsNoticeListItem) {
  window.open(nextLink(item), '_blank');
}

function NarouUpdates() {
  const { data: raw_items, error } = useSWR<IsNoticeListRecord[]>('http://localhost:7676/narou/isnoticelist')
  const items: IsNoticeListItem[] | undefined = useMemo(
    () => {
      const n = raw_items?.map(i => ({ ...i, update_time: DateTime.fromISO(i.update_time) }))
      return n;
    },
    [raw_items]
  );

  const unreads = useMemo(
    () => items?.filter(i => i.bookmark < i.latest),
    [items]
  );

  useEffect(() => {
    document.title = `なろう 未読:${unreads?.length}`
  }, [unreads])

  if (error) {
    return <div>Error! {error}</div>
  }

  return (
    <Box m={2} display="flex" flexDirection="column" bgcolor="background.paper">
      {unreads?.length ?
        <Button variant="contained" color="primary" onClick={() => openNextLink(unreads[0])}>
          {`${unreads[0].title}(${unreads[0].bookmark + 1}部分)を開く`}
        </Button>
        :
        <></>
      }
      <p>{`未読: ${unreads?.length} items.`}</p>
      {items?.map(item =>
        <Box key={item.base_url} width="100%">
          <Button variant="outlined" href={nextLink(item)} target="_blank">
            <ListItem>
              <ListItemAvatar>
                <Badge color="primary" badgeContent={Math.max(item.latest - item.bookmark, 0)}>
                  <Avatar>
                    <Book />
                  </Avatar>
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={
                  item.bookmark < item.latest ?
                    `${item.title} (${item.bookmark}/${item.latest})`
                    :
                    `${item.title} (${item.latest})`
                }
                secondary={`${item.update_time.toFormat('yyyy/LL/dd HH:mm')} 更新`} />
            </ListItem>
          </Button>
        </Box>
      )}
    </Box>
  )
}

function App() {
  return (
    <div className="App">
      <SWRConfig value={{
        fetcher: (args) => fetch(args).then(res => res.json())
      }}>
        <NarouUpdates />
      </SWRConfig>
    </div>
  );
}

export default App;

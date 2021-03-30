//import './App.css';
import useSWR, { SWRConfig } from 'swr';
import { useEffect, useMemo, useState } from 'react';
import { Avatar, Badge, Box, Button, FormControlLabel, ListItem, ListItemAvatar, ListItemText, Switch } from '@material-ui/core';
import { DateTime, Duration } from 'luxon';
import { Book } from '@material-ui/icons';

const IgnoreDuration = Duration.fromObject({ days: 30 });
const PollingInterval = 5 * 60 * 1000; // 5分ごとにポーリング

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
  isR18: boolean;
};

function nextLink(item: IsNoticeListItem): string {
  if (item.bookmark >= item.latest) {
    return `${item.base_url}${item.latest}/`;
  }
  return `${item.base_url}${item.bookmark + 1}/`;
}

function useIsNoticeList(enableR18: boolean) {
  const host = 'http://localhost:7676';

  const { data: raw_items, error } = useSWR<IsNoticeListRecord[]>(`${host}/narou/isnoticelist`);
  const { data: raw_items18, error: error18 } = useSWR<IsNoticeListRecord[]>((!error && enableR18) ? `${host}/r18/isnoticelist` : null);

  const items: IsNoticeListItem[] | undefined = useMemo(
    () => {
      if (raw_items === undefined) {
        return undefined;
      }

      const tooOld = DateTime.now().minus(IgnoreDuration);

      // なろう、R18のアイテムを混ぜて、古いアイテムを捨てて、更新日時降順にする
      const n = [
        ...raw_items.map(i => ({ ...i, isR18: false })),
        ...(raw_items18 || []).map(i => ({ ...i, isR18: true }))
      ].map(i => ({ ...i, update_time: DateTime.fromISO(i.update_time) }))
        .filter(i => i.update_time > tooOld)
        .sort((a, b) =>
          (a.update_time > b.update_time) ? -1 :
            (a.update_time < b.update_time) ? 1 : 0
        )
      return n;
    },
    [raw_items, raw_items18]
  );

  return { data: error ? undefined : items, error: error || error18 };
}

function NarouUpdates() {
  const [enableR18, setEnableR18] = useState(false);
  const { data: items, error } = useIsNoticeList(enableR18);

  const unreads = useMemo(() => items?.filter(i => i.bookmark < i.latest), [items]);

  useEffect(() => {
    document.title = `なろう 未読:${unreads?.length}`
  }, [unreads])

  if (error) {
    return <div>Error! {error}</div>
  }
  if (!items) {
    return <div>Loading...</div>
  }

  return (
    <Box m={2} display="flex" flexDirection="column" bgcolor="background.paper">
      {unreads?.map((item, i) =>
        <Button key={item.base_url} variant="contained" color={!i ? "primary" : undefined} href={nextLink(item)} target="_blank">
          {`${item.title}(${item.bookmark + 1}部分)を開く`}
        </Button>
      )}
      <p><FormControlLabel label="R18を含める" control={
        <Switch checked={enableR18} onChange={(event) => setEnableR18(event.target.checked)} />
      } /></p>
      <p>{`未読: ${unreads?.length} 作品.`}</p>
      {items?.map(item =>
        <Box key={item.base_url} width="100%">
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
        refreshInterval: PollingInterval,
        fetcher: (args) => fetch(args).then(res => res.json())
      }}>
        <NarouUpdates />
      </SWRConfig>
    </div>
  );
}

export default App;

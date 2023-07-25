import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link, Typography
} from '@mui/material';
import React, { useMemo } from 'react';
import { IsNoticeListItem, nextLink } from '../narouApi/IsNoticeListItem';
import { NarouApi } from '../narouApi/NarouApi';
import { useBookmarkInfo } from '../narouApi/useBookmarkInfo';
import { useNovelInfo } from '../narouApi/useNovelInfo';

export const OpenConfirmDialog = React.memo(OpenConfirmDialogRaw);
function OpenConfirmDialogRaw({ api, item, onClose }: {
  api: NarouApi;
  item?: IsNoticeListItem;
  onClose: () => void;
}) {
  const { data: novelInfo } = useNovelInfo(api, item?.base_url);
  const { data: bookmarkInfo } = useBookmarkInfo(novelInfo?.bookmark_no ? api : null, item?.isR18 ?? false);

  const bookmark = useMemo(() => {
    console.log('novelInfo:', novelInfo);
    console.log('bookmarkInfo:', bookmarkInfo);
    const bookmark_no = novelInfo?.bookmark_no
    if (bookmarkInfo && bookmark_no && novelInfo.bookmark_url) {
      return {
        no: bookmark_no,
        name: bookmarkInfo[bookmark_no].name,
        url: novelInfo.bookmark_url,
      };
    }
    return undefined;
  }, [novelInfo, bookmarkInfo])

  const abstract = useMemo(() => novelInfo?.abstract.replaceAll('\n', '').replaceAll('<br/>', '\n').split('\n'), [novelInfo]);

  return (
    <Dialog open={!!item} onClose={onClose} fullWidth aria-labelledby="title" aria-describedby='abstract'>
      <DialogTitle id="title">{item?.title}</DialogTitle>
      <DialogContent>作者:<Link href={novelInfo?.author_url} target="_blank">{item?.author_name}</Link></DialogContent>
      {bookmark && <DialogContent>ブックマーク:<Link href={bookmark.url} target="_blank">{bookmark.name}</Link></DialogContent>}
      <DialogContent>
        <Typography variant="h5">あらすじ</Typography>
        <div id="abstract">
          {abstract?.map((line, i) => <DialogContentText key={i}>{line}</DialogContentText>)}
        </div>
      </DialogContent>
      <DialogActions>
        <Button size="small" variant="contained" onClick={() => {
          if (item)
            window.open(item.base_url, '_blank');
          onClose();
        }}>小説ページ</Button>
        <Button size="small" variant="contained" onClick={() => {
          if (item)
            window.open(nextLink(item), '_blank');
          onClose();
        }}>最新{item?.latest}部分</Button>
        <Button size="small" variant="contained" onClick={() => { onClose(); }}>キャンセル</Button>
      </DialogActions>
    </Dialog>
  );
}

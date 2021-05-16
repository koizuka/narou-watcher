import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link
} from '@material-ui/core';
import { IsNoticeListItem, nextLink } from './narouApi/IsNoticeListItem';
import { NarouApi } from './narouApi/NarouApi';
import { useNovelInfo } from './narouApi/useNovelInfo';

export function OpenConfirmDialog({ api, item, onClose }: {
  api: NarouApi;
  item?: IsNoticeListItem;
  onClose: () => void;
}) {
  const { data } = useNovelInfo(api, item?.base_url);
  return (
    <Dialog open={!!item} onClose={onClose}>
      <DialogTitle>{item?.title}</DialogTitle>
      <DialogContent>作者:<Link href={data?.author_url} target="_blank">{item?.author_name}</Link></DialogContent>
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
        <Button size="small" variant="contained" onClick={() => onClose()}>キャンセル</Button>
      </DialogActions>
    </Dialog>
  );
}

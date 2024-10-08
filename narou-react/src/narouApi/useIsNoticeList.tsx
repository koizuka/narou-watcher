import { DateTime } from 'luxon';
import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';
import { IsNoticeListItem } from './IsNoticeListItem';
import { NarouApi } from './NarouApi';
import { ApiError } from './ApiError';

interface IsNoticeListRecord {
  base_url: string;
  update_time: string;
  bookmark: number;
  latest: number;
  title: string;
  author_name: string;
  completed?: boolean;
  is_notice?: boolean; // only in bookmark
}

// login / logout したらキャッシュをすぐに消す
export function clearCache() {
  void mutate('/narou/isnoticelist');
  void mutate('/r18/isnoticelist');
}

export function useIsNoticeList(
  api: NarouApi,
  { isR18, maxPage = 1, bookmark = 0 }:
    {
      isR18: boolean,
      maxPage: number,
      bookmark: number,
    }
) {
  const { data: raw_items, error } = useSWR<IsNoticeListRecord[], ApiError>(
    isR18 ?
      NarouApi.isnoticelistR18({ maxPage }) :
      NarouApi.isnoticelist({ maxPage }),
    async (path: string) => api.call<IsNoticeListRecord[]>(path),
    {
      onErrorRetry: (error) => {
        console.log(`onErrorRetry: ${error.status}: ${error.toString()}`);
      },
    });

  // order: updated_at:ブクマ更新順, new:ブクマ追加順
  const order: 'updated_at' | 'new' = 'updated_at';
  const { data: bookmark_items, error: bookmark_error } = useSWR<IsNoticeListRecord[], ApiError>((!error && bookmark) ?
    (isR18 ?
      NarouApi.bookmarkR18(bookmark, { order }) :
      NarouApi.bookmark(bookmark, { order })
    )
    : null,
    async (path: string) => api.call<IsNoticeListRecord[]>(path),
  );

  const raw_items2 = useMemo(() => {
    if (raw_items) {
      if (bookmark_items) {
        return bookmark_items;
      }
    }
    return raw_items;
  }, [raw_items, bookmark_items]);

  const items: IsNoticeListItem[] | undefined = useMemo(
    () => {
      if (raw_items2 === undefined) {
        return undefined;
      }

      const n = [
        ...raw_items2.map(i => ({ ...i, isR18: isR18 })),
      ].map(i => ({ ...i, update_time: DateTime.fromISO(i.update_time) }));
      return n;
    },
    [raw_items2, isR18]
  );

  return { data: error ? undefined : items, error: error ?? bookmark_error };
}

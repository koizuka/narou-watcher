import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';
import { DateTime } from 'luxon';
import { NarouApi } from './NarouApi';
import { IsNoticeListItem } from './IsNoticeListItem';

type IsNoticeListRecord = {
  base_url: string;
  update_time: string;
  bookmark: number;
  latest: number;
  title: string;
  author_name: string;
  completed?: boolean;
  is_notice?: boolean; // only in bookmark
};

// login / logout したらキャッシュをすぐに消す
export function clearCache() {
  mutate('/narou/isnoticelist');
  mutate('/r18/isnoticelist');
}

export function useIsNoticeList(
  api: NarouApi,
  { enableR18, maxPage = 1, bookmark = 0 }:
    {
      enableR18: boolean,
      maxPage: number,
      bookmark: number,
    }
) {
  const { data: raw_items, error } = useSWR<IsNoticeListRecord[]>(NarouApi.isnoticelist({ maxPage }),
    async path => api.call(path),
    {
      onErrorRetry: (error) => {
        console.log('onErrorRetry:', error, error.status);
      },
    });

  // order: updated_at:ブクマ更新順, new:ブクマ追加順
  const order: 'updated_at' | 'new' = 'new';
  const { data: bookmark_items, error: bookmark_error } = useSWR<IsNoticeListRecord[]>((!error && bookmark) ? NarouApi.bookmark(bookmark, { order }) : null,
    async path => api.call(path),
  );

  const { data: raw_items18, error: error18 } = useSWR<IsNoticeListRecord[]>((!error && enableR18) ? NarouApi.isnoticelistR18({ maxPage }) : null,
    async path => api.call(path),
  );

  // merge bookmark
  const raw_items2 = useMemo(() => {
    if (raw_items) {
      if (bookmark_items) {
        const keys = new Set(raw_items.map(i => i.base_url));
        const adds = bookmark_items.filter(i => i.is_notice && !keys.has(i.base_url));
        if (adds.length > 0) {
          return [...raw_items, ...adds];
        }
      }
    }
    return raw_items;
  }, [raw_items, bookmark_items]);

  const items: IsNoticeListItem[] | undefined = useMemo(
    () => {
      if (raw_items2 === undefined) {
        return undefined;
      }

      // なろう、R18のアイテムを混ぜる
      const n = [
        ...raw_items2.map(i => ({ ...i, isR18: false })),
        ...(raw_items18 || []).map(i => ({ ...i, isR18: true }))
      ].map(i => ({ ...i, update_time: DateTime.fromISO(i.update_time) }));
      return n;
    },
    [raw_items2, raw_items18]
  );

  return { data: error ? undefined : items, error: error || error18 || bookmark_error };
}

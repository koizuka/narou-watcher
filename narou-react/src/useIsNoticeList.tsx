import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';
import { DateTime } from 'luxon';
import { NarouApi } from './NarouApi';

type IsNoticeListRecord = {
  base_url: string;
  update_time: string;
  bookmark: number;
  latest: number;
  title: string;
  author_name: string;
  completed?: boolean;
};

export type IsNoticeListItem = {
  base_url: string;
  update_time: DateTime;
  bookmark: number;
  latest: number;
  title: string;
  author_name: string;
  completed?: boolean;
  isR18: boolean;
};

// login / logout したらキャッシュをすぐに消す
export function clearCache() {
  mutate('/narou/isnoticelist');
  mutate('/r18/isnoticelist');
}

export function useIsNoticeList(
  api: NarouApi,
  { enableR18 }: { enableR18: boolean }
) {
  const { data: raw_items, error } = useSWR<IsNoticeListRecord[]>('/narou/isnoticelist',
    async path => api.call(path),
    {
      onErrorRetry: (error) => {
        console.log('onErrorRetry:', error, error.status);
      },
    });
  const { data: raw_items18, error: error18 } = useSWR<IsNoticeListRecord[]>((!error && enableR18) ? '/r18/isnoticelist' : null,
    async path => api.call(path),
  );

  const items: IsNoticeListItem[] | undefined = useMemo(
    () => {
      if (raw_items === undefined) {
        return undefined;
      }

      const score = (i: IsNoticeListItem) => {
        if (i.bookmark === i.latest) return Number.MAX_SAFE_INTEGER;
        if (i.bookmark > i.latest) return Number.MAX_SAFE_INTEGER - 1;
        return i.latest - i.bookmark;
      }

      // なろう、R18のアイテムを混ぜて、未読があって少ない順にし、それが等しいときは更新日時降順にする
      const n = [
        ...raw_items.map(i => ({ ...i, isR18: false })),
        ...(raw_items18 || []).map(i => ({ ...i, isR18: true }))
      ].map(i => ({ ...i, update_time: DateTime.fromISO(i.update_time) }))
        .sort((a, b) => {
          const as = score(a);
          const bs = score(b);
          if (as > bs) return 1;
          if (as < bs) return -1;
          if (a.update_time < b.update_time) return 1;
          if (a.update_time > b.update_time) return -1;
          return 0;
        })
        .slice(0, 30);
      return n;
    },
    [raw_items, raw_items18]
  );

  return { data: error ? undefined : items, error: error || error18 };
}

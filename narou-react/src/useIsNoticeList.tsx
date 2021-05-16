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

// sort用の比較関数
function ascend<T>(a: T, b: T, f: (v: T) => any): -1 | 0 | 1 {
  const fa = f(a), fb = f(b);
  if (fa < fb) return -1;
  if (fa > fb) return 1;
  return 0;
}

type Reverse<T> = {
  f: (v: T) => any
}
function reverse<T>(f: (v: T) => any): Reverse<T> {
  return { f };
}

function compare<T>(a: T, b: T, ...cmps: (((v: T) => any) | Reverse<T>)[]): -1 | 0 | 1 {
  for (const f of cmps) {
    let c;
    if (typeof f === 'object') {
      c = ascend(b, a, (f as Reverse<T>).f);
    } else {
      c = ascend(a, b, f);
    }
    if (c) return c;
  }
  return 0;
}

export function useIsNoticeList(
  api: NarouApi,
  { enableR18, maxPage = 1, bookmark1 = false }:
    {
      enableR18: boolean,
      maxPage: number,
      bookmark1: boolean,
    }
) {
  const query = `?max_page=${maxPage}`
  const { data: raw_items, error } = useSWR<IsNoticeListRecord[]>('/narou/isnoticelist' + query,
    async path => api.call(path),
    {
      onErrorRetry: (error) => {
        console.log('onErrorRetry:', error, error.status);
      },
    });

  // order: updated_at:ブクマ更新順, new:ブクマ追加順
  const bookmark = 1;
  const order: 'updated_at' | 'new' = 'new';
  const { data: bookmark_items, error: bookmark_error } = useSWR<IsNoticeListRecord[]>((!error && bookmark1) ? `/narou/bookmarks/${bookmark}?order=${order}` : null,
    async path => api.call(path),
  );

  const { data: raw_items18, error: error18 } = useSWR<IsNoticeListRecord[]>((!error && enableR18) ? '/r18/isnoticelist' + query : null,
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

      const score = (i: IsNoticeListItem) => {
        if (i.bookmark === i.latest) return Number.MAX_SAFE_INTEGER;
        if (i.bookmark > i.latest) return Number.MAX_SAFE_INTEGER - 1;
        return i.latest - i.bookmark;
      }

      // なろう、R18のアイテムを混ぜて、未読があって少ない順にし、
      // 未読がある場合、同じ未読数同士は更新日時昇順、未読がない場合は更新日時降順
      const n = [
        ...raw_items2.map(i => ({ ...i, isR18: false })),
        ...(raw_items18 || []).map(i => ({ ...i, isR18: true }))
      ].map(i => ({ ...i, update_time: DateTime.fromISO(i.update_time) }))
        .sort((a, b) => {
          return compare(a, b,
            i => score(i),
            a.bookmark < a.latest ?
              i => i.update_time :
              reverse(i => i.update_time),
            i => i.base_url);
        })
        .slice(0, 30);
      return n;
    },
    [raw_items2, raw_items18]
  );

  return { data: error ? undefined : items, error: error || error18 || bookmark_error };
}

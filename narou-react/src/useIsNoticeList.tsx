import useSWR from 'swr';
import { useMemo } from 'react';
import { DateTime, Duration } from 'luxon';

type IsNoticeListRecord = {
  base_url: string;
  update_time: string;
  bookmark: number;
  latest: number;
  title: string;
  author_name: string;
};

export type IsNoticeListItem = {
  base_url: string;
  update_time: DateTime;
  bookmark: number;
  latest: number;
  title: string;
  author_name: string;
  isR18: boolean;
};

export function useIsNoticeList(
  host: string,
  { ignoreDuration, enableR18 }: { ignoreDuration: Duration, enableR18: boolean }
) {
  const { data: raw_items, error } = useSWR<IsNoticeListRecord[]>(`${host}/narou/isnoticelist`);
  const { data: raw_items18, error: error18 } = useSWR<IsNoticeListRecord[]>((!error && enableR18) ? `${host}/r18/isnoticelist` : null);

  const items: IsNoticeListItem[] | undefined = useMemo(
    () => {
      if (raw_items === undefined) {
        return undefined;
      }

      const tooOld = DateTime.now().minus(ignoreDuration);

      // なろう、R18のアイテムを混ぜて、古いアイテムを捨てて、更新日時降順にする
      const n = [
        ...raw_items.map(i => ({ ...i, isR18: false })),
        ...(raw_items18 || []).map(i => ({ ...i, isR18: true }))
      ].map(i => ({ ...i, update_time: DateTime.fromISO(i.update_time) }))
        .filter(i => i.update_time > tooOld)
        .sort((a, b) => (a.update_time > b.update_time) ? -1 :
          (a.update_time < b.update_time) ? 1 : 0
        );
      return n;
    },
    [raw_items, raw_items18]
  );

  return { data: error ? undefined : items, error: error || error18 };
}

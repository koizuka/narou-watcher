import { NarouApi } from './NarouApi';
import useSWR from 'swr';
import { useMemo } from 'react';

type NovelInfo = {
  title: string;
  abstract: string;
  author_name: string;
  author_url: string;
  keywords: string[];
  bookmark_no?: number;
  bookmark_episode?: number;
};

function extractInfoPath(base_url?: string): { host: string, ncode: string } | null {
  if (!base_url) {
    return null;
  }

  const m = base_url.match(/https:\/\/([a-zA-Z.]+)\/([0-9a-z]+)\/?/);
  if (!m) {
    // base_url is invalid
    return null;
  }
  const [, host, ncode] = m;
  return { host, ncode };
}

export function useNovelInfo(
  api: NarouApi,
  base_url?: string) {

  const info = useMemo(() => extractInfoPath(base_url), [base_url]);
  const key = useMemo(() => {
    switch (info?.host) {
      case 'ncode.syosetu.com':
        return NarouApi.novelInfo(info.ncode);
      case 'novel18.syosetu.com':
        return NarouApi.novelInfoR18(info.ncode);
      default:
        // unknown host
        return null;
    }
  }, [info])

  const { data, error } = useSWR<NovelInfo>(key, async path => api.call(path));

  return { data, error };
}

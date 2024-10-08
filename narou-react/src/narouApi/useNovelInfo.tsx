import { NarouApi } from './NarouApi';
import useSWR from 'swr';
import { useMemo } from 'react';
import { ApiError } from './ApiError';

interface NovelInfo {
  base_url: string;
  title: string;
  abstract: string;
  author_name: string;
  author_url: string;
  keywords: string[];
  bookmark_url?: string;
  bookmark_no?: number;
  bookmark_episode?: number;
}

function extractInfoPath(base_url?: string): { host: string, ncode: string } | null {
  if (!base_url) {
    return null;
  }

  const m = /https:\/\/([0-9a-zA-Z.]+)\/([0-9a-z]+)\/?/.exec(base_url);
  if (!m) {
    console.warn(`base_url is invalid: ${base_url}`);
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
    if (!info) {
      return null;
    }
    switch (info.host) {
      case 'ncode.syosetu.com':
        return NarouApi.novelInfo(info.ncode);
      case 'novel18.syosetu.com':
        return NarouApi.novelInfoR18(info.ncode);
      default:
        console.warn(`unknown host: ${info.host}`);
        return null;
    }
  }, [info])

  const { data, error } = useSWR<NovelInfo, ApiError>(key, async (path: string) => api.call<NovelInfo>(path));

  return { data, error };
}

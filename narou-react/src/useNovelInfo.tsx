import { NarouApi } from './NarouApi';
import useSWR from 'swr';

type NovelInfo = {
  title: string;
  abstract: string;
  author_name: string;
  author_url: string;
  keywords: string[];
  bookmark_no?: number;
  bookmark_episode?: number;
};

function novelInfoPath(base_url?: string): string | null {
  if (!base_url) {
    return null;
  }

  const m = base_url.match(/https:\/\/([a-zA-Z.]+)\/([0-9a-z]+)\/?/);
  if (!m) {
    // base_url is invalid
    return null;
  }
  const [, host, ncode] = m;
  switch (host) {
    case 'ncode.syosetu.com':
      return NarouApi.novelInfo(ncode);
    case 'novel18.syosetu.com':
      return NarouApi.novelInfoR18(ncode);
    default:
      // unknown host
      return null;
  }
}

export function useNovelInfo(
  api: NarouApi,
  base_url?: string) {
  const { data, error } = useSWR<NovelInfo>(
    novelInfoPath(base_url),
    async (path) => api.call(path)
  );

  return { data, error };
}

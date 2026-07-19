import { NarouApi } from './NarouApi';
import useSWR from 'swr';
import { ApiError } from './ApiError';

interface UserTopNotification {
  has_notification: boolean;
  count: number;
}

/**
 * ユーザートップの「新着通知」の有無を取得する。
 * 通知ソースは通常ホームのみ(R18トグルに関係なく同一)。
 *
 * サーバ側でユーザートップページ取得+JSONP の2往復が走る重い API のため、
 * enabled が true になるまで取得を開始しない(一覧表示を優先する)。
 */
export function useNotification(api: NarouApi, enabled: boolean) {
  const { data, error } = useSWR<UserTopNotification, ApiError>(
    enabled ? NarouApi.notification() : null,
    async (path: string) => api.call<UserTopNotification>(path));

  return { hasNotification: data?.has_notification ?? false, error };
}

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
 */
export function useNotification(api: NarouApi) {
  const { data, error } = useSWR<UserTopNotification, ApiError>(
    NarouApi.notification(),
    async (path: string) => api.call<UserTopNotification>(path));

  return { hasNotification: data?.has_notification ?? false, error };
}

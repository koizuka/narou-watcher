import { useEffect } from 'react';
import { mutate } from 'swr';

/**
 * Firefoxのセッション復元を検出してSWRを再検証する
 *
 * pageshowイベントで再検証をトリガーする。
 * pageshow は通常のページロードでも毎回発火するため、
 * persisted (BFCache/セッション復元からの復帰) のときだけ再検証する。
 * そうしないと初回ロードで全 API が2重リクエストされてしまう。
 */
export function useSessionRestoreRevalidation() {
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) {
        return;
      }
      void mutate(() => true, undefined, { revalidate: true });
    };

    window.addEventListener('pageshow', handlePageShow);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);
}

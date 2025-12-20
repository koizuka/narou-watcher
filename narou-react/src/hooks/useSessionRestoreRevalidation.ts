import { useEffect } from 'react';
import { mutate } from 'swr';

/**
 * Firefoxのセッション復元を検出してSWRを再検証する
 *
 * pageshowイベントで再検証をトリガーする。
 */
export function useSessionRestoreRevalidation() {
  useEffect(() => {
    const handlePageShow = () => {
      void mutate(() => true, undefined, { revalidate: true });
    };

    window.addEventListener('pageshow', handlePageShow);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);
}

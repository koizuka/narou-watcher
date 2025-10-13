import { useEffect, useRef } from 'react';
import { IsNoticeListItem } from '../narouApi/IsNoticeListItem';
import { NarouApi } from '../narouApi/NarouApi';
import { extractNcodeAndEpisode } from '../utils/novelUtils';

interface NovelAccessResponse {
  accessible: boolean;
  statusCode: number;
}

/**
 * Proactively checks if a novel is accessible in the background.
 * This hook performs a single access check when the target item changes.
 * No polling - just one check per item.
 */
export function useProactiveNovelCheck(
  api: NarouApi,
  item: IsNoticeListItem | undefined,
  onAccessible: (item: IsNoticeListItem) => void
) {
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!item) {
      return;
    }

    // Cancel any ongoing check
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this check
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // Perform the access check
    const checkAccess = async () => {
      const { ncode, episode } = extractNcodeAndEpisode(item);
      if (!ncode) {
        return;
      }

      try {
        const response = await api.call<NovelAccessResponse>(
          NarouApi.checkNovelAccess(ncode, episode, item.isR18)
        );

        // Check if this request was aborted
        if (abortController.signal.aborted) {
          return;
        }

        if (response.accessible) {
          onAccessible(item);
        }
      } catch (error) {
        // Silently ignore errors - this is a background check
        if (!abortController.signal.aborted) {
          console.debug('Proactive novel check failed:', error);
        }
      }
    };

    void checkAccess();

    // Cleanup: abort ongoing request when item changes or component unmounts
    return () => {
      abortController.abort();
    };
  }, [api, item, onAccessible]);
}

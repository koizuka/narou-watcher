import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography
} from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { IsNoticeListItem, nextLink } from '../narouApi/IsNoticeListItem';
import { NarouApi } from '../narouApi/NarouApi';

const POLLING_INTERVAL = 30 * 1000; // 30 seconds
const MAX_RETRY_COUNT = 10; // Maximum 10 retries

interface NovelAccessResponse {
  accessible: boolean;
}

export const WaitingForNovelDialog = React.memo(WaitingForNovelDialogRaw);
function WaitingForNovelDialogRaw({ api, item, onClose }: {
  api: NarouApi;
  item?: IsNoticeListItem;
  onClose: () => void;
}) {
  const [retryCount, setRetryCount] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const extractNcodeAndEpisode = useCallback((item: IsNoticeListItem) => {
    // Extract ncode from base_url (e.g., "https://ncode.syosetu.com/n1234aa/" -> "n1234aa")
    const regex = /\/([^/]+)\/$/;
    const match = regex.exec(item.base_url);
    const ncode = match ? match[1] : '';
    const episode = item.bookmark + 1; // Next episode to read
    return { ncode, episode };
  }, []);

  const checkNovelAccess = useCallback(async (item: IsNoticeListItem): Promise<boolean> => {
    const { ncode, episode } = extractNcodeAndEpisode(item);
    if (!ncode) return false;

    try {
      setIsChecking(true);
      const response = await api.call<NovelAccessResponse>(
        NarouApi.checkNovelAccess(ncode, episode, item.isR18)
      );
      return response.accessible;
    } catch (error) {
      console.error('Failed to check novel access:', error);
      return false;
    } finally {
      setIsChecking(false);
    }
  }, [api, extractNcodeAndEpisode]);

  const openNovel = useCallback((item: IsNoticeListItem) => {
    window.open(nextLink(item), '_blank');
    onClose();
  }, [onClose]);

  const startPolling = useCallback((item: IsNoticeListItem) => {
    const poll = async () => {
      const accessible = await checkNovelAccess(item);
      
      if (accessible) {
        // Novel is now accessible, open it
        openNovel(item);
        return;
      }

      setRetryCount(prev => {
        const newCount = prev + 1;
        if (newCount >= MAX_RETRY_COUNT) {
          // Max retries reached, stop polling
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return newCount;
        }
        return newCount;
      });
    };

    intervalRef.current = setInterval(() => {
      void poll();
    }, POLLING_INTERVAL);
    // Also check immediately
    void poll();
  }, [checkNovelAccess, openNovel]);

  useEffect(() => {
    if (item) {
      setRetryCount(0);
      setIsChecking(false);
      startPolling(item);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [item, startPolling]);

  const handleCancel = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    onClose();
  }, [onClose]);

  const handleOpenAnyway = useCallback(() => {
    if (item) {
      openNovel(item);
    }
  }, [item, openNovel]);

  const handleManualRetry = useCallback(() => {
    if (!item) return;
    
    void (async () => {
      const accessible = await checkNovelAccess(item);
      if (accessible) {
        openNovel(item);
      }
    })();
  }, [item, checkNovelAccess, openNovel]);

  const isMaxRetriesReached = retryCount >= MAX_RETRY_COUNT;
  const remainingRetries = Math.max(0, MAX_RETRY_COUNT - retryCount);

  return (
    <Dialog open={!!item} onClose={handleCancel} disableEscapeKeyDown>
      <DialogTitle>小説の公開を待っています...</DialogTitle>
      <DialogContent>
        <DialogContentText>
          「{item?.title}」の次の話がまだ公開されていません。
        </DialogContentText>
        <DialogContentText>
          30秒ごとに確認し、公開され次第自動的に開きます。
        </DialogContentText>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          {isChecking && <CircularProgress size={16} />}
          {isChecking
            ? '確認中...'
            : isMaxRetriesReached
              ? '最大試行回数に達しました'
              : `残り確認回数: ${remainingRetries}`
          }
        </Typography>
        {retryCount > 0 && (
          <Typography variant="body2" color="textSecondary">
            確認回数: {retryCount}/{MAX_RETRY_COUNT}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={handleManualRetry} 
          variant="outlined" 
          size="small"
          disabled={isChecking}
        >
          今すぐ確認
        </Button>
        <Button onClick={handleOpenAnyway} variant="outlined" size="small">
          そのまま開く
        </Button>
        <Button onClick={handleCancel} variant="contained" size="small">
          キャンセル
        </Button>
      </DialogActions>
    </Dialog>
  );
}
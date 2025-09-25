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
  statusCode: number;
}

export const WaitingForNovelDialog = React.memo(WaitingForNovelDialogRaw);
function WaitingForNovelDialogRaw({ api, item, onClose }: {
  api: NarouApi;
  item?: IsNoticeListItem;
  onClose: () => void;
}) {
  const [retryCount, setRetryCount] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [countdown, setCountdown] = useState(POLLING_INTERVAL / 1000);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  const resetCountdown = useCallback(() => {
    setCountdown(POLLING_INTERVAL / 1000);
  }, []);

  const startCountdownTimer = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          return POLLING_INTERVAL / 1000;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const stopCountdownTimer = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  const startPolling = useCallback((item: IsNoticeListItem) => {
    const poll = async () => {
      const accessible = await checkNovelAccess(item);

      if (accessible) {
        // Novel is now accessible, stop polling and open it
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        stopCountdownTimer();
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
          stopCountdownTimer();
          return newCount;
        }
        return newCount;
      });

      // Reset countdown after each check
      resetCountdown();
    };

    intervalRef.current = setInterval(() => {
      void poll();
    }, POLLING_INTERVAL);

    // Start countdown timer
    startCountdownTimer();

    // Also check immediately
    void poll();
  }, [checkNovelAccess, openNovel, resetCountdown, startCountdownTimer, stopCountdownTimer]);

  useEffect(() => {
    if (item) {
      setRetryCount(0);
      setIsChecking(false);
      resetCountdown();
      startPolling(item);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      stopCountdownTimer();
    };
  }, [item, startPolling, resetCountdown, stopCountdownTimer]);

  const handleCancel = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    stopCountdownTimer();
    onClose();
  }, [onClose, stopCountdownTimer]);

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
      } else {
        // Reset countdown on manual retry
        resetCountdown();
      }
    })();
  }, [item, checkNovelAccess, openNovel, resetCountdown]);

  const isMaxRetriesReached = retryCount >= MAX_RETRY_COUNT;

  return (
    <Dialog open={!!item} onClose={handleCancel} disableEscapeKeyDown>
      <DialogTitle>小説の公開を待っています...</DialogTitle>
      <DialogContent>
        <DialogContentText>
          「{item?.title}」の次の話がまだ公開されていません。
        </DialogContentText>
        <DialogContentText>
          自動的に公開をチェックし、公開され次第開きます。
        </DialogContentText>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          {isChecking && <CircularProgress size={16} />}
          {!isChecking && !isMaxRetriesReached && (
            <CircularProgress
              size={16}
              variant="determinate"
              value={(1 - countdown / (POLLING_INTERVAL / 1000)) * 100}
            />
          )}
          {isChecking
            ? '確認中...'
            : isMaxRetriesReached
              ? '最大試行回数に達しました'
              : `次回確認まで: ${countdown}秒`
          }
        </Typography>
        {retryCount > 0 && (
          <Typography variant="body2" color="text.secondary">
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
          data-testid="manual-retry-button"
        >
          今すぐ確認
        </Button>
        <Button 
          onClick={handleOpenAnyway} 
          variant="outlined" 
          size="small"
          data-testid="open-anyway-button"
        >
          そのまま開く
        </Button>
        <Button 
          onClick={handleCancel} 
          variant="contained" 
          size="small"
          data-testid="cancel-button"
        >
          キャンセル
        </Button>
      </DialogActions>
    </Dialog>
  );
}
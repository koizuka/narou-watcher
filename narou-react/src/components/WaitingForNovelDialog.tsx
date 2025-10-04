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
import { isIPhoneSafari } from '../utils/browser';
import { CountdownTimer } from './CountdownTimer';

const POLLING_INTERVAL = 30 * 1000; // 30 seconds
const MAX_RETRY_COUNT = 10; // Maximum 10 retries

interface NovelAccessResponse {
  accessible: boolean;
  statusCode: number;
}

export const WaitingForNovelDialog = React.memo(WaitingForNovelDialogRaw);
function WaitingForNovelDialogRaw({ api, item, onClose, onAccessible }: {
  api: NarouApi;
  item?: IsNoticeListItem;
  onClose: () => void;
  onAccessible?: (item: IsNoticeListItem) => void;
}) {
  const [retryCount, setRetryCount] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [nextCheckTime, setNextCheckTime] = useState<Date | null>(null);
  const [isAccessible, setIsAccessible] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
        // Novel is now accessible, stop polling
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setNextCheckTime(null); // カウントダウン停止
        onAccessible?.(item);

        // Handle differently for iPhone Safari vs others
        if (isIPhoneSafari()) {
          // iPhone Safari: Show "accessible" state and vibrate
          setIsAccessible(true);
          if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200]);
          }
        } else {
          // Other browsers: Auto-open as before
          openNovel(item);
        }
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
          setNextCheckTime(null); // カウントダウン停止
          return newCount;
        }
        // 次回チェック時刻を設定
        setNextCheckTime(new Date(Date.now() + POLLING_INTERVAL));
        return newCount;
      });
    };

    // 初回チェック
    void poll();

    // ポーリング設定
    intervalRef.current = setInterval(() => {
      void poll();
    }, POLLING_INTERVAL);
  }, [checkNovelAccess, onAccessible, openNovel]);

  useEffect(() => {
    if (item) {
      setRetryCount(0);
      setIsChecking(false);
      setIsAccessible(false);
      setNextCheckTime(new Date(Date.now() + POLLING_INTERVAL)); // 初回の次回チェック時刻
      startPolling(item);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setNextCheckTime(null);
    };
  }, [item, startPolling]);

  const handleCancel = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setNextCheckTime(null);
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
        onAccessible?.(item);

        // Handle differently for iPhone Safari vs others
        if (isIPhoneSafari()) {
          setIsAccessible(true);
          if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200]);
          }
        } else {
          openNovel(item);
        }
      } else {
        // 次回チェック時刻をリセット
        setNextCheckTime(new Date(Date.now() + POLLING_INTERVAL));
      }
    })();
  }, [item, checkNovelAccess, onAccessible, openNovel]);

  const isMaxRetriesReached = retryCount >= MAX_RETRY_COUNT;

  return (
    <Dialog
      open={!!item}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          handleCancel();
        }
      }}
      disableEscapeKeyDown
    >
      <DialogTitle>
        {isAccessible ? '✅ 小説が公開されました！' : '小説の公開を待っています...'}
      </DialogTitle>
      <DialogContent>
        {isAccessible ? (
          <>
            <DialogContentText>
              「{item?.title}」が公開されました！
            </DialogContentText>
            <DialogContentText>
              もう一度小説をタップして開いてください。
            </DialogContentText>
          </>
        ) : (
          <>
            <DialogContentText>
              「{item?.title}」の次の話がまだ公開されていません。
            </DialogContentText>
            <DialogContentText>
              自動的に公開をチェックし、公開され次第開きます。
            </DialogContentText>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              {isChecking && <CircularProgress size={16} />}
              {isChecking
                ? '確認中...'
                : isMaxRetriesReached
                  ? '最大試行回数に達しました'
                  : (
                    <CountdownTimer
                      targetTime={nextCheckTime}
                      intervalMs={POLLING_INTERVAL}
                    />
                  )
              }
            </Typography>
            {retryCount > 0 && (
              <Typography variant="body2" color="text.secondary">
                確認回数: {retryCount}/{MAX_RETRY_COUNT}
              </Typography>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        {isAccessible ? (
          <>
            <Button
              onClick={handleCancel}
              variant="outlined"
              size="medium"
              data-testid="close-button"
            >
              閉じる
            </Button>
            <Button
              onClick={handleOpenAnyway}
              variant="contained"
              size="medium"
              color="primary"
              data-testid="open-novel-button"
              autoFocus
            >
              小説を開く
            </Button>
          </>
        ) : (
          <>
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
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
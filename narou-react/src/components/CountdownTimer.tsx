import { CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetTime: Date | null;  // カウントダウンの目標時刻
  intervalMs: number;       // 全体の間隔（プログレスバー計算用）
}

export const CountdownTimer = React.memo(function CountdownTimer({
  targetTime,
  intervalMs
}: CountdownTimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    if (!targetTime) {
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const diff = Math.max(0, Math.floor((targetTime.getTime() - now.getTime()) / 1000));
      setRemainingSeconds(diff);
    };

    // 初回更新
    updateCountdown();

    // 1秒ごとに更新
    const interval = setInterval(updateCountdown, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [targetTime]);

  if (!targetTime || remainingSeconds <= 0) {
    return null;
  }

  const progress = ((intervalMs / 1000 - remainingSeconds) / (intervalMs / 1000)) * 100;

  return (
    <>
      <CircularProgress
        size={16}
        variant="determinate"
        value={progress}
      />
      次回確認まで: {remainingSeconds}秒
    </>
  );
});
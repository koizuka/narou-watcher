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
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!targetTime) {
      return;
    }

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [targetTime]);

  if (!targetTime) {
    return null;
  }

  const remainingSeconds = Math.max(0, Math.floor((targetTime.getTime() - now) / 1000));
  if (remainingSeconds <= 0) {
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
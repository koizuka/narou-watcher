import { DateTime } from 'luxon';
import React from 'react';

/**
 * 画面下端にビルド日時を表示するコンポーネント
 * 
 * usage: write a following line into `define` in `vite.config.ts`
 * 
 *  ```
 *  'import.meta.env.BUILD_DATE': JSON.stringify(DateTime.now().toISO()),
 *  ```
 */
export function BuildTimestamp(props: { name: string; }) {
  return (
    <div style={{
      display: "inline-block",
      position: "fixed",
      bottom: 0,
      right: 0,
      fontSize: "small",
      fontStyle: "italic",
    }}>{props.name}: {DateTime.fromISO(import.meta.env.BUILD_DATE as string).toISO()}</div>
  );
}

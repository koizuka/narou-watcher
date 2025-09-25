import React from 'react';

/**
 * 画面下端にビルド日時を表示するコンポーネント
 *
 * usage: write a following line into `define` in `vite.config.ts`
 *
 *  ```
 *  'import.meta.env.BUILD_DATE': JSON.stringify(new Date().toISOString()),
 *  ```
 */
export function BuildTimestamp(props: { name: string; }) {
  // Parse ISO string and display in local timezone
  const buildDate = new Date(import.meta.env.BUILD_DATE as string).toISOString();
  return (
    <div style={{
      display: "inline-block",
      position: "fixed",
      bottom: 0,
      right: 0,
      fontSize: "small",
      fontStyle: "italic",
    }}>{props.name}: {buildDate}</div>
  );
}

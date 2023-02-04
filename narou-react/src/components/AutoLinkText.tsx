import React, { useMemo } from 'react';

export function AutoLinkText({ text }: { text: string; }) {
  const items = useMemo(() => {
    const matches = text.matchAll(/(https?:\/\/[^\s]+)/g);
    let i = 0;
    const items = [];
    for (const m of matches) {
      items.push({
        text: text.substring(i, m.index),
        href: m[1],
      });
      i = (m.index ?? 0) + m[0].length;
    }
    return items;
  }, [text]);
  return (
    <>
      {items.map(
        (item) => <>
          {item.text}
          <a href={item.href}>{item.href}</a>
        </>
      )}
    </>
  );
}

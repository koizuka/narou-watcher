import { useEffect } from 'react';

export type HotKeys = {
  [key: string]: (event: KeyboardEvent) => void;
}

type KeyCombination = {
  key: string;
  shiftKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
  metaKey: boolean;
};

function toKeyString(event: KeyboardEvent | KeyCombination): string {
  return [
    event.shiftKey && 'shift',
    event.ctrlKey && 'ctrl',
    event.altKey && 'alt',
    event.metaKey && 'meta',
    event.key.toLowerCase(),
  ].filter(s => s !== false).join('+');
}

export function checkKeyString(keyString: string): string {
  const match = keyString.toLowerCase().match(/^((?:(?:shift|ctrl|alt|meta)\+)*)(\+|\w+)$/);
  if (match === null) {
    throw new Error(`Invalid key string: ${keyString}`);
  }
  const [_, modifiers, key] = match;

  return toKeyString({
    key,
    shiftKey: /\bshift\b/.test(modifiers),
    ctrlKey: /\bctrl\b/.test(modifiers),
    altKey: /\balt\b/.test(modifiers),
    metaKey: /\bmeta\b/.test(modifiers),
  });
}

export function useHotKeys(hotkeys: HotKeys) {
  useEffect(() => {
    const keys = Object.keys(hotkeys);
    if (keys.length > 0) {
      const table = Object.fromEntries(keys.map(key => [checkKeyString(key), hotkeys[key]]));

      const onKeyDown = (event: KeyboardEvent) => {
        const handler = table[toKeyString(event)];
        if (handler) {
          handler(event);
        }
      };
      document.addEventListener('keydown', onKeyDown, false);
      return () => {
        document.removeEventListener('keydown', onKeyDown);
      };
    }
  }, [hotkeys]);
}

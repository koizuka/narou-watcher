export function useAppBadge(): { setAppBadge: (count?: number) => Promise<void>; clearAppBadge: () => Promise<void>; } {
  if ('setAppBadge' in navigator && 'clearAppBadge' in navigator) {
    return {
      setAppBadge: (count) => (navigator as any).setAppBadge(count),
      clearAppBadge: () => (navigator as any).clearAppBadge(),
    };
  } else {
    return {
      setAppBadge: () => Promise.resolve(),
      clearAppBadge: () => Promise.resolve(),
    };
  }
}

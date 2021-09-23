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

export function useClientBadge(): { setClientBadge: (count?: number) => Promise<void>; clearClientBadge: () => Promise<void>; } {
  if ('setClientBadge' in navigator && 'clearClientBadge' in navigator) {
    return {
      setClientBadge: (count) => (navigator as any).setClientBadge(count),
      clearClientBadge: () => (navigator as any).clearClientBadge(),
    };
  } else {
    return {
      setClientBadge: () => Promise.resolve(),
      clearClientBadge: () => Promise.resolve(),
    };
  }
}


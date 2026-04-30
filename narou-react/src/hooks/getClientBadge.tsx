type NavigatorWithClientBadge = Navigator & {
  setClientBadge: (count?: number) => Promise<void>;
  clearClientBadge: () => Promise<void>;
};
function isNavigatorWithClientBadge(navigator: Navigator): navigator is NavigatorWithClientBadge {
  return 'setClientBadge' in navigator && 'clearClientBadge' in navigator;
}

export function getClientBadge(): { setClientBadge: (count?: number) => Promise<void>; clearClientBadge: () => Promise<void>; } {
  if (isNavigatorWithClientBadge(navigator)) {
    const n = navigator;
    return {
      setClientBadge: (count) => n.setClientBadge(count),
      clearClientBadge: () => n.clearClientBadge(),
    };
  } else {
    return {
      setClientBadge: () => Promise.resolve(),
      clearClientBadge: () => Promise.resolve(),
    };
  }
}

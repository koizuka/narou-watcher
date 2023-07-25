
type NavigatorWithAppBadge = Navigator & {
  setAppBadge: (count?: number) => Promise<void>;
  clearAppBadge: () => Promise<void>;
};
function isNavigatorWithAppBadge(navigator: Navigator): navigator is NavigatorWithAppBadge {
  return 'setAppBadge' in navigator && 'clearAppBadge' in navigator;
}

export function useAppBadge(): { setAppBadge: (count?: number) => Promise<void>; clearAppBadge: () => Promise<void>; } {
  if (isNavigatorWithAppBadge(navigator)) {
    return {
      setAppBadge: (count) => navigator.setAppBadge(count),
      clearAppBadge: () => navigator.clearAppBadge(),
    };
  } else {
    return {
      setAppBadge: () => Promise.resolve(),
      clearAppBadge: () => Promise.resolve(),
    };
  }
}



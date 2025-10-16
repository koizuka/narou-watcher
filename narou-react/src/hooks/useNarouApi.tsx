import { useState } from "react";
import { NarouApi } from "../narouApi/NarouApi";

function getServerAddress(location: Location): string {
  const server = new URLSearchParams(location.search).get('server')
  if (server) {
    return server;
  }
  if (location.protocol === 'http:') {
    // 開発環境ではViteのproxyを使用するため、現在のホストを返す
    return location.protocol + '//' + location.host;
  }
  // github.io であればAPIは置けないから除外
  if (!/.*\.github\.io$/.test(location.hostname)) {
    // 置いてるサイトにAPIがあると期待する
    return location.protocol + '//' + location.host + location.pathname;
  }
  return '';
}

export function useNarouApi(): [NarouApi | null, boolean] {
  const [api] = useState<NarouApi | null>(() => {
    const host = getServerAddress(document.location);
    return host ? new NarouApi(host) : null;
  });
  const [hostError] = useState(() => {
    const host = getServerAddress(document.location);
    return !host;
  });

  return [api, hostError];
}


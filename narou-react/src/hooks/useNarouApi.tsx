import { useState, useEffect } from "react";
import { NarouApi } from "../narouApi/NarouApi";

function getServerAddress(location: Location): string {
  const server = new URLSearchParams(location.search).get('server')
  if (server) {
    return server;
  }
  if (location.protocol === 'http:') {
    return 'http://localhost:7676';
  }
  // github.io であればAPIは置けないから除外
  if (!/.*\.github\.io$/.test(location.hostname)) {
    // 置いてるサイトにAPIがあると期待する
    return location.protocol + '//' + location.host + location.pathname;
  }
  return '';
}

export function useNarouApi(): [NarouApi | null, boolean] {
  const [api, setApi] = useState<NarouApi | null>(null);
  const [hostError, setHostError] = useState(false);
  useEffect(() => {
    const host = getServerAddress(document.location);
    if (host) {
      setApi(new NarouApi(host));
    } else {
      setHostError(true);
    }
  }, [])

  return [api, hostError];
}


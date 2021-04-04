import { useEffect, useState } from 'react';
import useSWR from 'swr';

export function useWebSocket(url: string | null) {
  type State = 'not connected' | 'connect' | 'connecting' | 'connected';
  const [state, setState] = useState<State>('connect');

  // SWRでクリックしたみたいな revalidate が発生されるときだけ retry する
  const { isValidating } = useSWR('dummy', () => true);

  useEffect(() => {
    if (!url || state !== 'connect') {
      return;
    }
    setState('connecting');
    try {
      const conn = new WebSocket(url);
      conn.onopen = () => {
        console.log('websocket: connected.');
        setState('connected');
      };
      conn.onmessage = (event) => {
        console.log(`websocket: msg = '${event.data}'`);
      };
      conn.onclose = () => {
        console.log('websocket: closed.');
        setState('not connected');
      };
      conn.onerror = (event) => {
        console.log('websocket: error: ', event);
        setState('not connected');
      };
    } catch (e) {
      console.log('WebSocket error: ', e);
      setState('not connected');
    }
  }, [url, state]);

  // retry connection
  useEffect(() => {
    if (url && isValidating) {
      switch (state) {
        case 'not connected':
          console.log('retry');
          setState('connect');
          break;
      }
    }
  }, [isValidating, state, url]);

  return {
    connected: state === 'connected'
  };
}

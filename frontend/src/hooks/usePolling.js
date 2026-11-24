import { useEffect, useRef } from 'react';

/**
 * Runs `callback` immediately and then on a fixed interval.
 * Used to keep the health panel "live" without a websocket.
 */
export function usePolling(callback, intervalMs = 15000) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    savedCallback.current();
    if (!intervalMs) return undefined;
    const id = setInterval(() => savedCallback.current(), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
}

export default usePolling;

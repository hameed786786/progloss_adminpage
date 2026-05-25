import { useEffect, useRef, useState } from 'react';
import { getSocket } from './socket';

type Fetcher<T> = () => Promise<T[]>;

export function useRealtime<T = any>(channel: string, fetcher: Fetcher<T>, event = `${channel}:update`) {
  const [data, setData] = useState<T[]>([]);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    let sock: any;

    fetcher()
      .then((d) => {
        if (mounted.current) setData(d || []);
      })
      .catch(() => undefined);

    getSocket()
      .then((s) => {
        sock = s;
        sock.on(event, (payload: any) => {
          // server may emit full list or single item
          if (Array.isArray(payload)) setData(payload);
          else if (payload && payload.id) setData((prev) => {
            const idx = prev.findIndex((p) => (p as any).id === (payload as any).id);
            if (idx === -1) return [payload, ...prev];
            const next = prev.slice();
            next[idx] = payload;
            return next;
          });
        });
      })
      .catch(() => undefined);

    const handleLocalUpdate = (eventObject: Event) => {
      const customEvent = eventObject as CustomEvent;
      const payload = customEvent.detail;
      if (Array.isArray(payload)) setData(payload);
      else if (payload && payload.id) setData((prev) => {
        const idx = prev.findIndex((p) => (p as any).id === (payload as any).id);
        if (idx === -1) return [payload, ...prev];
        const next = prev.slice();
        next[idx] = payload;
        return next;
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener(event, handleLocalUpdate as EventListener);
    }

    return () => {
      mounted.current = false;
      if (sock) sock.off(event);
      if (typeof window !== 'undefined') {
        window.removeEventListener(event, handleLocalUpdate as EventListener);
      }
    };
  }, [channel]);

  return data;
}

export default useRealtime;

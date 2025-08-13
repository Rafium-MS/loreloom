import { useEffect } from 'react';

type HotkeyHandler = (event: KeyboardEvent) => void;
type HotkeyMap = Record<string, HotkeyHandler>;

const isMac = typeof navigator !== 'undefined' && /mac/i.test(navigator.platform);

/**
 * Simple hotkey hook that listens for keyboard shortcuts like ctrl+s.
 * Pass an object where the keys are in the format "ctrl+k".
 */
export default function useHotkeys(map: HotkeyMap) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const ctrl = e.ctrlKey || (isMac && e.metaKey);
      const combo = `ctrl+${key}`;
      const fn = map[combo];
      if (ctrl && fn) {
        e.preventDefault();
        fn(e);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [map]);
}


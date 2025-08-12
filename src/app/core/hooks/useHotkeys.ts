import { useEffect } from 'react';

/**
 * Bind a callback to a specific keyboard key.
 * @param key Keyboard key to listen for
 * @param callback Function invoked when the key is pressed
 */
export default function useHotkeys(key: string, callback: () => void) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === key) {
        callback();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, callback]);
}
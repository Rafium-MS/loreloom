import { useEffect } from 'react';
import { useAppState } from '../state/store';

/**
 * Simple autosave hook that stores a value in localStorage after a delay.
 * @param key Storage key to save under
 * @param value Value to persist
 * @param delay Debounce delay in milliseconds
 */
export default function useAutosave(key: string, value: string, delay = 1000) {
  const setLastSaved = useAppState((s) => s.setLastSaved);
  useEffect(() => {
    const handler = setTimeout(() => {
      try {
        localStorage.setItem(key, value);
        setLastSaved(Date.now());
      } catch {
        // ignore write errors
      }
    }, delay);
    return () => clearTimeout(handler);
  }, [key, value, delay, setLastSaved]);
}
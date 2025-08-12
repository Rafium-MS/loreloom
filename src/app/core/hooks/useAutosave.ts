import { useEffect } from 'react';

/**
 * Simple autosave hook that stores a value in localStorage after a delay.
 * @param key Storage key to save under
 * @param value Value to persist
 * @param delay Debounce delay in milliseconds
 */
export default function useAutosave(key: string, value: string, delay = 1000) {
  useEffect(() => {
    const handler = setTimeout(() => {
      try {
        localStorage.setItem(key, value);
      } catch {
        // ignore write errors
      }
    }, delay);
    return () => clearTimeout(handler);
  }, [key, value, delay]);
}
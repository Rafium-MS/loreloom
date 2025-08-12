import { useEffect, useState } from 'react';

/**
 * Return a debounced version of a value.
 * @param value Value to debounce
 * @param delay Delay in milliseconds
 */
export default function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}
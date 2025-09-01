import '@testing-library/jest-dom';
import 'fake-indexeddb/auto';

if (typeof window !== 'undefined') {
  // Ensure fake-indexeddb is available via window
  // @ts-ignore
  window.indexedDB = indexedDB;
}

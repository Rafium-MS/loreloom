// Lightweight debounce utility for ESM imports
// Usage: const handler = debounce(fn, 300)
export function debounce(fn, wait = 300) {
  let timer;
  return function debounced(...args) {
    clearTimeout(timer);
    const context = this;
    timer = setTimeout(() => fn.apply(context, args), wait);
  };
}


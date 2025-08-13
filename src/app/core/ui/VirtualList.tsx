import React, { useRef, useState, useMemo, useCallback, ReactNode } from 'react';

interface VirtualListProps<T> {
  items: T[];
  /** Container height in pixels */
  height: number;
  /** Item height in pixels or a function returning the height */
  itemHeight: number | ((item: T, index: number) => number);
  /** Render a single item */
  render: (item: T, index: number) => ReactNode;
  /** Additional overscan items */
  overscan?: number;
}

function VirtualList<T>({ items, height, itemHeight, render, overscan = 5 }: VirtualListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const heights = useMemo(() =>
    items.map((item, i) => (typeof itemHeight === 'function' ? itemHeight(item, i) : itemHeight)),
  [items, itemHeight]);

  const offsets = useMemo(() => {
    const arr: number[] = [];
    heights.reduce((acc, h, i) => {
      arr[i] = acc;
      return acc + h;
    }, 0);
    return arr;
  }, [heights]);

  const totalHeight = useMemo(() => heights.reduce((sum, h) => sum + h, 0), [heights]);

  const onScroll = useCallback(() => {
    setScrollTop(parentRef.current?.scrollTop || 0);
  }, []);

  const startIndex = useMemo(() => {
    let i = 0;
    while (i < offsets.length && offsets[i] + heights[i] < scrollTop) i++;
    return i;
  }, [offsets, heights, scrollTop]);

  const endIndex = useMemo(() => {
    let i = startIndex;
    const max = scrollTop + height;
    while (i < items.length && offsets[i] < max) i++;
    return Math.min(i + overscan, items.length);
  }, [startIndex, offsets, items.length, height, scrollTop, overscan]);

  return (
    <div ref={parentRef} onScroll={onScroll} style={{ height, overflowY: 'auto' }}>
      <div style={{ height: totalHeight, position: 'relative' }}>
        {items.slice(startIndex, endIndex).map((item, i) => {
          const index = startIndex + i;
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                top: offsets[index],
                left: 0,
                right: 0,
                height: heights[index],
              }}
            >
              {render(item, index)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default VirtualList;

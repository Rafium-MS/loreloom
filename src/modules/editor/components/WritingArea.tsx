import React, { useEffect, useRef } from 'react';

const sanitize = (html: string) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('script').forEach((el) => el.remove());
  return doc.body.innerHTML;
};

interface Props {
  value: string;
  onChange: (value: string) => void;
  mode: 'normal' | 'focus' | 'dark';
}

const modeClasses: Record<string, string> = {
  normal: 'bg-white text-gray-900',
  focus: 'bg-amber-50 text-gray-800 max-w-3xl mx-auto leading-relaxed',
  dark: 'bg-gray-900 text-gray-100',
};

const WritingArea: React.FC<Props> = ({ value, onChange, mode }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const clean = sanitize(value);
      if (ref.current.innerHTML !== clean) {
        ref.current.innerHTML = clean;
      }
    }
  }, [value]);

  const handleInput = () => {
    if (ref.current) {
      const dirty = ref.current.innerHTML;
      const clean = sanitize(dirty);
      if (dirty !== clean) {
        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);
        ref.current.innerHTML = clean;
        if (range) {
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }
      onChange(clean);
    }
  };

  return (
    <div
      ref={ref}
      contentEditable
      onInput={handleInput}
      className={`min-h-[24rem] p-4 outline-none ${modeClasses[mode]}`}
    />
  );
};

export default WritingArea;
import React, { useEffect, useRef } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  mode: 'normal' | 'focus' | 'dark';
}

const modeClasses: Record<string, string> = {
  normal: 'bg-white text-gray-900',
  focus: 'bg-amber-50 text-gray-800',
  dark: 'bg-gray-900 text-gray-100',
};

const WritingArea: React.FC<Props> = ({ value, onChange, mode }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (ref.current) {
      onChange(ref.current.innerHTML);
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
import React, { useEffect, useState } from 'react';
import { useAppState } from '../state/store';

interface Props {
  wordCount?: number;
}

const StatusBar: React.FC<Props> = ({ wordCount }) => {
  const lastSaved = useAppState((s) => s.lastSaved);
  const [text, setText] = useState('');

  useEffect(() => {
    const update = () => {
      if (!lastSaved) {
        setText('Nunca salvo');
        return;
      }
      const diff = Math.floor((Date.now() - lastSaved) / 1000);
      setText(`Salvo há ${diff}s`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [lastSaved]);

  return (
    <footer className="border-t px-4 py-1 text-sm flex justify-between bg-gray-50 dark:bg-gray-900">
      <span>{wordCount != null ? `${wordCount} palavras` : ''}</span>
      <span>{text}</span>
    </footer>
  );
};

export default StatusBar;


import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import CommandPalette from '../core/ui/CommandPalette';
import useHotkeys from '../core/hooks/useHotkeys';
import { useAppState } from '../core/state/store';

const Topbar: React.FC = () => {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const lastSaved = useAppState((s) => s.lastSaved);
  const [status, setStatus] = useState('');

  useHotkeys({ 'ctrl+k': () => setPaletteOpen(true) });

  useEffect(() => {
    const update = () => {
      if (!lastSaved) {
        setStatus('Nunca salvo');
        return;
      }
      const diff = Math.floor((Date.now() - lastSaved) / 1000);
      setStatus(`Salvo há ${diff}s`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [lastSaved]);

  const toggleTheme = () => {
    setDark((d) => !d);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="flex items-center justify-between p-4 border-b">
      <input
        type="text"
        placeholder="Buscar..."
        onFocus={() => setPaletteOpen(true)}
        className="border p-1 rounded w-1/2"
      />
      <div className="flex items-center space-x-4">
        <span className="text-sm">{status}</span>
        <button onClick={toggleTheme} className="p-2 rounded hover:bg-gray-200">
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </header>
  );
};

export default Topbar;


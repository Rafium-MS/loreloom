// =============================
// src/ui/ThemeToggle.tsx
// Botão de alternância de tema
// =============================
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import '../tokens.css';


const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const isFocus = theme === 'focus';
  return (
    <button
      onClick={() => setTheme(isFocus ? 'dark' : 'focus')}
      className="token-btn inline-flex items-center gap-2 px-3 py-2 border border-[var(--border)] hover:opacity-90 transition"
      title={isFocus ? 'Ir para Dark Studio' : 'Ir para Focus Pergaminho'}
      aria-label="Alternar tema"
    >
      {isFocus ? <Moon size={16} className="opacity-80"/> : <Sun size={16} className="opacity-80"/>}
      <span className="text-sm">{isFocus ? 'Dark' : 'Focus'}</span>
    </button>
  );
};


export default ThemeToggle;
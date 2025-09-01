// =============================
// src/ui/ThemeProvider.tsx
// Contexto de tema (dark | focus) + persistência
// =============================
import { createContext, useContext, useEffect, useState } from 'react';
import '../tokens.css';


export type Theme = 'dark' | 'focus';


interface ThemeCtxShape { theme: Theme; setTheme: (t: Theme) => void; }
const ThemeCtx = createContext<ThemeCtxShape | null>(null);


export const ThemeProvider = ({ children }: { children: any }) => {
const [theme, setTheme] = useState((localStorage.getItem('theme') as Theme) || 'dark');


useEffect(() => {
const root = document.documentElement;
if (theme === 'focus') root.classList.add('theme-focus'); else root.classList.remove('theme-focus');
localStorage.setItem('theme', theme);
}, [theme]);


return <ThemeCtx.Provider value={{ theme, setTheme }}>{children}</ThemeCtx.Provider>;
};


export const useTheme = () => {
const ctx = useContext(ThemeCtx);
if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
return ctx;
};
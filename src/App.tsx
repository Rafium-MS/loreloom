import React from 'react';
import ThemeToggle from './ui/ThemeToggle';
import FictionEditor from './editor.tsx';
import UniverseCreator from './universeCreator';
import logoUrl from '../assets/logo.png';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import './tokens.css';
import { Button } from '@/components/ui/button';

const App = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <img src={logoUrl} alt="LoreLoom" className="h-5 w-auto" />
          <strong>LoreLoom</strong>
        </div>
        <nav className="flex items-center gap-3" aria-label="Navegação principal">
          <Link
            to="/editor"
            className="px-2 py-1 cursor-pointer no-underline"
            aria-current={location.pathname === '/editor' ? 'page' : undefined}
          >
            Editor
          </Link>
          <Link
            to="/universo"
            className="px-2 py-1 cursor-pointer no-underline"
            aria-current={location.pathname === '/universo' ? 'page' : undefined}
          >
            Universo
          </Link>
          <ThemeToggle />
          <Button>Shadcn</Button>
        </nav>
      </header>
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/editor" element={<FictionEditor />} />
          <Route path="/universo" element={<UniverseCreator />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;

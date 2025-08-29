import React from 'react';
import ThemeToggle from './ui/ThemeToggle';
import FictionEditor from './editor';
import UniverseCreator from './universeCreator';
import logoUrl from '../assets/logo.png';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

const App: React.FC = () => {
  const location = useLocation();

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src={logoUrl} alt="LoreLoom" height={24} />
          <strong>LoreLoom</strong>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link
            to="/editor"
            style={{
              background: 'none',
              border: 'none',
              padding: '4px 8px',
              cursor: 'pointer',
              textDecoration: 'none',
              fontWeight: location.pathname === '/editor' ? 'bold' : 'normal',
            }}
          >
            Editor
          </Link>
          <Link
            to="/universo"
            style={{
              background: 'none',
              border: 'none',
              padding: '4px 8px',
              cursor: 'pointer',
              textDecoration: 'none',
              fontWeight: location.pathname === '/universo' ? 'bold' : 'normal',
            }}
          >
            Universo
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main style={{ flex: 1, overflow: 'auto' }}>
        <Routes>
          <Route path="/editor" element={<FictionEditor />} />
          <Route path="/universo" element={<UniverseCreator />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;

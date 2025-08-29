import React, { useState } from 'react';
import ThemeToggle from './ui/ThemeToggle';
import FictionEditor from './editor';
import UniverseCreator from './universeCreator';
import logoUrl from '../assets/logo.png';

const App: React.FC = () => {
  const [page, setPage] = useState<'editor' | 'universe'>('editor');

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
          <button
            onClick={() => setPage('editor')}
            style={{
              background: 'none',
              border: 'none',
              padding: '4px 8px',
              cursor: 'pointer',
              fontWeight: page === 'editor' ? 'bold' : 'normal',
            }}
          >
            Editor
          </button>
          <button
            onClick={() => setPage('universe')}
            style={{
              background: 'none',
              border: 'none',
              padding: '4px 8px',
              cursor: 'pointer',
              fontWeight: page === 'universe' ? 'bold' : 'normal',
            }}
          >
            Universo
          </button>
          <ThemeToggle />
        </div>
      </header>
      <main style={{ flex: 1, overflow: 'auto' }}>
        {page === 'editor' ? <FictionEditor /> : <UniverseCreator />}
      </main>
    </div>
  );
};

export default App;

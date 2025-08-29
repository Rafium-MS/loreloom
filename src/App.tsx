import React from 'react';
import ThemeToggle from './ui/ThemeToggle';
import logoUrl from '../assets/logo.png';

const App: React.FC = () => {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src={logoUrl} alt="LoreLoom" height={24} />
          <strong>LoreLoom</strong>
        </div>
        <ThemeToggle />
      </header>
      <main style={{ flex: 1, padding: 16 }}>
        <div className="token-card" style={{ padding: 16 }}>
          <h1 style={{ margin: 0, marginBottom: 8 }}>Bem-vindo 👋</h1>
          <p style={{ margin: 0, opacity: 0.9 }}>
            Estrutura React inicial criada com Vite + TypeScript. Edite o arquivo <code>src/App.tsx</code> e adicione suas páginas/componentes.
          </p>
        </div>
      </main>
    </div>
  );
};

export default App;

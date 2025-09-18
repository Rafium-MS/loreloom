import React from 'react';
import ThemeToggle from './ui/ThemeToggle';
import FictionEditor from './editor.tsx';
import UniverseCreator from './universeCreator';
import logoUrl from '../assets/logo.png';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import './tokens.css';
import { Button } from '@/components/ui/button';
import { useAuth } from './context/AuthContext';
import UserManagement from '@/pages/UserManagement';

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdminMaster, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-sm text-muted">
        Carregando permissões...
      </div>
    );
  }

  if (!isAdminMaster) {
    return <Navigate to="/editor" replace />;
  }

  return <>{children}</>;
}

const App = () => {
  const location = useLocation();
  const currentPath = location.pathname === '/' ? '/editor' : location.pathname;
  const { isAdminMaster, loading } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <img src={logoUrl} alt="LoreLoom" className="h-5 w-auto" />
          <strong>LoreLoom</strong>
        </div>
        <nav
          className="flex flex-col sm:flex-row items-start sm:items-center gap-1"
          aria-label="Navegação principal"
        >
          <Button
            asChild
            variant={currentPath === '/editor' ? 'secondary' : 'ghost'}
          >
            <Link to="/editor">Editor</Link>
          </Button>
          <Button
            asChild
            variant={currentPath === '/universo' ? 'secondary' : 'ghost'}
          >
            <Link to="/universo">Universo</Link>
          </Button>
          {!loading && isAdminMaster ? (
            <Button
              asChild
              variant={currentPath === '/usuarios' ? 'secondary' : 'ghost'}
            >
              <Link to="/usuarios">Usuários</Link>
            </Button>
          ) : null}
          <ThemeToggle />
        </nav>
      </header>
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/editor" replace />} />
          <Route path="/editor" element={<FictionEditor />} />
          <Route path="/universo" element={<UniverseCreator />} />
          <Route
            path="/usuarios"
            element={
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;

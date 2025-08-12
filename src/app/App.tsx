import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import AppRoutes from './routes';
import { AppStateProvider } from './core/state/store';

const App: React.FC = () => (
  <AppStateProvider>
    <BrowserRouter>
      <MainLayout>
        <AppRoutes />
      </MainLayout>
    </BrowserRouter>
  </AppStateProvider>
);

export default App;
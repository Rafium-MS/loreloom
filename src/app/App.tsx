import React from 'react';
import AppRoutes from './routes';
import { AppStateProvider } from './core/state/store';

const App: React.FC = () => (
  <AppStateProvider>
    <AppRoutes />
  </AppStateProvider>
);

export default App;

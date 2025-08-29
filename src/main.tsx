import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from './ui/ThemeProvider';
import App from './App';
import './index.css';
import './ui/theme.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);


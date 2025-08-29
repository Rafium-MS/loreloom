import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from './ui/ThemeProvider';
import App from './App';
import './index.css';
import './tokens.css';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

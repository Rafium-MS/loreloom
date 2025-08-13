import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import "./styles/tokens.css";
import "./styles/globals.css";
import { ThemeProvider } from "./app/core/ui/ThemeProvider";
import { ToastProvider } from './core/ui/Toast';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  
  <React.StrictMode>
    <BrowserRouter>
    <ThemeProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
    );

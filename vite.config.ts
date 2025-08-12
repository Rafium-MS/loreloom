import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    // Define "src" as project root so Vite can locate index.html
  root: 'src',
  plugins: [
    react({
      // Ativa a transformação automática de JSX com React 17+
      jsxRuntime: 'automatic',
      // Habilita Fast Refresh
      fastRefresh: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  server: {
    port: 5173,
    open: true,
    strictPort: true,
  },
  build: {
    // Saída para o diretório "dist" na raiz do projeto
    outDir: '../dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'uuid', 'lucide-react'],
        },
      },
    },
  },
});

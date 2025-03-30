import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  base: '/',  // Ensures correct base path for SPA routing
  build: {
    outDir: 'dist',
  }
});

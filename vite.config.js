import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import serviceWorker from './tools/sw-plugin.js';

// Relative base so the build works from any GitHub Pages path (user.github.io/repo/).
export default defineConfig({
  base: './',
  plugins: [react(), serviceWorker()],
  build: { outDir: 'dist', sourcemap: false },
});

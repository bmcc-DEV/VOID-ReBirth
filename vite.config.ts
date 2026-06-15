import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

const base = process.env.NETLIFY === 'true' ? '/' : '/VOID-ReBirth/';

export default defineConfig({
  base: base,
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'void_core': resolve(__dirname, 'ET-COSMIC/void_core/pkg'),
    },
  },
  build: {
    target: 'es2022',
    minify: true,
  },
  server: {
    port: 5173,
  },
});

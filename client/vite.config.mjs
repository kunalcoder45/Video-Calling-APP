import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import polyfillNode from 'rollup-plugin-polyfill-node';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      global: 'global',            // Polyfill global
      buffer: 'buffer',            // Polyfill Buffer
      crypto: 'crypto-browserify', // Polyfill crypto
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        polyfillNode(), // Apply polyfills for Node.js built-ins
      ],
    },
  },
});

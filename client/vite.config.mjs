// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     react(),
//     tailwindcss()
//   ],
// })
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import polyfillNode from 'rollup-plugin-polyfill-node';
import path from 'path';

// https://vitejs.dev/config/
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

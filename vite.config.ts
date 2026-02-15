import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // This allows the Gemini API to find process.env.API_KEY in the browser
    'process.env': {
      ...process.env,
      API_KEY: process.env.API_KEY
    }
  },
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', '@google/genai']
        }
      }
    }
  }
});
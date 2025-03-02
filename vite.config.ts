import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '3000')
  },
  preview: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '3000')
  }
});

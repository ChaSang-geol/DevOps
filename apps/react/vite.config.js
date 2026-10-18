import { defineConfig } from 'vite';
export default defineConfig({ server: {
  port: 5173, strictPort: true, watch: { usePolling: true },
  proxy: { '/api': { target: 'http://spring:8080', changeOrigin: true } }
} });

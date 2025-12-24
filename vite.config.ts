import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://api.chaosep.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Proxy Error (Production):', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('>>> Proxying to Production:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('<<< Response from Production:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
});
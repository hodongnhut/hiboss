import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://api.chaosep.com',
        changeOrigin: true, // Bắt buộc phải true để bypass các filter Host header trên Production
        secure: true,      // Production dùng HTTPS nên để true
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
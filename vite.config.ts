import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://46.250.237.192',  // Không cần https nếu backend http
        changeOrigin: true,
        secure: false,  // Bỏ check SSL nếu có
        rewrite: (path) => path.replace(/^\/api/, ''),  // Bỏ /api → /site/login
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.error('Proxy Error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('>>> Proxy Request:', req.method, req.url, '->', proxyReq.path);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('<<< Proxy Response:', proxyRes.statusCode, req.url);
            if (proxyRes.statusCode === 301 || proxyRes.statusCode === 302) {
              console.log('Redirect Location:', proxyRes.headers.location);
            }
          });
        },
      },
    },
  },
});
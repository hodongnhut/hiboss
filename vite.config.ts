import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://api.chaosep.com',
        changeOrigin: true,
        secure: false, // Bỏ qua kiểm tra chứng chỉ SSL để tránh lỗi kết nối trong môi trường sandbox
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Proxy Error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Thêm các Header cần thiết nếu Backend yêu cầu
            proxyReq.setHeader('Origin', 'https://api.chaosep.com');
          });
        },
      },
    },
  },
});
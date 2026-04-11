import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5175,
    host: '0.0.0.0',
    cors: true,
    proxy: {
      '/node/api': {
        target: 'https://qb3.idbhost.com:28888',
        changeOrigin: true,
        secure: true
      }
    }
  },
});

import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/auth/auth.ts',
      name: 'SSAuth',
      fileName: (format) => `auth.${format}.js`,
      formats: ['es', 'iife']
    }
  },
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

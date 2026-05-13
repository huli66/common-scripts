import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@sentry': path.resolve(__dirname, '../src/sentry'),
    },
  },
  server: {
    port: 3200,
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
})

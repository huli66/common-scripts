import { defineConfig } from 'vite';

const entries: Record<string, { entry: string }> = {
  auth: { entry: 'src/auth/auth.ts' },
  sentry: { entry: 'src/sentry/sentry.ts' },
};

const target = process.env.BUILD_TARGET;
const targets = target ? [target] : Object.keys(entries);

export default defineConfig({
  build: {
    minify: true,
    outDir: `dist/${target}`,
    lib: {
      entry: Object.fromEntries(targets.map((t) => [t, entries[t].entry])),
      fileName: (format, entryName) => `${entryName}.${format}.js`,
      formats: ['es'],
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

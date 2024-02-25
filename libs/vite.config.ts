import { defineConfig } from 'vitest/config';
import * as path from 'node:path';

export default defineConfig({
  test: {
    globals: true,
    hookTimeout: 1000000,
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
    },
  },
});

import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import * as path from 'node:path';

export default defineConfig({
  test: {
    include: ['**/*.integ-spec.ts'],
    globals: true,
    root: './',
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, '.'),
    },
  },
  plugins: [
    // This is required to build the test files with SWC
    swc.vite({
      // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
      module: { type: 'es6' },
    }),
  ],
});
